"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CapsuleCard } from "@/components/capsule-card"
import { FilterType } from "@/components/sidebar-filters"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Plus, Search as SearchIcon, X as XIcon } from "lucide-react"
import { CapsuleStorage, type Capsule } from "@/lib/capsule-storage"
import { useAuth } from "@/components/auth-context"
import { cn } from "@/lib/utils"

export default function MyCapsulesPage() {
  const [capsules, setCapsules] = useState<Capsule[]>(() => CapsuleStorage.getAllCapsules())
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")

  // New UI state
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  const { refreshStats } = useAuth()

  // Listen for capsule updates
  useEffect(() => {
    const handleUpdate = () => setCapsules(CapsuleStorage.getAllCapsules())
    window.addEventListener("capsulesUpdated", handleUpdate)
    return () => window.removeEventListener("capsulesUpdated", handleUpdate)
  }, [])

  // Debounce search input for smoother UX
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 220)
    return () => clearTimeout(t)
  }, [query])

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter)
  }

  const brandRed = "#f38283"
  const brandGreen = "#62cf91"

  const filteredCapsules = useMemo(() => {
    let result = [...capsules]

    // apply pill filter (legacy "activeFilter")
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

    // apply search query (title, description, tags) using debouncedQuery
    if (debouncedQuery.trim() !== "") {
      const q = debouncedQuery.toLowerCase()
      result = result.filter((c: any) => {
        const title = (c.title ?? "").toString().toLowerCase()
        const desc = (c.description ?? "").toString().toLowerCase()
        const tags = Array.isArray(c.tags) ? c.tags.join(" ").toLowerCase() : ""
        return title.includes(q) || desc.includes(q) || tags.includes(q)
      })
    }

    return result
  }, [capsules, activeFilter, debouncedQuery])

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
            <div className="mb-6 flex flex-col md:flex-row items-start justify-between gap-4">
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

            {/* Sticky Controls: search + filter pills */}
            <div className="sticky top-6 z-30">
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl backdrop-blur-md bg-white/80 dark:bg-[#0b0b0b]/70 border border-pink-100 dark:border-[rgba(255,255,255,0.03)] shadow-sm transition-colors">
                {/* Left: search with clear */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500/80 dark:text-[rgba(255,255,255,0.6)] w-4 h-4" />
                    {/* use type="text" to avoid native browser clear icon so only our styled X shows */}
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search capsules by title, description or tag..."
                      className="pl-10 pr-10 py-2 w-full rounded-lg border border-pink-200 bg-white/70 text-sm text-pink-800 placeholder:text-pink-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)] transition-colors dark:bg-[#111111] dark:border-[rgba(255,255,255,0.03)] dark:text-[rgba(255,255,255,0.9)]"
                      aria-label="Search capsules"
                    />
                    {query && (
                      <button
                        onClick={() => setQuery("")}
                        aria-label="Clear search"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-pink-100 dark:hover:bg-[rgba(255,255,255,0.03)] transition-colors"
                      >
                        <XIcon className="w-4 h-4 text-pink-500/80 dark:text-[rgba(255,255,255,0.6)]" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Right: pill filters + results count */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-wrap gap-2">
                    {(["all", "active", "unlocked", "shared", "archived"] as FilterType[]).map(
                      (filter) => {
                        const isActive = activeFilter === filter
                        return (
                          <button
                            key={filter}
                            onClick={() => handleFilterChange(filter)}
                            className={cn(
                              "flex items-center justify-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                              isActive
                                ? "bg-[var(--brand-red)] text-white border-transparent shadow-sm transform scale-100"
                                : "bg-white text-[var(--brand-red)] border-[var(--brand-green)] hover:bg-[rgba(243,130,131,0.08)] dark:bg-[#1a1a1a] dark:text-[rgba(255,255,255,0.85)] dark:border-[rgba(98,207,145,0.06)]"
                            )}
                            style={
                              {
                                "--brand-red": brandRed,
                                "--brand-green": brandGreen,
                              } as React.CSSProperties
                            }
                            aria-pressed={isActive}
                          >
                            {filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                          </button>
                        )
                      }
                    )}
                  </div>

                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-pink-50/60 dark:bg-[rgba(255,255,255,0.03)] text-sm text-pink-700 dark:text-[rgba(255,255,255,0.85)] border border-pink-100">
                    <span className="font-medium">{filteredCapsules.length}</span>
                    <span className="ml-2 text-xs text-pink-600/80">result{filteredCapsules.length !== 1 ? "s" : ""}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Spacer to visually separate sticky controls from list */}
            <div className="h-4" />

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