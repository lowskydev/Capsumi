"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CapsuleCard } from "@/components/capsule-card"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Plus } from "lucide-react"
import { CapsuleStorage, type Capsule } from "@/lib/capsule-storage"
import { useAuth } from "@/components/auth-context"
import { AdvancedSearchBar, type DateMode, type FilterStatus } from "@/components/advanced-search-bar"

export default function MyCapsulesPage() {
  const [capsules, setCapsules] = useState<Capsule[]>(() => CapsuleStorage.getAllCapsules())
  const { refreshStats } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [personQuery, setPersonQuery] = useState("")
  const [dateMode, setDateMode] = useState<DateMode>("unlockDate")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [status, setStatus] = useState<FilterStatus>("all")

  useEffect(() => {
    const handleUpdate = () => setCapsules(CapsuleStorage.getAllCapsules())
    window.addEventListener("capsulesUpdated", handleUpdate)
    return () => window.removeEventListener("capsulesUpdated", handleUpdate)
  }, [])

  const now = useMemo(() => new Date(), [])

  const filteredCapsules = useMemo(() => {
    let result = [...capsules]

    if (status === "locked") {
      result = result.filter(c => typeof c.isLocked === "boolean" ? c.isLocked : (new Date(c.unlockDate) > now))
    } else if (status === "unlocked") {
      result = result.filter(c => typeof c.isLocked === "boolean" ? !c.isLocked : (new Date(c.unlockDate) <= now))
    } else if (status === "shared") {
      result = result.filter(c => !!(c.shared || (Array.isArray(c.collaborators) && c.collaborators.length > 0)))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(c => {
        const title = (c.title || "").toLowerCase()
        const desc = (c.description || "").toLowerCase()
        const tags = Array.isArray(c.tags) ? c.tags.join(" ").toLowerCase() : ""
        return title.includes(q) || desc.includes(q) || tags.includes(q)
      })
    }

    if (personQuery.trim()) {
      const q = personQuery.toLowerCase()
      result = result.filter(c => {
        if (!c.collaborators || c.collaborators.length === 0) return false
        return c.collaborators.some(col => col.toLowerCase().includes(q))
      })
    }

    if (startDate || endDate) {
      result = result.filter(c => {
        let targetDate: Date | undefined
        if (dateMode === "eventDate") targetDate = c.eventDate ? new Date(c.eventDate) : undefined
        else if (dateMode === "createdDate") targetDate = new Date(c.createdDate)
        else targetDate = new Date(c.unlockDate)

        if (!targetDate) return false 
        if (startDate && targetDate < startDate) return false
        if (endDate) {
          const endOfDay = new Date(endDate)
          endOfDay.setHours(23, 59, 59, 999)
          if (targetDate > endOfDay) return false
        }
        return true
      })
    }

    result.sort((a, b) => {
      let dateA: number
      let dateB: number
      if (dateMode === "eventDate") {
        dateA = a.eventDate ? new Date(a.eventDate).getTime() : -1
        dateB = b.eventDate ? new Date(b.eventDate).getTime() : -1
        if (dateA === -1 && dateB !== -1) return 1
        if (dateA !== -1 && dateB === -1) return -1
      } else if (dateMode === "createdDate") {
        dateA = new Date(a.createdDate).getTime()
        dateB = new Date(b.createdDate).getTime()
      } else {
        dateA = new Date(a.unlockDate).getTime()
        dateB = new Date(b.unlockDate).getTime()
      }
      return dateA - dateB
    })

    return result
  }, [capsules, searchQuery, personQuery, dateMode, startDate, endDate, status, now])

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <DashboardSidebar />

      <main className="flex-1 w-full p-6 lg:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex flex-col md:flex-row items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-primary">My Capsules</h1>
              <p className="text-muted-foreground text-lg">Preserve your precious moments</p>
            </div>
            <Link href="/create">
              <Button className="gap-2 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md cursor-pointer">
                <Plus className="w-5 h-5" /> Create Capsule
              </Button>
            </Link>
          </div>

          <div className="sticky top-16 lg:top-6 z-30 mb-6">
            <div className="p-4 rounded-2xl backdrop-blur-md bg-background/90 border border-border shadow-sm">
               <AdvancedSearchBar 
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  personQuery={personQuery}
                  onPersonChange={setPersonQuery}
                  dateMode={dateMode}
                  onDateModeChange={setDateMode}
                  startDate={startDate}
                  endDate={endDate}
                  onDateRangeChange={(s, e) => { setStartDate(s); setEndDate(e); }}
                  status={status}
                  onStatusChange={setStatus}
               />
               <div className="mt-3 text-right text-xs text-muted-foreground">
                  Found {filteredCapsules.length} result{filteredCapsules.length !== 1 ? "s" : ""}
               </div>
            </div>
          </div>

          {filteredCapsules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-8xl mb-6 opacity-20">📦</div>
              <h2 className="text-2xl font-semibold mb-2 text-primary">No capsules found</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                {status === "all" && !searchQuery
                  ? "Start preserving your memories by creating your first time capsule."
                  : "No capsules match your current filters."}
              </p>
              {(status === "all" && !searchQuery) && (
                <Link href="/create">
                  <Button className="gap-2 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md cursor-pointer">
                    <Plus className="w-5 h-5" /> Create First Capsule
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCapsules.map((c) => (
                <CapsuleCard key={c.id} {...c} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}