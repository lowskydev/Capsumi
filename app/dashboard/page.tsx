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

export default function DashboardPage() {
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
                  24
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
                <h3 className="text-3xl font-bold text-blue-900 dark:text-[var(--brand-green)] mb-1">
                  18
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
                <h3 className="text-3xl font-bold text-green-900 dark:text-[var(--brand-green)] mb-1">
                  6
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
                <h3 className="text-3xl font-bold text-purple-900 dark:text-[var(--brand-green)] mb-1">
                  3
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
                  <p className="text-pink-600 dark:text-[rgba(255,255,255,0.6)] text-sm">
                    Chart will be displayed here
                  </p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="rounded-2xl p-6 border bg-white dark:bg-[#161616] border-pink-200 dark:border-[rgba(243,130,131,0.3)]">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-pink-700 dark:text-[var(--brand-red)]">
                  <Users className="h-5 w-5" />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      color: "bg-pink-500",
                      label: "New capsule created",
                      time: "2 hours ago",
                    },
                    {
                      color: "bg-blue-500",
                      label: "Capsule unlocked",
                      time: "1 day ago",
                    },
                    {
                      color: "bg-green-500",
                      label: "Content updated",
                      time: "3 days ago",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className={`${item.color} w-2 h-2 rounded-full mt-2 dark:bg-[var(--brand-green)]`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-pink-900 dark:text-[rgba(255,255,255,0.9)]">
                          {item.label}
                        </p>
                        <p className="text-xs text-pink-600 dark:text-[rgba(255,255,255,0.5)]">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
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
