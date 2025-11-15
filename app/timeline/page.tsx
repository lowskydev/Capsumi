"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CapsuleStorage, type Capsule } from "@/lib/capsule-storage"
import { Calendar, Clock, ImageIcon, Tag, UserPlus, Lock, Unlock } from "lucide-react"
import { TimelineItem } from "@/components/timeline-item"
import { TimelineFilters } from "@/components/timeline-filters"

export default function TimelinePage() {
  const [capsules, setCapsules] = useState<Capsule[]>(() => CapsuleStorage.getAllCapsules())

  useEffect(() => {
    const handleUpdate = () => setCapsules(CapsuleStorage.getAllCapsules())
    window.addEventListener("capsulesUpdated", handleUpdate)
    return () => window.removeEventListener("capsulesUpdated", handleUpdate)
  }, [])

  // filters state
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [status, setStatus] = useState<"all" | "locked" | "unlocked" | "shared">("all")
  const [search, setSearch] = useState<string>("")
  const [tag, setTag] = useState<string | null>(null)

  // collect all tags for the tag filter dropdown
  const allTags = useMemo(() => {
    const s = new Set<string>()
    capsules.forEach((c) => (c.tags || []).forEach((t: string) => s.add(t)))
    return Array.from(s).sort()
  }, [capsules])

  // base sorted by unlock date
  const sorted = useMemo(() => {
    return [...capsules].sort((a, b) => {
      const aDate = a.unlockDate ? new Date(a.unlockDate).getTime() : new Date(a.createdDate).getTime()
      const bDate = b.unlockDate ? new Date(b.unlockDate).getTime() : new Date(b.createdDate).getTime()
      return aDate - bDate
    })
  }, [capsules])

  const now = useMemo(() => new Date(), [])

  // apply filters: date range, status, search, tag
  const filteredSorted = useMemo(() => {
    const start = startDate ? new Date(startDate + "T00:00:00") : null
    const end = endDate ? new Date(endDate + "T23:59:59") : null

    return sorted.filter((c) => {
      // date filter (based on unlockDate if present, otherwise createdDate)
      const refDate = c.unlockDate ? new Date(c.unlockDate) : new Date(c.createdDate)
      if (start && refDate < start) return false
      if (end && refDate > end) return false

      // status filter
      if (status === "locked") {
        const isLocked = typeof c.isLocked === "boolean" ? c.isLocked : (c.unlockDate ? new Date(c.unlockDate) > now : false)
        if (!isLocked) return false
      } else if (status === "unlocked") {
        const isLocked = typeof c.isLocked === "boolean" ? c.isLocked : (c.unlockDate ? new Date(c.unlockDate) > now : false)
        if (isLocked) return false
      } else if (status === "shared") {
        if (!(c.shared || (Array.isArray(c.collaborators) && c.collaborators.length > 0))) return false
      }

      // tag filter
      if (tag && !(Array.isArray(c.tags) && c.tags.includes(tag))) return false

      // search by title
      if (search && !c.title?.toLowerCase().includes(search.toLowerCase())) return false

      return true
    })
  }, [sorted, startDate, endDate, status, tag, search, now])

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <div className="flex flex-1 relative">
        <DashboardSidebar />

        <main className="flex-1 ml-64 p-6 bg-gradient-to-br from-pink-50 to-white dark:from-[#0e0e0e] dark:to-[#1a1a1a] transition-colors duration-300">
          <div className="max-w-6xl mx-auto space-y-6">
            <header className="mb-4">
              <h1 className="text-3xl font-bold text-pink-800 dark:text-[var(--brand-red)]">Timeline</h1>
              <p className="text-muted-foreground mt-1">A chronological view of your capsules.</p>
            </header>

            <TimelineFilters
              startDate={startDate}
              endDate={endDate}
              status={status}
              search={search}
              tag={tag ?? null}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onStatusChange={setStatus}
              onSearchChange={setSearch}
              onTagChange={setTag}
              tags={allTags}
            />

            {filteredSorted.length === 0 ? (
              <Card className="p-6">
                <p className="text-sm text-muted-foreground">No capsules match the selected filters.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredSorted.map((c) => (
                  <TimelineItem key={c.id} capsule={c} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}