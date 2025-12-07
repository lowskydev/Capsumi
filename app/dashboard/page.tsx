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
import { CapsuleStorage, type Capsule } from "@/lib/capsule-storage"

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
import Footer from "@/components/footer"

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
  const [capsules, setCapsules] = useState<Capsule[]>(
    () => CapsuleStorage.getAllCapsules()
  )

  useEffect(() => {
    const handleUpdate = () => setCapsules(CapsuleStorage.getAllCapsules())
    window.addEventListener("capsulesUpdated", handleUpdate)
    return () => window.removeEventListener("capsulesUpdated", handleUpdate)
  }, [])

  const timeAgo = (from: Date, to = new Date()) => {
    const diff = to.getTime() - from.getTime()
    const abs = Math.abs(diff)
    const seconds = Math.floor(abs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (seconds < 45) return "just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const stats = useMemo(() => {
    const now = new Date()
    const total = capsules.length
    const locked = capsules.filter((c) =>
      typeof c.isLocked === "boolean" ? c.isLocked : (c.unlockDate ? new Date(c.unlockDate) > now : false)
    ).length
    const unlocked = total - locked
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000
    const upcoming = capsules.filter((c) => {
      if (!c.unlockDate) return false
      const d = new Date(c.unlockDate)
      return d > now && d.getTime() <= now.getTime() + THIRTY_DAYS_MS
    }).length

    let lastCreated = null
    let lastUnlocked = null
    let nextToUnlock = null

    if (capsules.length > 0) {
      const byCreated = [...capsules].sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
      if (byCreated[0]) lastCreated = { capsule: byCreated[0], when: new Date(byCreated[0].createdDate) }

      const unlockedCaps = capsules
        .filter(c => c.unlockDate && new Date(c.unlockDate) <= now)
        .sort((a, b) => new Date(b.unlockDate).getTime() - new Date(a.unlockDate).getTime())
      if (unlockedCaps[0]) lastUnlocked = { capsule: unlockedCaps[0], when: new Date(unlockedCaps[0].unlockDate) }

      const futureCaps = capsules
        .filter(c => c.unlockDate && new Date(c.unlockDate) > now)
        .sort((a, b) => new Date(a.unlockDate).getTime() - new Date(b.unlockDate).getTime())
      if (futureCaps[0]) nextToUnlock = { capsule: futureCaps[0], when: new Date(futureCaps[0].unlockDate) }
    }

    return { total, locked, unlocked, upcoming, lastCreated, lastUnlocked, nextToUnlock }
  }, [capsules])

  const chartConfig = useMemo(() => {
    // Increased range to 90 days to catch older activity
    const days = 90
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
      if (c.createdDate) {
        const d = new Date(c.createdDate); d.setHours(0,0,0,0);
        const idx = labels.findIndex(l => l.getTime() === d.getTime())
        if (idx >= 0) createdCounts[idx]++
      }
      if (c.unlockDate) {
        const d = new Date(c.unlockDate); d.setHours(0,0,0,0);
        const idx = labels.findIndex(l => l.getTime() === d.getTime())
        if (idx >= 0) unlockedCounts[idx]++
      }
    })

    return {
      labels,
      datasets: [
        {
          label: "Created",
          data: createdCounts,
          fill: true,
          backgroundColor: "rgba(243,130,131,0.1)",
          borderColor: "#f38283", 
          tension: 0.4,
          pointRadius: 0,
          pointHitRadius: 10,
        },
        {
          label: "Unlocked",
          data: unlockedCounts,
          fill: true,
          backgroundColor: "rgba(98,207,145,0.1)",
          borderColor: "#62cf91", 
          tension: 0.4,
          pointRadius: 0,
          pointHitRadius: 10,
        },
      ]
    }
  }, [capsules])

  const chartOptions = useMemo<ChartOptions<"line">>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    layout: {
      padding: {
        top: 10,
        bottom: 0,
        left: 0,
        right: 0
      }
    },
    scales: {
      x: { 
        display: false 
      },
      y: { 
        display: false,
        beginAtZero: true,
        grace: '10%'
      },
    },
    plugins: { 
      legend: { display: false },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      }
    },
  }), [])

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <DashboardSidebar />

      <main className="flex-1 p-4 lg:p-6 lg:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 lg:mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-primary">Dashboard</h1>
            <p className="text-muted-foreground text-base lg:text-lg">
              Welcome back! Here&apos;s an overview of your capsules
            </p>
          </div>

          <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4 mb-6 lg:mb-8">
            <div className="rounded-2xl p-4 lg:p-6 border border-primary/20 bg-primary/5">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className="p-2 lg:p-3 rounded-xl bg-primary/10">
                  <Package className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-1">{stats.total}</h3>
              <p className="text-xs lg:text-sm text-muted-foreground">Total Capsules</p>
            </div>

            <div className="rounded-2xl p-4 lg:p-6 border border-blue-200 bg-blue-50/50 dark:border-blue-900/30 dark:bg-blue-900/10">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className="p-2 lg:p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <Lock className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-1">{stats.locked}</h3>
              <p className="text-xs lg:text-sm text-muted-foreground">Locked</p>
            </div>

            <div className="rounded-2xl p-4 lg:p-6 border border-secondary/30 bg-secondary/5">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className="p-2 lg:p-3 rounded-xl bg-secondary/10">
                  <Unlock className="h-5 w-5 lg:h-6 lg:w-6 text-secondary" />
                </div>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-1">{stats.unlocked}</h3>
              <p className="text-xs lg:text-sm text-muted-foreground">Unlocked</p>
            </div>

            <div className="rounded-2xl p-4 lg:p-6 border border-purple-200 bg-purple-50/50 dark:border-purple-900/30 dark:bg-purple-900/10">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className="p-2 lg:p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                  <Calendar className="h-5 w-5 lg:h-6 lg:w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-1">{stats.upcoming}</h3>
              <p className="text-xs lg:text-sm text-muted-foreground">Upcoming (30d)</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <div className="rounded-2xl p-4 lg:p-6 border border-border bg-card col-span-3 md:col-span-2">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                <TrendingUp className="h-5 w-5 text-primary" />
                Activity Trend (Last 90 Days)
              </h3>
              <div className="h-56 lg:h-64 w-full overflow-hidden relative">
                <Line data={chartConfig} options={chartOptions} />
              </div>
            </div>

            <div className="rounded-2xl p-4 lg:p-6 border border-border bg-card col-span-3 md:col-span-1">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Users className="h-5 w-5 text-primary" />
                Latest Activity
              </h3>
              <div className="space-y-6">
                <div className="flex gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {stats.lastCreated ? `Created "${stats.lastCreated.capsule.title}"` : "No capsules created"}
                    </p>
                    <p className="text-xs text-muted-foreground">{stats.lastCreated ? timeAgo(stats.lastCreated.when) : ""}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-secondary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {stats.lastUnlocked ? `Unlocked "${stats.lastUnlocked.capsule.title}"` : "No capsules unlocked"}
                    </p>
                    <p className="text-xs text-muted-foreground">{stats.lastUnlocked ? timeAgo(stats.lastUnlocked.when) : ""}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {stats.nextToUnlock ? `Next: "${stats.nextToUnlock.capsule.title}"` : "No upcoming unlocks"}
                    </p>
                    <p className="text-xs text-muted-foreground">{stats.nextToUnlock ? timeAgo(stats.nextToUnlock.when) : ""}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 lg:p-6 border border-primary/10 bg-primary/5">
            <h3 className="text-lg font-semibold mb-4 text-primary">Quick Actions</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/create" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer h-12 sm:h-10 text-base sm:text-sm">
                  <Plus className="w-4 h-4 mr-2" /> Create New
                </Button>
              </Link>
              <Link href="/mycapsules" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-primary/30 text-primary hover:bg-primary/10 cursor-pointer h-12 sm:h-10 text-base sm:text-sm">
                  View Capsules
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <div className="w-full p-6 lg:ml-64">
        <Footer />
      </div>
    </div>
  )
}