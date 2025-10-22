import { Navigation } from "@/components/navigation"
import { SidebarFilters } from "@/components/sidebar-filters"
import { CapsuleCard } from "@/components/capsule-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

const mockCapsules = [
  {
    id: "1",
    title: "Summer Vacation Memories 2024",
    unlockDate: new Date("2025-06-15"),
    createdDate: new Date("2024-06-15"),
    isLocked: true,
    previewImage: "/summer-beach-vacation.png",
    contentTypes: ["text", "image", "audio"] as const,
    tags: ["vacation", "family", "summer"],
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
  },
  {
    id: "3",
    title: "Wedding Day Moments",
    unlockDate: new Date("2024-12-01"),
    createdDate: new Date("2023-12-01"),
    isLocked: false,
    previewImage: "/wedding-celebration-flowers.jpg",
    contentTypes: ["image", "audio"] as const,
    tags: ["wedding", "love", "celebration"],
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
  },
  {
    id: "5",
    title: "College Graduation Reflections",
    unlockDate: new Date("2025-05-15"),
    createdDate: new Date("2024-05-15"),
    isLocked: true,
    contentTypes: ["text", "image"] as const,
    tags: ["education", "achievement"],
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
  },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen page-transition">
      <Navigation />
      <div className="flex">
        <SidebarFilters />
        <main className="flex-1 p-6">
          <div className="container max-w-7xl">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 text-balance">Your Memory Capsules</h1>
                <p className="text-muted-foreground text-lg">Preserve your precious moments for the future</p>
              </div>
              <Link href="/create">
                <Button size="lg" className="gap-2 rounded-2xl hover-lift">
                  <Plus className="w-5 h-5" />
                  Create Capsule
                </Button>
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockCapsules.map((capsule) => (
                <CapsuleCard key={capsule.id} {...capsule} />
              ))}
            </div>

            {mockCapsules.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-8xl mb-6 opacity-20">📦</div>
                <h2 className="text-2xl font-semibold mb-2">No capsules yet</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Start preserving your memories by creating your first time capsule
                </p>
                <Link href="/create">
                  <Button size="lg" className="gap-2 rounded-2xl hover-lift">
                    <Plus className="w-5 h-5" />
                    Create Your First Capsule
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
