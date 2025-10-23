"use client"
import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { SidebarFilters } from "@/components/sidebar-filters"
import { CapsuleCard } from "@/components/capsule-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { getCapsules, Capsule } from "@/components/utils/storage"

export default function DashboardPage() {
  const [capsules, setCapsules] = useState<Capsule[]>([])

  useEffect(() => {
    const stored = getCapsules().map((c) => ({
      ...c,
      unlockDate: new Date(c.unlockDate),
      createdDate: new Date(c.createdDate),
      contentTypes: c.contentTypes || [], // default empty array
      tags: c.tags || [],
    }))
    setCapsules(stored)
  }, [])

  return (
    <div className="min-h-screen page-transition">
      <Navigation />
      <div className="flex">
        <SidebarFilters />
        <main className="flex-1 p-6">
          <div className="container max-w-7xl mx-auto">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 text-balance">Your Memory Capsules</h1>
                <p className="text-muted-foreground text-lg">Preserve your precious moments for the future</p>
              </div>
              <Link href="/create">
                <Button size="lg" className="gap-2 rounded-2xl hover-lift">
                  <Plus className="w-5 h-5" /> Create Capsule
                </Button>
              </Link>
            </div>

            {capsules.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-8xl mb-6 opacity-20">📦</div>
                <h2 className="text-2xl font-semibold mb-2">No capsules yet</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Start preserving your memories by creating your first time capsule
                </p>
                <Link href="/create">
                  <Button size="lg" className="gap-2 rounded-2xl hover-lift">
                    <Plus className="w-5 h-5" /> Create Your First Capsule
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {capsules.map((c) => (
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
