"use client"

import React, { useEffect, useMemo, useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card } from "@/components/ui/card"
import { TimelineItem } from "@/components/timeline-item"
import { CapsuleStorage, type Capsule } from "@/lib/capsule-storage"
import { AdvancedSearchBar, type DateMode, type FilterStatus } from "@/components/advanced-search-bar"
import Footer from "@/components/footer"
import { CalendarRange, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function TimelinePage() {
  const [capsules, setCapsules] = useState<Capsule[]>(() => CapsuleStorage.getAllCapsules())

  useEffect(() => {
    const handleUpdate = () => setCapsules(CapsuleStorage.getAllCapsules())
    window.addEventListener("capsulesUpdated", handleUpdate)
    return () => window.removeEventListener("capsulesUpdated", handleUpdate)
  }, [])

  const [searchQuery, setSearchQuery] = useState("")
  const [personQuery, setPersonQuery] = useState("")
  const [dateMode, setDateMode] = useState<DateMode>("unlockDate")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [status, setStatus] = useState<FilterStatus>("all")

  const now = useMemo(() => new Date(), [])

  // --- Filtering Logic ---
  const filteredCapsules = useMemo(() => {
    let result = [...capsules]

    // Status Filter
    if (status === "locked") {
      result = result.filter(c => typeof c.isLocked === "boolean" ? c.isLocked : (new Date(c.unlockDate) > now))
    } else if (status === "unlocked") {
      result = result.filter(c => typeof c.isLocked === "boolean" ? !c.isLocked : (new Date(c.unlockDate) <= now))
    } else if (status === "shared") {
      result = result.filter(c => !!(c.shared || (Array.isArray(c.collaborators) && c.collaborators.length > 0)))
    }

    // Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(c => {
        const title = (c.title || "").toLowerCase()
        const desc = (c.description || "").toLowerCase()
        const tags = Array.isArray(c.tags) ? c.tags.join(" ").toLowerCase() : ""
        return title.includes(q) || desc.includes(q) || tags.includes(q)
      })
    }

    // Person Filter
    if (personQuery.trim()) {
      const q = personQuery.toLowerCase()
      result = result.filter(c => {
        if (!c.collaborators || c.collaborators.length === 0) return false
        return c.collaborators.some(col => {
            const email = typeof col === 'string' ? col : col.email
            return email.toLowerCase().includes(q)
        })
      })
    }

    // Date Range Filter
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

    // Sorting
    result.sort((a, b) => {
      const getDate = (c: Capsule) => {
        if (dateMode === "eventDate") return c.eventDate ? new Date(c.eventDate).getTime() : 0
        if (dateMode === "createdDate") return new Date(c.createdDate).getTime()
        return new Date(c.unlockDate).getTime()
      }
      return getDate(b) - getDate(a) // Descending (Newest first)
    })

    return result
  }, [capsules, searchQuery, personQuery, dateMode, startDate, endDate, status, now])

  // --- Grouping Logic ---
  const groupedCapsules = useMemo(() => {
    const groups: Record<string, Capsule[]> = {}
    
    filteredCapsules.forEach(capsule => {
      let date: Date
      if (dateMode === "eventDate") date = capsule.eventDate ? new Date(capsule.eventDate) : new Date(0)
      else if (dateMode === "createdDate") date = new Date(capsule.createdDate)
      else date = new Date(capsule.unlockDate)

      const year = date.getFullYear().toString()
      if (!groups[year]) groups[year] = []
      groups[year].push(capsule)
    })

    // Sort years descending
    return Object.entries(groups).sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
  }, [filteredCapsules, dateMode])

  const scrollToYear = (year: string) => {
    const element = document.getElementById(`year-${year}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <DashboardSidebar />

      <main className="flex-1 min-w-0 p-6 lg:ml-64 transition-all duration-300 relative">
        <div className="max-w-5xl mx-auto space-y-8">
          <header className="mb-4">
            <h1 className="text-4xl font-bold text-primary">Your Journey</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              A chronological story of your memories, organized by 
              <span className="font-semibold text-foreground ml-1">
                {dateMode === "eventDate" ? "Event Date" : dateMode === "createdDate" ? "Creation Date" : "Unlock Date"}
              </span>.
            </p>
          </header>

          {/* Search Bar Container */}
          <div className="sticky top-14 lg:top-6 z-30 -mx-6 px-6 py-2 lg:mx-0 lg:px-0 lg:py-0">
            <div className="p-4 rounded-2xl backdrop-blur-md bg-white/80 dark:bg-black/60 border border-border/50 shadow-lg">
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

          {/* Content Area */}
          <div className="relative">
            {/* Main Vertical Spine (Desktop) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 z-[-1]" />

            {/* Sticky Year Navigator (Desktop) */}
            {groupedCapsules.length > 1 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden xl:flex fixed right-8 top-1/3 flex-col gap-2 z-40 bg-card/80 backdrop-blur-sm p-2 rounded-2xl border shadow-sm max-h-[50vh] overflow-y-auto no-scrollbar"
              >
                <div className="text-xs font-semibold text-muted-foreground text-center mb-1">JUMP TO</div>
                {groupedCapsules.map(([year]) => (
                  <button
                    key={year}
                    onClick={() => scrollToYear(year)}
                    className="text-xs font-medium py-1 px-3 rounded-full hover:bg-primary hover:text-primary-foreground transition-all text-muted-foreground"
                  >
                    {year === "1970" ? "Undated" : year}
                  </button>
                ))}
                <div className="h-px bg-border my-1" />
                <button onClick={scrollToTop} className="p-1 hover:bg-muted rounded-full self-center" aria-label="Scroll to top">
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                </button>
              </motion.div>
            )}

            {filteredCapsules.length === 0 ? (
              <Card className="p-12 border border-dashed border-border flex flex-col items-center justify-center text-center bg-transparent">
                <div className="text-4xl mb-4 opacity-50">🕰️</div>
                <h3 className="text-xl font-semibold text-muted-foreground">No moments found</h3>
                <p className="text-sm text-muted-foreground/70 max-w-xs mt-2">Adjust your filters to see your timeline.</p>
              </Card>
            ) : (
              <div className="space-y-20 pb-20">
                <AnimatePresence>
                  {groupedCapsules.map(([year, yearCapsules], groupIndex) => (
                    <motion.div 
                      key={year} 
                      id={`year-${year}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 * groupIndex }}
                      className="relative scroll-mt-32"
                    >
                      {/* Year Marker */}
                      <div className="flex justify-center mb-12 sticky top-36 z-20">
                        <div className="bg-background/95 backdrop-blur-md border border-primary/20 text-primary font-bold px-6 py-2 rounded-full shadow-md flex items-center gap-2 text-lg">
                          <CalendarRange className="w-5 h-5" />
                          {year === "1970" && dateMode === "eventDate" ? "Undated Events" : year}
                        </div>
                      </div>

                      {/* Capsules List */}
                      <div className="space-y-4">
                        {yearCapsules.map((c, index) => (
                          <TimelineItem 
                            key={c.id} 
                            capsule={c} 
                            index={index} 
                            isLast={index === yearCapsules.length - 1} 
                          />
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>
      <div className="w-full p-6 lg:ml-64">
        <Footer />
      </div>
    </div>
  )
}