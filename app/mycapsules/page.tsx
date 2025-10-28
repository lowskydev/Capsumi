"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CapsuleCard } from "@/components/capsule-card"
import { FilterType } from "@/components/sidebar-filters"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Plus } from "lucide-react"
import { CapsuleStorage, type Capsule } from "@/lib/capsule-storage"
import { useAuth } from "@/components/auth-context"
import { cn } from "@/lib/utils"

export default function MyCapsulesPage() {
  const [capsules, setCapsules] = useState<Capsule[]>(() => CapsuleStorage.getAllCapsules())
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")

  const { refreshStats } = useAuth()

  // Listen for capsule updates
  useEffect(() => {
    const handleUpdate = () => setCapsules(CapsuleStorage.getAllCapsules())
    window.addEventListener("capsulesUpdated", handleUpdate)
    return () => window.removeEventListener("capsulesUpdated", handleUpdate)
  }, [])

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter)
  }

  const filteredCapsules = useMemo(() => {
    let result = [...capsules]
    switch (activeFilter) {
      case "active":
        result = result.filter((c) => c.isLocked)
        break
      case "unlocked":
        result = result.filter((c) => !c.isLocked)
        break
      case "shared":
        result = result.filter((c: any) => c.shared)
        break
      case "archived":
        result = result.filter((c: any) => c.archived)
        break
    }
    return result
  }, [capsules, activeFilter])

  const brandRed = "#f38283"
  const brandGreen = "#62cf91"

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={
        {
          "--brand-red": brandRed,
          "--brand-green": brandGreen,
        } as React.CSSProperties
      }
    >
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6 bg-gradient-to-br from-pink-50 to-white dark:from-[#0e0e0e] dark:to-[#1a1a1a] transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2 text-pink-800 dark:text-[var(--brand-red)]">
                  My Capsules
                </h1>
                <p className="text-pink-700 dark:text-[rgba(255,255,255,0.7)] text-lg">
                  Preserve your precious moments for the future
                </p>
              </div>

              <Link href="/create">
                <Button className="gap-2 rounded-2xl bg-[var(--brand-red)] hover:bg-[var(--brand-green)] text-white shadow-md transition-all">
                  <Plus className="w-5 h-5" /> Create Capsule
                </Button>
              </Link>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-3">
              {(["all", "active", "unlocked", "shared", "archived"] as FilterType[]).map(
                (filter) => {
                  const isActive = activeFilter === filter
                  return (
                    <button
                      key={filter}
                      onClick={() => handleFilterChange(filter)}
                      className={cn(
                        "flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all border text-sm font-medium",
                        isActive
                          ? "bg-[var(--brand-red)] text-white border-transparent shadow-md"
                          : "bg-white text-[var(--brand-red)] border-[var(--brand-green)] hover:bg-[rgba(243,130,131,0.1)] dark:bg-[#1a1a1a] dark:text-[rgba(255,255,255,0.7)] dark:border-[rgba(98,207,145,0.4)] dark:hover:bg-[rgba(98,207,145,0.15)]"
                      )}
                      style={
                        {
                          "--brand-red": brandRed,
                          "--brand-green": brandGreen,
                        } as React.CSSProperties
                      }
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  )
                }
              )}
            </div>

            {/* Capsules Grid */}
            {filteredCapsules.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-8xl mb-6 opacity-20">📦</div>
                <h2 className="text-2xl font-semibold mb-2 text-pink-700 dark:text-[var(--brand-red)]">
                  No capsules found
                </h2>
                <p className="text-pink-600 dark:text-[rgba(255,255,255,0.6)] mb-6 max-w-md">
                  {activeFilter === "all"
                    ? "Start preserving your memories by creating your first time capsule."
                    : "No capsules match this filter."}
                </p>
                {activeFilter === "all" && (
                  <Link href="/create">
                    <Button className="gap-2 rounded-2xl bg-[var(--brand-red)] hover:bg-[var(--brand-green)] text-white transition-all shadow-md">
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
