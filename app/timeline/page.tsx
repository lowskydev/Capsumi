"use client"

import React, { useEffect, useMemo, useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card } from "@/components/ui/card"
import { TimelineItem } from "@/components/timeline-item"
import { CapsuleStorage, type Capsule } from "@/lib/capsule-storage"
import { AdvancedSearchBar, type DateMode, type FilterStatus } from "@/components/advanced-search-bar"
import Footer from "@/components/footer"

export default function TimelinePage() {
  const [capsules, setCapsules] = useState<Capsule[]>(() => CapsuleStorage.getAllCapsules())

  useEffect(() => {
    const handleUpdate = () => setCapsules(CapsuleStorage.getAllCapsules())
    window.addEventListener("capsulesUpdated", handleUpdate)
    return () => window.removeEventListener("capsulesUpdated", handleUpdate)
  }, [])

  // -- Advanced Search State --
  const [searchQuery, setSearchQuery] = useState("")
  const [personQuery, setPersonQuery] = useState("")
  const [dateMode, setDateMode] = useState<DateMode>("unlockDate")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [status, setStatus] = useState<FilterStatus>("all")

  const now = useMemo(() => new Date(), [])

  // Filter and Sort
  const filteredAndSortedCapsules = useMemo(() => {
    let result = [...capsules]

    // 1. Filter by Status
    if (status === "locked") {
      result = result.filter(c => typeof c.isLocked === "boolean" ? c.isLocked : (new Date(c.unlockDate) > now))
    } else if (status === "unlocked") {
      result = result.filter(c => typeof c.isLocked === "boolean" ? !c.isLocked : (new Date(c.unlockDate) <= now))
    } else if (status === "shared") {
      result = result.filter(c => !!(c.shared || (Array.isArray(c.collaborators) && c.collaborators.length > 0)))
    }

    // 2. Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(c => {
        const title = (c.title || "").toLowerCase()
        const desc = (c.description || "").toLowerCase()
        const tags = Array.isArray(c.tags) ? c.tags.join(" ").toLowerCase() : ""
        return title.includes(q) || desc.includes(q) || tags.includes(q)
      })
    }

    // 3. Filter by Person
    if (personQuery.trim()) {
      const q = personQuery.toLowerCase()
      result = result.filter(c => {
        if (!c.collaborators || c.collaborators.length === 0) return false
        return c.collaborators.some(col => col.toLowerCase().includes(q))
      })
    }

    // 4. Filter by Date Range
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

    // 5. Sort
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
        <div className="max-w-6xl mx-auto space-y-6">
          <header className="mb-4">
            <h1 className="text-3xl font-bold text-primary">Timeline</h1>
            <p className="text-muted-foreground mt-1">
              View your story by 
              <span className="font-semibold text-primary ml-1">
                {dateMode === "eventDate" ? "when it happened" : dateMode === "createdDate" ? "when you captured it" : "when it unlocks"}
              </span>.
            </p>
          </header>

          {/* Sticky Filter Bar */}
          <div className="sticky top-14 lg:top-6 z-30 mb-6 -mx-6 px-6 py-2 lg:mx-0 lg:px-0 lg:py-0">
            <div className="p-4 rounded-2xl backdrop-blur-md bg-white/90 dark:bg-[#0b0b0b]/90 border border-pink-100 dark:border-[rgba(98,207,145,0.12)] shadow-sm">
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
            </div>
          </div>

          {filteredAndSortedCapsules.length === 0 ? (
            <Card className="p-12 border border-border flex flex-col items-center justify-center text-center bg-card">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-muted-foreground">No capsules found</h3>
              <p className="text-sm text-muted-foreground/70 max-w-xs mt-1">Try adjusting your filters, date range, or search terms.</p>
            </Card>
          ) : (
            <div className="space-y-0">
              {filteredAndSortedCapsules.map((c) => (
                <TimelineItem key={c.id} capsule={c} />
              ))}
            </div>
          )}
        </div>
      </main>
      <div className="w-full p-6 lg:ml-64">
        <Footer />
      </div>
    </div>
  )
}