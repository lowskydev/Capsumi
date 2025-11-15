"use client"

import Link from "next/link"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import {
  Package,
  Lock,
  Unlock,
  Calendar,
  TrendingUp,
  Users,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import React, { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CapsuleStorage, type Capsule } from "@/lib/capsule-storage"
import { CapsuleCard } from "@/components/capsule-card"

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  ChartOptions,
} from "chart.js"
import { Line } from "react-chartjs-2"
import "chartjs-adapter-date-fns"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
)

export default function DashboardPage() {
  const brandRed = "#f38283"
  const brandGreen = "#62cf91"
  const [capsules, setCapsules] = useState<Capsule[]>(
    () => CapsuleStorage.getAllCapsules()
  )

  useEffect(() => {
    const handleUpdate = () => setCapsules(CapsuleStorage.getAllCapsules())
    window.addEventListener("capsulesUpdated", handleUpdate)
    return () => window.removeEventListener("capsulesUpdated", handleUpdate)
  }, [])

  // helper to format relative time (simple human readable)
  const timeAgo = (from: Date, to = new Date()) => {
    const diff = to.getTime() - from.getTime()
    const abs = Math.abs(diff)
    const seconds = Math.floor(abs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    const suffix = diff >= 0 ? "ago" : "from now"

    if (seconds < 45) return `${seconds} second${seconds !== 1 ? "s" : ""} ${suffix}`
    if (minutes < 45) return `${minutes} minute${minutes !== 1 ? "s" : ""} ${suffix}`
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ${suffix}`
    if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ${suffix}`
    if (weeks < 5) return `${weeks} week${weeks !== 1 ? "s" : ""} ${suffix}`
    if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ${suffix}`
    return `${years} year${years !== 1 ? "s" : ""} ${suffix}`
  }

  const stats = useMemo(() => {
    const now = new Date()
    const total = capsules.length
    const MS_DAY = 1000 * 60 * 60 * 24

    // Prefer explicit isLocked flag if available; fall back to comparing unlockDate if not present.
    const locked = capsules.filter((c) =>
      typeof c.isLocked === "boolean" ? c.isLocked : (c.unlockDate ? new Date(c.unlockDate) > now : false)
    ).length
    const unlocked = total - locked

    // Shared if shared flag true or collaborators array exists with entries
    const shared = capsules.filter((c) =>
      !!(c.shared || (Array.isArray((c as any).collaborators) && (c as any).collaborators.length > 0))
    ).length

    // upcoming unlocks: capsules scheduled to unlock in the next 30 days
    const THIRTY_DAYS_MS = 30 * MS_DAY
    const upcoming = capsules.filter((c) => {
      if (!c.unlockDate) return false
      const d = new Date(c.unlockDate)
      return d > now && d.getTime() <= now.getTime() + THIRTY_DAYS_MS
    }).length

    // content totals (defensive)
    let imageCount = 0
    let audioCount = 0
    let tagCount = 0

    capsules.forEach((c) => {
      if (Array.isArray(c.images)) imageCount += c.images.length

      // audios: new array field `audios` or legacy `audioUrl`
      if (Array.isArray((c as any).audios)) audioCount += (c as any).audios.length
      else if ((c as any).audioUrl) audioCount += 1

      if (Array.isArray(c.tags)) tagCount += c.tags.length
    })

    // recent capsules sorted by createdDate desc (defensive parse)
    const recent = [...capsules].sort((a, b) => {
      const da = a.createdDate ? new Date(a.createdDate).getTime() : 0
      const db = b.createdDate ? new Date(b.createdDate).getTime() : 0
      return db - da
    }).slice(0, 20)

    // Compute the three items you asked for:
    let lastCreated: { capsule: Capsule; when: Date } | null = null
    let lastUnlocked: { capsule: Capsule; when: Date } | null = null
    let nextToUnlock: { capsule: Capsule; when: Date } | null = null

    if (capsules.length > 0) {
      // lastCreated
      const byCreated = [...capsules].sort((a, b) => {
        const ta = a.createdDate ? new Date(a.createdDate).getTime() : 0
        const tb = b.createdDate ? new Date(b.createdDate).getTime() : 0
        return tb - ta
      })
      const lc = byCreated[0]
      if (lc) lastCreated = { capsule: lc, when: new Date(lc.createdDate) }

      // lastUnlocked: filter unlocked capsules and take the one with latest unlockDate <= now
      const unlockedCaps = capsules
        .map((c) => ({ c, unlockedAt: c.unlockDate ? new Date(c.unlockDate) : new Date(0) }))
        .filter(({ unlockedAt }) => unlockedAt && unlockedAt <= now)
        .sort((a, b) => b.unlockedAt!.getTime() - a.unlockedAt!.getTime())

      if (unlockedCaps.length > 0) {
        lastUnlocked = { capsule: unlockedCaps[0].c, when: unlockedCaps[0].unlockedAt! }
      }

      // nextToUnlock: future unlocks, soonest first
      const futureCaps = capsules
        .map((c) => ({ c, unlockAt: c.unlockDate ? new Date(c.unlockDate) : new Date(0) }))
        .filter(({ unlockAt }) => unlockAt && unlockAt > now)
        .sort((a, b) => a.unlockAt!.getTime() - b.unlockAt!.getTime())

      if (futureCaps.length > 0) {
        nextToUnlock = { capsule: futureCaps[0].c, when: futureCaps[0].unlockAt! }
      }
    }

    // Build recentActivity with richer info: keep for compatibility but not required by the UI now
    const recentActivity: { label: string; date: Date; type: "unlocked" | "upcoming" | "created"; days: number }[] = []

    // Upcoming buckets (counts)
    const upcomingBuckets = {
      "0-3": 0,
      "4-7": 0,
      "8-30": 0,
      "30+": 0,
    }

    capsules.forEach((c) => {
      if (!c.unlockDate) return
      const unlock = new Date(c.unlockDate)
      if (unlock <= new Date()) return
      const daysUntil = Math.ceil((unlock.getTime() - new Date().getTime()) / MS_DAY)
      if (daysUntil <= 3) upcomingBuckets["0-3"]++
      else if (daysUntil <= 7) upcomingBuckets["4-7"]++
      else if (daysUntil <= 30) upcomingBuckets["8-30"]++
      else upcomingBuckets["30+"]++
    })

    // Average days until unlock for upcoming capsules (if any)
    const upcomingList = capsules
      .map((c) => ({ c, unlockAt: c.unlockDate ? new Date(c.unlockDate) : null }))
      .filter((it) => it.unlockAt && it.unlockAt > new Date())

    const avgDaysUntilUnlock =
      upcomingList.length > 0
        ? Math.round(upcomingList.reduce((acc, it) => acc + Math.ceil((it.unlockAt!.getTime() - new Date().getTime()) / MS_DAY), 0) / upcomingList.length)
        : 0

    return {
      total,
      locked,
      unlocked,
      shared,
      upcoming,
      imageCount,
      audioCount,
      tagCount,
      recent,
      lastCreated,
      lastUnlocked,
      nextToUnlock,
      recentActivity,
      upcomingBuckets,
      avgDaysUntilUnlock,
    }
  }, [capsules])

  // Chart data: last 30 days created/unlocked + cumulative
  const chartConfig = useMemo(() => {
    const days = 30
    const now = new Date()
    const labels: Date[] = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      d.setHours(0, 0, 0, 0)
      labels.push(d)
    }

    const createdCounts = new Array(days).fill(0)
    const unlockedCounts = new Array(days).fill(0)

    capsules.forEach((c) => {
      const created = c.createdDate ? new Date(c.createdDate) : null
      const unlock = c.unlockDate ? new Date(c.unlockDate) : null

      if (created) {
        const cd = new Date(created)
        cd.setHours(0, 0, 0, 0)
        const idx = labels.findIndex((d) => d.getTime() === cd.getTime())
        if (idx >= 0) createdCounts[idx]++
      }

      if (unlock) {
        const ud = new Date(unlock)
        ud.setHours(0, 0, 0, 0)
        const idx = labels.findIndex((d) => d.getTime() === ud.getTime())
        if (idx >= 0) unlockedCounts[idx]++
      }
    })

    // cumulative created
    const cumulative: number[] = []
    createdCounts.reduce((acc, v, i) => {
      const cur = acc + v
      cumulative[i] = cur
      return cur
    }, 0)

    const datasets = [
      {
        label: "Created",
        data: createdCounts,
        fill: true,
        backgroundColor: "rgba(243,130,131,0.18)",
        borderColor: "rgba(243,130,131,0.9)",
        tension: 0.35,
        pointRadius: 2,
      },
      {
        label: "Unlocked",
        data: unlockedCounts,
        fill: true,
        backgroundColor: "rgba(98,207,145,0.18)",
        borderColor: "rgba(98,207,145,0.9)",
        tension: 0.35,
        pointRadius: 2,
      },
      {
        label: "Cumulative",
        data: cumulative,
        fill: false,
        borderColor: "rgba(100,100,100,0.6)",
        tension: 0.2,
        pointRadius: 0,
        borderDash: [4, 4],
      },
    ]

    return { labels, datasets }
  }, [capsules])

  const chartOptions = useMemo<ChartOptions<"line">>(() => {
    const opts = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index" as const, intersect: false },
      scales: {
        x: {
          type: "time" as const,
          time: { unit: "day" as const, tooltipFormat: "PP" },
          grid: { display: false },
          ticks: { maxRotation: 0, autoSkip: true },
        },
        y: {
          beginAtZero: true,
          ticks: { precision: 0 },
        },
      },
      plugins: {
        legend: { position: "top" as const },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              const label = context.dataset.label || ""
              const value = context.parsed?.y ?? context.parsed
              return `${label}: ${value}`
            },
          },
        },
      },
    }

    return opts as unknown as ChartOptions<"line">
  }, [])

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
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 text-pink-700 dark:text-[var(--brand-red)]">
                Dashboard
              </h1>
              <p className="text-pink-600 dark:text-[rgba(255,255,255,0.7)] text-lg">
                Welcome back! Here's an overview of your capsules
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              {/* Total Capsules */}
              <div className="rounded-2xl p-6 border transition-all bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 dark:from-[rgba(243,130,131,0.1)] dark:to-[rgba(243,130,131,0.05)] dark:border-[rgba(243,130,131,0.3)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-pink-200 dark:bg-[rgba(243,130,131,0.2)]">
                    <Package className="h-6 w-6 text-pink-700 dark:text-[var(--brand-green)]" />
                  </div>
                  <span className="text-xs font-medium text-pink-600 px-2 py-1 rounded-full bg-pink-200 dark:text-[var(--brand-green)] dark:bg-[rgba(98,207,145,0.2)]">
                    +12%
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-pink-900 dark:text-[var(--brand-green)] mb-1">
                  {stats.total}
                </h3>
                <p className="text-sm text-pink-600 dark:text-[rgba(255,255,255,0.7)]">
                  Total Capsules
                </p>
              </div>

              {/* Active Capsules */}
              <div className="rounded-2xl p-6 border bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-[rgba(243,130,131,0.1)] dark:to-[rgba(243,130,131,0.05)] dark:border-[rgba(243,130,131,0.3)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-blue-200 dark:bg-[rgba(243,130,131,0.2)]">
                    <Lock className="h-6 w-6 text-blue-700 dark:text-[var(--brand-green)]" />
                  </div>
                  <span className="text-xs font-medium text-blue-600 px-2 py-1 rounded-full bg-blue-200 dark:text-[var(--brand-green)] dark:bg-[rgba(98,207,145,0.2)]">
                    Active
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-pink-900 dark:text-[var(--brand-green)] mb-1">
                  {stats.locked}
                </h3>
                <p className="text-sm text-blue-600 dark:text-[rgba(255,255,255,0.7)]">
                  Locked
                </p>
              </div>

              {/* Unlocked Capsules */}
              <div className="rounded-2xl p-6 border bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-[rgba(98,207,145,0.1)] dark:to-[rgba(98,207,145,0.05)] dark:border-[rgba(98,207,145,0.4)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-green-200 dark:bg-[rgba(98,207,145,0.25)]">
                    <Unlock className="h-6 w-6 text-green-700 dark:text-[var(--brand-green)]" />
                  </div>
                  <span className="text-xs font-medium text-green-600 px-2 py-1 rounded-full bg-green-200 dark:text-[var(--brand-green)] dark:bg-[rgba(98,207,145,0.2)]">
                    Open
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-pink-900 dark:text-[var(--brand-green)] mb-1">
                  {stats.unlocked}
                </h3>
                <p className="text-sm text-green-600 dark:text-[rgba(255,255,255,0.7)]">
                  Unlocked
                </p>
              </div>

              {/* Upcoming Unlocks */}
              <div className="rounded-2xl p-6 border bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-[rgba(243,130,131,0.08)] dark:to-[rgba(243,130,131,0.03)] dark:border-[rgba(243,130,131,0.3)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-purple-200 dark:bg-[rgba(243,130,131,0.2)]">
                    <Calendar className="h-6 w-6 text-purple-700 dark:text-[var(--brand-green)]" />
                  </div>
                  <span className="text-xs font-medium text-purple-600 px-2 py-1 rounded-full bg-purple-200 dark:text-[var(--brand-green)] dark:bg-[rgba(98,207,145,0.2)]">
                    This month
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-pink-900 dark:text-[var(--brand-green)] mb-1">
                  {stats.upcoming}
                </h3>
                <p className="text-sm text-purple-600 dark:text-[rgba(255,255,255,0.7)]">
                  Upcoming
                </p>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              {/* Growth Chart */}
              <div className="rounded-2xl p-6 border col-span-2 bg-white dark:bg-[#161616] border-pink-200 dark:border-[rgba(243,130,131,0.3)]">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-pink-700 dark:text-[var(--brand-red)]">
                  <TrendingUp className="h-5 w-5" />
                  Growth Overview
                </h3>
                <div className="h-64 bg-gradient-to-t from-pink-50 to-transparent dark:from-[rgba(243,130,131,0.1)] dark:to-transparent rounded-xl flex items-center justify-center border-2 border-dashed border-pink-200 dark:border-[rgba(243,130,131,0.3)]">
                  {/* Chart inserted here */}
                  <div className="w-full h-full px-2 py-1">
                    <Line data={{
                      labels: chartConfig.labels,
                      datasets: chartConfig.datasets
                    }} options={chartOptions} />
                  </div>
                </div>
              </div>

              {/* Recent Activity (updated layout as requested) */}
              <div className="rounded-2xl p-6 border bg-white dark:bg-[#161616] border-pink-200 dark:border-[rgba(243,130,131,0.3)]">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-pink-700 dark:text-[var(--brand-red)]">
                  <Users className="h-5 w-5" />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {/* Last capsule created */}
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-2 bg-pink-500 dark:bg-[var(--brand-green)]" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-pink-900 dark:text-[rgba(255,255,255,0.9)]">
                        {stats.lastCreated ? `Last created: ${stats.lastCreated.capsule.title}` : "No capsules yet"}
                      </p>
                      <p className="text-xs text-pink-600 dark:text-[rgba(255,255,255,0.5)]">
                        {stats.lastCreated ? timeAgo(stats.lastCreated.when) : ""}
                      </p>
                    </div>
                  </div>

                  {/* Last capsule unlocked */}
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-2 bg-blue-500 dark:bg-[var(--brand-green)]" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-pink-900 dark:text-[rgba(255,255,255,0.9)]">
                        {stats.lastUnlocked ? `Last unlocked: ${stats.lastUnlocked.capsule.title}` : "No recent unlocks"}
                      </p>
                      <p className="text-xs text-pink-600 dark:text-[rgba(255,255,255,0.5)]">
                        {stats.lastUnlocked ? timeAgo(stats.lastUnlocked.when) : ""}
                      </p>
                    </div>
                  </div>

                  {/* Next capsule to unlock */}
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-2 bg-green-500 dark:bg-[var(--brand-green)]" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-pink-900 dark:text-[rgba(255,255,255,0.9)]">
                        {stats.nextToUnlock ? `Next to unlock: ${stats.nextToUnlock.capsule.title}` : "No upcoming unlocks"}
                      </p>
                      <p className="text-xs text-pink-600 dark:text-[rgba(255,255,255,0.5)]">
                        {stats.nextToUnlock ? timeAgo(stats.nextToUnlock.when) : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl p-6 border bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 dark:from-[rgba(243,130,131,0.08)] dark:to-[rgba(243,130,131,0.03)] dark:border-[rgba(243,130,131,0.3)]">
              <h3 className="text-lg font-semibold mb-4 text-pink-900 dark:text-[var(--brand-red)]">
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                <Link href="/create">
                  <Button className="bg-[var(--brand-red)] hover:opacity-90 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Capsule
                  </Button>
                </Link>
                <Link href="/mycapsules">
                  <Button
                    variant="outline"
                    className="border-pink-300 text-pink-700 hover:bg-pink-100 dark:border-[rgba(243,130,131,0.3)] dark:text-[var(--brand-green)] dark:hover:bg-[rgba(243,130,131,0.15)]"
                  >
                    View My Capsules
                  </Button>
                </Link>
                <Link href="/timeline">
                  <Button
                    variant="outline"
                    className="border-pink-300 text-pink-700 hover:bg-pink-100 dark:border-[rgba(243,130,131,0.3)] dark:text-[var(--brand-green)] dark:hover:bg-[rgba(243,130,131,0.15)]"
                  >
                    View Timeline
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}