"use client"
import { Button } from "@/components/ui/button"
import { Clock, Grid3x3, Lock, Share2, Archive } from "lucide-react"
import { cn } from "@/lib/utils"

export type FilterType = "all" | "active" | "unlocked" | "shared" | "archived"

interface SidebarFiltersProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

export function SidebarFilters({ activeFilter, onFilterChange }: SidebarFiltersProps) {
  const filters = [
    { id: "all" as FilterType, label: "All Capsules", icon: Grid3x3 },
    { id: "active" as FilterType, label: "Active", icon: Clock },
    { id: "unlocked" as FilterType, label: "Unlocked", icon: Lock },
    { id: "shared" as FilterType, label: "Shared", icon: Share2 },
    { id: "archived" as FilterType, label: "Archived", icon: Archive },
  ]

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-gradient-to-b from-primary/10 via-secondary/5 to-accent/10 p-6 border-r border-border/40 gap-6 shadow-lg">
      <h2 className="text-lg font-bold text-primary mb-4">Filters</h2>
      <div className="mb-4 text-sm">
        <p>💡 Tip: Use filters to find your capsules quickly!</p>
      </div>
      <div className="flex flex-col gap-3">
        {filters.map((filter) => {
          const Icon = filter.icon
          return (
            <Button
              key={filter.id}
              variant="ghost"
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                "justify-start gap-3 rounded-2xl px-4 py-3 text-base font-medium transition-all",
                activeFilter === filter.id
                  ? "bg-primary/20 text-primary shadow-md scale-105 hover:bg-primary/30"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              {filter.label}
            </Button>
          )
        })}
      </div>
    </aside>
  )
}
