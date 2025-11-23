"use client"

import React, { useState } from "react"
import { Search, X, User, Calendar, Filter, ArrowUpDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/date-picker"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type DateMode = "unlockDate" | "eventDate" | "createdDate"
export type FilterStatus = "all" | "locked" | "unlocked" | "shared" | "archived"

interface AdvancedSearchBarProps {
  onSearchChange: (query: string) => void
  onPersonChange: (person: string) => void
  onDateModeChange: (mode: DateMode) => void
  onDateRangeChange: (start: Date | undefined, end: Date | undefined) => void
  onStatusChange: (status: FilterStatus) => void
  
  // Current values
  searchQuery: string
  personQuery: string
  dateMode: DateMode
  startDate: Date | undefined
  endDate: Date | undefined
  status: FilterStatus
  
  className?: string
}

export function AdvancedSearchBar({
  onSearchChange,
  onPersonChange,
  onDateModeChange,
  onDateRangeChange,
  onStatusChange,
  searchQuery,
  personQuery,
  dateMode,
  startDate,
  endDate,
  status,
  className,
}: AdvancedSearchBarProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const dateModeLabels: Record<DateMode, string> = {
    unlockDate: "Unlock Date",
    eventDate: "Event Date",
    createdDate: "Created Date",
  }

  const activeFilterCount = [
    personQuery,
    startDate,
    endDate,
    status !== "all",
    dateMode !== "unlockDate" // Assuming unlock is default
  ].filter(Boolean).length

  const clearAll = () => {
    onSearchChange("")
    onPersonChange("")
    onDateModeChange("unlockDate")
    onDateRangeChange(undefined, undefined)
    onStatusChange("all")
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col md:flex-row gap-3">
        {/* Main Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search title, description, tags..."
            className="pl-9 rounded-xl border-pink-200 dark:border-gray-700 bg-white/80 dark:bg-black/40 backdrop-blur-sm focus-visible:ring-pink-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Person Search Input */}
        <div className="relative md:w-64">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={personQuery}
            onChange={(e) => onPersonChange(e.target.value)}
            placeholder="Filter by person..."
            className="pl-9 rounded-xl border-pink-200 dark:border-gray-700 bg-white/80 dark:bg-black/40 backdrop-blur-sm"
          />
        </div>

        {/* Filter Toggle Button */}
        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={cn(
                "gap-2 rounded-xl border-pink-200 dark:border-gray-700 bg-white/80 dark:bg-black/40",
                activeFilterCount > 0 && "text-primary border-primary/50 bg-primary/5"
              )}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1 bg-primary text-primary-foreground rounded-full">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-4 rounded-2xl shadow-xl border-pink-100 dark:border-gray-800">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Sort & Filter</h4>
                {activeFilterCount > 0 && (
                  <button 
                    onClick={clearAll}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Timeline Mode (Sort By) */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3" /> Timeline Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(dateModeLabels) as DateMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => onDateModeChange(mode)}
                      className={cn(
                        "text-xs px-2 py-1.5 rounded-lg border transition-all",
                        dateMode === mode
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/50 hover:bg-muted border-transparent"
                      )}
                    >
                      {dateModeLabels[mode].split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Date Range ({dateModeLabels[dateMode]})
                </label>
                <div className="grid gap-2">
                  <DatePicker
                    date={startDate}
                    onDateChange={(d) => onDateRangeChange(d, endDate)}
                    placeholder="Start Date"
                    className="h-9 text-sm"
                  />
                  <DatePicker
                    date={endDate}
                    onDateChange={(d) => onDateRangeChange(startDate, d)}
                    placeholder="End Date"
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              {/* Status Pills */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <div className="flex flex-wrap gap-2">
                  {(["all", "locked", "unlocked", "shared"] as FilterStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => onStatusChange(s)}
                      className={cn(
                        "text-xs px-3 py-1 rounded-full border transition-all capitalize",
                        status === s
                          ? "bg-primary/10 text-primary border-primary/20 font-medium"
                          : "bg-transparent border-border text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filter Pills (Quick remove) */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {status !== "all" && (
            <Badge variant="secondary" className="gap-1 pr-1">
              Status: {status}
              <X className="w-3 h-3 cursor-pointer hover:text-primary" onClick={() => onStatusChange("all")} />
            </Badge>
          )}
          {dateMode !== "unlockDate" && (
            <Badge variant="secondary" className="gap-1 pr-1">
              By: {dateModeLabels[dateMode]}
              <X className="w-3 h-3 cursor-pointer hover:text-primary" onClick={() => onDateModeChange("unlockDate")} />
            </Badge>
          )}
          {personQuery && (
            <Badge variant="secondary" className="gap-1 pr-1">
              Person: {personQuery}
              <X className="w-3 h-3 cursor-pointer hover:text-primary" onClick={() => onPersonChange("")} />
            </Badge>
          )}
          {(startDate || endDate) && (
            <Badge variant="secondary" className="gap-1 pr-1">
              Date Range
              <X className="w-3 h-3 cursor-pointer hover:text-primary" onClick={() => onDateRangeChange(undefined, undefined)} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}