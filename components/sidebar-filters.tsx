"use client"
import { Clock, Grid3x3, Lock, Share2, Archive } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export type FilterType = "all" | "active" | "unlocked" | "shared" | "archived"

interface SidebarFiltersProps {
  activeFilter?: FilterType
  onFilterChange?: (filter: FilterType) => void
  logoSrc?: string
  title?: string
}

export function SidebarFilters({
  activeFilter,
  onFilterChange,
  logoSrc = "/capsumi-logo-color.PNG",
  title = "Capsumi",
}: SidebarFiltersProps) {
  const filters = [
    { id: "all" as FilterType, label: "All Capsules", icon: Grid3x3 },
    { id: "active" as FilterType, label: "Active", icon: Clock },
    { id: "unlocked" as FilterType, label: "Unlocked", icon: Lock },
    { id: "shared" as FilterType, label: "Shared", icon: Share2 },
    { id: "archived" as FilterType, label: "Archived", icon: Archive },
  ]

  return (
    <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-64 p-6
                       bg-gray-900/90 dark:backdrop-blur-xl border border-gray-700/50
                       rounded-tr-2xl rounded-br-2xl shadow-lg z-50">
      
      {/* Logo and Main Title */}
      <div className="mb-6 flex flex-col items-center">
        <Image src={logoSrc} alt="Logo" width={100} height={40} className="object-contain mb-2" />
        <h1 className="text-lg font-bold text-gray-100 text-center">{title}</h1>
      </div>

      {/* Filters Header */}
      <h2 className="text-base font-semibold text-gray-100 mb-1 text-center">Filters</h2>
      <p className="mb-4 text-xs text-gray-300 text-center">
        💡 Use filters to find your capsules quickly!
      </p>

      {/* Filter Buttons */}
      <div className="flex flex-col gap-3 mt-2">
        {filters.map((filter) => {
          const Icon = filter.icon
          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange?.(filter.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all border text-center backdrop-blur-lg",
                activeFilter === filter.id
                  ? "bg-gray-700 text-gray-100 shadow-md scale-105 border-gray-600"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/60 hover:text-gray-100 border-gray-600"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs font-medium">{filter.label}</span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
