"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CapsuleCard } from "@/components/capsule-card"
import { FilterType } from "@/components/sidebar-filters"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Plus } from "lucide-react"
import { CapsuleStorage, type Capsule } from "@/lib/capsule-storage"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/components/auth-context"

export default function MyCapsulesPage() {
    const [capsules, setCapsules] = useState<Capsule[]>(() => CapsuleStorage.getAllCapsules())
    const [activeFilter, setActiveFilter] = useState<FilterType>("all")
    const [searchQuery, setSearchQuery] = useState("")

    const { refreshStats } = useAuth()

    // Listen for updates to capsules (dispatched by CapsuleStorage)
    useEffect(() => {
        const handleUpdate = () => setCapsules(CapsuleStorage.getAllCapsules())
        window.addEventListener('capsulesUpdated', handleUpdate)
        return () => window.removeEventListener('capsulesUpdated', handleUpdate)
    }, [])

    const handleFilterChange = (filter: FilterType) => {
        setActiveFilter(filter)
    }

    const filteredCapsules = useMemo(() => {
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                result = result.filter((c) => (c as any).shared === true)
                break
            case "archived":
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                result = result.filter((c) => (c as any).archived === true)
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
                {/* Dashboard Sidebar */}
                <DashboardSidebar />

                {/* Main Content */}
                <main className="flex-1 ml-64 p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Header Actions */}
                        <div className="mb-8 flex flex-col md:flex-row items-start justify-between gap-4">
                            <div>
                                <h1 className="text-4xl font-bold mb-2 text-pink-700">My Capsules</h1>
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
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="mb-6 flex flex-wrap gap-2">
                            {(["all", "active", "unlocked", "shared", "archived"] as FilterType[]).map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => handleFilterChange(filter)}
                                    className={`px-4 py-2 rounded-xl transition-all text-sm font-medium ${activeFilter === filter
                                        ? "bg-pink-500 text-white shadow-md"
                                        : "bg-pink-100/50 text-pink-700 hover:bg-pink-200/50"
                                        }`}
                                >
                                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                </button>
                            ))}
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
