"use client"

import React, { useState, useEffect } from "react"
import { Search, X, User, Calendar, Filter, ArrowUpDown } from "lucide-react"
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
  // Local input for person filter field
  const [personInput, setPersonInput] = useState("")

  const dateModeLabels: Record<DateMode, string> = {
    unlockDate: "Unlock Date",
    eventDate: "Event Date",
    createdDate: "Created Date",
  }

  const activeFilterCount = [
    Boolean(personQuery),
    startDate,
    endDate,
    status !== "all",
    dateMode !== "unlockDate"
  ].filter(Boolean).length

  const clearAll = () => {
    onSearchChange("")
    setPersonInput("")
    onPersonChange("")
    onDateModeChange("unlockDate")
    onDateRangeChange(undefined, undefined)
    onStatusChange("all")
  }

  useEffect(() => {
    setPersonInput("") // whenever personQuery changes externally, reset input
  }, [personQuery])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Row - Single line on mobile */}
      <div className="flex gap-2 md:gap-3">
        {/* Main Search Input - Always visible */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="pl-9 rounded-xl border-pink-200 dark:border-gray-700 bg-white/80 dark:bg-black/40 backdrop-blur-sm focus-visible:ring-pink-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
              title="Clear search"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Person Search Input - Hidden on mobile, visible on Desktop */}
        <div className="relative hidden md:block md:w-56 lg:w-64">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={personInput}
            onChange={e => setPersonInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault()
                if (personInput.trim()) {
                  onPersonChange(personInput.trim())
                  setPersonInput("")
                }
              }
            }}
            placeholder="Filter by person..."
            className="pl-9 rounded-xl border-pink-200 dark:border-gray-700 bg-white/80 dark:bg-black/40 backdrop-blur-sm"
          />
        </div>

        {/* Filter Toggle Button */}
        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className={cn(
                "rounded-xl border-pink-200 dark:border-gray-700 bg-white/80 dark:bg-black/40 w-10 md:w-auto md:px-4 md:gap-2 shrink-0",
                activeFilterCount > 0 && "text-primary border-primary/50 bg-primary/5"
              )}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden md:inline">Filters</span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="absolute -top-2 -right-2 md:static md:ml-1 h-5 min-w-5 px-1 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
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

              {/* Mobile Only: Person Filter (moved from main bar) */}
              <div className="md:hidden space-y-2 pb-2 border-b border-border/50">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3" /> Filter by Person
                </label>
                <Input
                  value={personInput}
                  onChange={e => setPersonInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      if (personInput.trim()) {
                        onPersonChange(personInput.trim())
                        setPersonInput("")
                      }
                    }
                  }}
                  placeholder="Name or email..."
                  className="h-9 text-sm"
                />
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
                        "text-xs px-2 py-1.5 rounded-lg border transition-all text-center",
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

      {/* Active Filter Pills (Horizontal scroll on mobile) */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {status !== "all" && (
            <Badge variant="secondary" className="gap-1 pr-1 shrink-0">
              Status: {status}
              <button
                type="button"
                onClick={() => onStatusChange("all")}
                title="Remove status filter"
                className="ml-1 text-muted-foreground hover:text-primary p-0.5 rounded-full align-middle"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {dateMode !== "unlockDate" && (
            <Badge variant="secondary" className="gap-1 pr-1 shrink-0">
              By: {dateModeLabels[dateMode]}
              <button
                type="button"
                onClick={() => onDateModeChange("unlockDate")}
                title="Remove timeline filter"
                className="ml-1 text-muted-foreground hover:text-primary p-0.5 rounded-full align-middle"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {personQuery && (
            <Badge variant="secondary" className="gap-1 pr-1 shrink-0">
              Person: {personQuery}
              <button
                type="button"
                onClick={() => onPersonChange("")}
                title="Remove person filter"
                className="ml-1 text-muted-foreground hover:text-primary p-0.5 rounded-full align-middle"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {(startDate || endDate) && (
            <Badge variant="secondary" className="gap-1 pr-1 shrink-0">
              Date Range
              <button
                type="button"
                onClick={() => onDateRangeChange(undefined, undefined)}
                title="Remove date range filter"
                className="ml-1 text-muted-foreground hover:text-primary p-0.5 rounded-full align-middle"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}