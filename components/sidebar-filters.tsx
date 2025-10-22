"use client"

import { Button } from "@/components/ui/button"
import { Clock, Grid3x3, Lock, Share2, Archive } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

type FilterType = "all" | "active" | "unlocked" | "shared" | "archived"

export function SidebarFilters() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")

  const filters = [
    { id: "all" as FilterType, label: "All Capsules", icon: Grid3x3 },
    { id: "active" as FilterType, label: "Active", icon: Clock },
    { id: "unlocked" as FilterType, label: "Unlocked", icon: Lock },
    { id: "shared" as FilterType, label: "Shared", icon: Share2 },
    { id: "archived" as FilterType, label: "Archived", icon: Archive },
  ]

  return (
    <aside className="hidden lg:flex w-64 flex-col gap-2 border-r border-border/40 bg-card p-4">
      <h2 className="mb-2 px-3 text-sm font-semibold text-muted-foreground">Filters</h2>
      <div className="flex flex-col gap-1">
        {filters.map((filter) => {
          const Icon = filter.icon
          return (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "secondary" : "ghost"}
              className={cn(
                "justify-start gap-3 rounded-2xl",
                activeFilter === filter.id && "bg-primary/10 text-primary hover:bg-primary/20",
              )}
              onClick={() => setActiveFilter(filter.id)}
            >
              <Icon className="h-4 w-4" />
              {filter.label}
            </Button>
          )
        })}
      </div>
    </aside>
  )
}
