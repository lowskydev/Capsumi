"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CapsuleCard } from "@/components/capsule-card"
import { SidebarFilters, FilterType } from "@/components/sidebar-filters"
import { Plus, Trash2 } from "lucide-react"
import { getCapsules, Capsule } from "@/components/utils/storage"
import { Navigation } from "@/components/navigation"

export default function DashboardPage() {
  const [capsules, setCapsules] = useState<Capsule[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const stored = getCapsules().map((c) => ({
      ...c,
      unlockDate: new Date(c.unlockDate),
      createdDate: new Date(c.createdDate),
    }))
    setCapsules(stored)
  }, [])

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete ALL capsules?")) {
      localStorage.removeItem("capsules")
      setCapsules([])
    }
  }

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter)
  }

  const filteredCapsules = useMemo(() => {
    const now = new Date()
    let result = [...capsules]

    // Sidebar filter
    switch (activeFilter) {
      case "active":
        result = result.filter((c) => c.isLocked === true)
        break
      case "unlocked":
        result = result.filter((c) => c.isLocked === false)
        break
      case "shared":
        result = result.filter((c) => c.shared === true)
        break
      case "archived":
        result = result.filter((c) => c.archived === true)
        break
    }

    // Search filter (from top nav)
    if (searchQuery.trim() !== "") {
      result = result.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return result
  }, [capsules, activeFilter, searchQuery])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation with unified search */}
      <Navigation searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="flex flex-1 relative">
        {/* Fixed Pink Liquid Glass Sidebar */}
        <SidebarFilters activeFilter={activeFilter} onFilterChange={handleFilterChange} />

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Actions */}
            <div className="mb-8 flex flex-col md:flex-row items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2 text-pink-700">Your Memory Capsules</h1>
                <p className="text-pink-600 text-lg">
                  Preserve your precious moments for the future
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Link href="/create">
                  <Button className="gap-2 rounded-2xl hover-lift bg-pink-300/30 text-pink-700 hover:bg-pink-400/40">
                    <Plus className="w-5 h-5" /> Create Capsule
                  </Button>
                </Link>
                <Button
                  onClick={handleClearAll}
                  variant="destructive"
                  className="gap-2 rounded-2xl hover-lift"
                >
                  <Trash2 className="w-5 h-5" /> Clear All
                </Button>
              </div>
            </div>

            {/* Capsules Grid */}
            {filteredCapsules.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-8xl mb-6 opacity-20">📦</div>
                <h2 className="text-2xl font-semibold mb-2">No capsules found</h2>
                <p className="text-pink-600 mb-6 max-w-md">
                  {activeFilter === "all"
                    ? "Start preserving your memories by creating your first time capsule."
                    : "No capsules match this filter or search query."}
                </p>
                {activeFilter === "all" && (
                  <Link href="/create">
                    <Button className="gap-2 rounded-2xl hover-lift bg-pink-300/30 text-pink-700 hover:bg-pink-400/40">
                      <Plus className="w-5 h-5" /> Create Your First Capsule
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCapsules.map((c) => (
                  <CapsuleCard key={c.id} {...c} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
