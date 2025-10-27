"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { TimelineItem } from "@/components/timeline-item"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

// Mock data sorted by unlock date
const mockCapsules = [
  {
    id: "3",
    title: "Wedding Day Moments",
    unlockDate: new Date("2024-12-01"),
    createdDate: new Date("2023-12-01"),
    isLocked: false,
    previewImage: "/wedding-celebration-flowers.jpg",
    contentTypes: ["image", "audio"] as const,
    tags: ["wedding", "love", "celebration"],
    description: "Our special day captured in photos and audio messages from loved ones.",
  },
  {
    id: "6",
    title: "New Year Resolutions 2024",
    unlockDate: new Date("2024-12-31"),
    createdDate: new Date("2024-01-01"),
    isLocked: false,
    previewImage: "/new-year-fireworks-celebration.jpg",
    contentTypes: ["text"] as const,
    tags: ["goals", "personal"],
    description: "My goals and aspirations for 2024, to be reviewed at year's end.",
  },
  {
    id: "4",
    title: "Baby's First Year",
    unlockDate: new Date("2025-03-20"),
    createdDate: new Date("2024-03-20"),
    isLocked: true,
    previewImage: "/baby-toys-nursery.jpg",
    contentTypes: ["image", "text"] as const,
    tags: ["family", "milestone", "baby"],
    description: "Documenting every precious moment of our baby's first year of life.",
  },
  {
    id: "5",
    title: "College Graduation Reflections",
    unlockDate: new Date("2025-05-15"),
    createdDate: new Date("2024-05-15"),
    isLocked: true,
    contentTypes: ["text", "image"] as const,
    tags: ["education", "achievement"],
    description: "Thoughts and memories from my college graduation day.",
  },
  {
    id: "1",
    title: "Summer Vacation Memories 2024",
    unlockDate: new Date("2025-06-15"),
    createdDate: new Date("2024-06-15"),
    isLocked: true,
    previewImage: "/summer-beach-vacation.png",
    contentTypes: ["text", "image", "audio"] as const,
    tags: ["vacation", "family", "summer"],
    description: "Beach trips, family dinners, and unforgettable summer adventures.",
  },
  {
    id: "2",
    title: "Letter to My Future Self",
    unlockDate: new Date("2026-01-01"),
    createdDate: new Date("2024-01-01"),
    isLocked: true,
    previewImage: "/handwritten-letter-vintage.jpg",
    contentTypes: ["text"] as const,
    tags: ["personal", "reflection"],
    description: "A heartfelt letter to myself, to be opened in two years.",
  },
]

export default function TimelinePage() {
  const brandRed = "#f38283"
  const brandGreen = "#62cf91"

  return (
    <div
      className="min-h-screen flex bg-gradient-to-br from-pink-50 to-white dark:from-[#0e0e0e] dark:to-[#1a1a1a] transition-colors duration-300"
      style={
        {
          "--brand-red": brandRed,
          "--brand-green": brandGreen,
        } as React.CSSProperties
      }
    >
      <DashboardSidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="container max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10 flex flex-col md:flex-row items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-pink-800 dark:text-[var(--brand-red)]">
                Timeline View
              </h1>
              <p className="text-pink-700 dark:text-[rgba(255,255,255,0.7)] text-lg">
                Your capsules arranged chronologically by unlock date
              </p>
            </div>
            <Link href="/create">
              <Button className="gap-2 rounded-2xl bg-[var(--brand-red)] hover:bg-[var(--brand-green)] text-white shadow-md transition-all">
                <Plus className="w-5 h-5" /> Create Capsule
              </Button>
            </Link>
          </div>

          {/* Timeline */}
          <div className="relative">
            {mockCapsules.map((capsule) => (
              <TimelineItem key={capsule.id} {...capsule} />
            ))}
          </div>

          {/* Empty State */}
          {mockCapsules.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-8xl mb-6 opacity-20">⏳</div>
              <h2 className="text-2xl font-semibold mb-2 text-pink-800 dark:text-[var(--brand-red)]">
                No capsules in your timeline
              </h2>
              <p className="text-pink-700 dark:text-[rgba(255,255,255,0.7)] mb-6 max-w-md">
                Create your first time capsule to start building your timeline
              </p>
              <Link href="/create">
                <Button className="gap-2 rounded-2xl bg-[var(--brand-red)] hover:bg-[var(--brand-green)] text-white shadow-md transition-all">
                  <Plus className="w-5 h-5" /> Create Your First Capsule
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
