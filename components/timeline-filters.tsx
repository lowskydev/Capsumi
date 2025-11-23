"use client"

import { Search, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/date-picker"

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
    onStartDateChange(null)
    onEndDateChange(null)
    onStatusChange("all")
    onSearchChange("")
    onTagChange(null)
  }

  // Helper to convert string "YYYY-MM-DD" -> Date object
  const parseDate = (d: string | null | undefined) => d ? new Date(d) : undefined

  // Helper to convert Date object -> string "YYYY-MM-DD"
  const serializeDate = (d: Date | undefined) => {
    if (!d) return null
    // Use local time to avoid timezone shifts
    const offset = d.getTimezoneOffset()
    const local = new Date(d.getTime() - (offset * 60 * 1000))
    return local.toISOString().split('T')[0]
  }

  return (
    <div className="rounded-2xl border border-pink-100 shadow-sm bg-white dark:bg-[#0b0b0b] dark:border-[rgba(98,207,145,0.18)] p-4 mb-6">
      {/* Top row: search + clear */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="w-4 h-4 text-pink-500 dark:text-brand-green" />
            </span>
            <input
              type="search"
              placeholder="Search title or tags..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-pink-200 dark:border-[rgba(98,207,145,0.22)] bg-transparent text-sm dark:text-white/95 placeholder:text-pink-400 dark:placeholder:text-[rgba(98,207,145,0.5)] focus:outline-none focus:ring-2 focus:ring-[rgba(98,207,145,0.12)]"
            />
            {search && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:bg-muted/10 dark:hover:bg-[rgba(98,207,145,0.06)]"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-pink-600 dark:text-brand-green" />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={clearAll}
            className="flex items-center gap-2 dark:border-[rgba(98,207,145,0.18)] dark:text-brand-green"
          >
            <X className="w-4 h-4" />
            Clear
          </Button>
        </div>
      </div>

      {/* Second row: Date Pickers + Status Filter */}
      <div className="mt-4 flex flex-col lg:flex-row lg:items-center gap-4">
        
        {/* Date Inputs Group */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="flex-1 lg:w-[180px]">
            <DatePicker
              date={parseDate(startDate)}
              onDateChange={(d) => onStartDateChange(serializeDate(d))}
              placeholder="From date"
              // Max date is the selected end date (can't start after end)
              maxDate={parseDate(endDate)}
            />
          </div>
          
          <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
          
          <div className="flex-1 lg:w-[180px]">
            <DatePicker
              date={parseDate(endDate)}
              onDateChange={(d) => onEndDateChange(serializeDate(d))}
              placeholder="To date"
              // Min date is the selected start date (can't end before start)
              minDate={parseDate(startDate)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 lg:ml-auto flex-wrap">
          {/* Status segmented buttons */}
          <div className="inline-flex rounded-full bg-[rgba(16,24,40,0.04)] dark:bg-[rgba(255,255,255,0.02)] p-1 w-full sm:w-auto overflow-x-auto">
            {(["all", "locked", "unlocked", "shared"] as const).map((s) => (
              <button
                key={s}
                onClick={() => onStatusChange(s)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                  status === s
                    ? "bg-pink-100 text-pink-700 dark:bg-brand-green dark:text-white"
                    : "text-muted-foreground dark:text-white/75 hover:text-foreground"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}