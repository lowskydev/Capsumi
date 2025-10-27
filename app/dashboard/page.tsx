"use client"

import Link from "next/link"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Package, Lock, Unlock, Calendar, TrendingUp, Users, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex flex-1 relative">
        {/* Dashboard Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 text-pink-700">Dashboard</h1>
              <p className="text-pink-600 text-lg">
                Welcome back! Here's an overview of your capsules
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              {/* Total Capsules */}
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 border border-pink-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-pink-200">
                    <Package className="h-6 w-6 text-pink-700" />
                  </div>
                  <span className="text-xs font-medium text-pink-600 px-2 py-1 rounded-full bg-pink-200">
                    +12%
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-pink-900 mb-1">24</h3>
                <p className="text-sm text-pink-600">Total Capsules</p>
              </div>

              {/* Active Capsules */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-blue-200">
                    <Lock className="h-6 w-6 text-blue-700" />
                  </div>
                  <span className="text-xs font-medium text-blue-600 px-2 py-1 rounded-full bg-blue-200">
                    Active
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-blue-900 mb-1">18</h3>
                <p className="text-sm text-blue-600">Locked</p>
              </div>

              {/* Unlocked Capsules */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-green-200">
                    <Unlock className="h-6 w-6 text-green-700" />
                  </div>
                  <span className="text-xs font-medium text-green-600 px-2 py-1 rounded-full bg-green-200">
                    Open
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-green-900 mb-1">6</h3>
                <p className="text-sm text-green-600">Unlocked</p>
              </div>

              {/* Upcoming Unlocks */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-purple-200">
                    <Calendar className="h-6 w-6 text-purple-700" />
                  </div>
                  <span className="text-xs font-medium text-purple-600 px-2 py-1 rounded-full bg-purple-200">
                    This month
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-purple-900 mb-1">3</h3>
                <p className="text-sm text-purple-600">Upcoming</p>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              {/* Growth Chart Placeholder */}
              <div className="bg-card rounded-2xl p-6 border border-border col-span-2">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-pink-600" />
                  Growth Overview
                </h3>
                <div className="h-64 bg-gradient-to-t from-pink-50 to-transparent rounded-xl flex items-center justify-center border-2 border-dashed border-pink-200">
                  <p className="text-pink-600 text-sm">Chart will be displayed here</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-pink-600" />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-pink-500 mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New capsule created</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Capsule unlocked</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Content updated</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 border border-pink-200">
              <h3 className="text-lg font-semibold mb-4 text-pink-900">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Link href="/create">
                  <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Capsule
                  </Button>
                </Link>
                <Link href="/mycapsules">
                  <Button variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-100">
                    View My Capsules
                  </Button>
                </Link>
                <Link href="/timeline">
                  <Button variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-100">
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
