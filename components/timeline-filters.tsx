"use client"

import React from "react"
import { Search, X, Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  startDate?: string | null
  endDate?: string | null
  status: "all" | "locked" | "unlocked" | "shared"
  search: string
  tag?: string | null
  onStartDateChange: (v: string | null) => void
  onEndDateChange: (v: string | null) => void
  onStatusChange: (v: Props["status"]) => void
  onSearchChange: (v: string) => void
  onTagChange: (v: string | null) => void
  tags: string[]
}

/**
 * TimelineFilters (English) — updated to include only start/end date inputs,
 * status segmented controls, search (searches title and tags), and a Clear button.
 *
 * Props are unchanged so integration with app/timeline/page.tsx doesn't need edits.
 */
export function TimelineFilters({
  startDate,
  endDate,
  status,
  search,
  onStartDateChange,
  onEndDateChange,
  onStatusChange,
  onSearchChange,
  onTagChange,
}: Props) {
  const clearAll = () => {
    onStartDateChange && onStartDateChange(null)
    onEndDateChange && onEndDateChange(null)
    onStatusChange("all")
    onSearchChange("")
    onTagChange && onTagChange(null)
  }

  return (
    <div className="rounded-2xl border shadow-sm bg-white dark:bg-[#0f0f0f] dark:border-[rgba(255,255,255,0.03)] p-4 mb-6">
      {/* top row: search + clear */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="search"
              placeholder="Search title or tags..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-[rgba(16,24,40,0.06)] dark:border-[rgba(255,255,255,0.04)] bg-transparent text-sm"
            />
            {search && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:bg-muted/10"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={clearAll} className="flex items-center gap-2">
            <X className="w-4 h-4" />
            Clear
          </Button>
        </div>
      </div>

      {/* second row: start/end date inputs + status segmented */}
      <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border px-3 py-2 bg-[rgba(243,130,131,0.03)]">
            <CalendarIcon className="w-4 h-4 text-pink-600" />
            <input
              type="date"
              value={startDate ?? ""}
              onChange={(e) => onStartDateChange(e.target.value || null)}
              className="text-sm bg-transparent outline-none"
            />
          </div>

          <div className="text-sm text-muted-foreground">to</div>

          <div className="flex items-center gap-2 rounded-xl border px-3 py-2 bg-[rgba(243,130,131,0.03)]">
            <input
              type="date"
              value={endDate ?? ""}
              onChange={(e) => onEndDateChange(e.target.value || null)}
              className="text-sm bg-transparent outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:ml-4 flex-wrap">
          {/* status segmented buttons */}
          <div className="inline-flex rounded-full bg-[rgba(16,24,40,0.04)] dark:bg-[rgba(255,255,255,0.02)] p-1">
            <button
              onClick={() => onStatusChange("all")}
              className={`px-3 py-1 rounded-full text-sm ${status === "all" ? "bg-pink-100 text-pink-700" : "text-muted-foreground"}`}
            >
              All
            </button>
            <button
              onClick={() => onStatusChange("locked")}
              className={`px-3 py-1 rounded-full text-sm ${status === "locked" ? "bg-pink-100 text-pink-700" : "text-muted-foreground"}`}
            >
              Locked
            </button>
            <button
              onClick={() => onStatusChange("unlocked")}
              className={`px-3 py-1 rounded-full text-sm ${status === "unlocked" ? "bg-pink-100 text-pink-700" : "text-muted-foreground"}`}
            >
              Unlocked
            </button>
            <button
              onClick={() => onStatusChange("shared")}
              className={`px-3 py-1 rounded-full text-sm ${status === "shared" ? "bg-pink-100 text-pink-700" : "text-muted-foreground"}`}
            >
              Shared
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}