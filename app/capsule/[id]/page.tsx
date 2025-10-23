import { Navigation } from "@/components/navigation"
import { LockedCapsuleView } from "@/components/locked-capsule-view"
import { UnlockedCapsuleView } from "@/components/unlocked-capsule-view"
import { ShareDialog } from "@/components/share-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trash2, Lock, Unlock } from "lucide-react"
import Link from "next/link"

// Mock data - in a real app, this would come from a database
const mockCapsule = {
  id: "1",
  title: "Summer Vacation Memories 2024",
  description: "Beach trips, family dinners, and unforgettable summer adventures.",
  unlockDate: new Date("2025-06-15"),
  createdDate: new Date("2024-06-15"),
  isLocked: true,
  previewImage: "/summer-beach-vacation.png",
  textContent: `Dear Future Me,

This summer was absolutely incredible! We spent two weeks at the beach house, and every day felt like a gift. The kids learned to surf, we had those amazing sunset barbecues, and I finally finished reading that book I've been putting off for years.

Remember how nervous you were about taking time off work? It was so worth it. These moments with the family are what life is really about.

I hope when you read this next year, you've continued to prioritize what matters most.

With love from the past,
You`,
  images: [
    "/summer-beach-vacation.png",
    "/family-beach-sunset.jpg",
    "/kids-surfing-ocean.jpg",
    "/beach-house-barbecue.jpg",
  ],
  audioUrl: "/placeholder-audio.mp3",
  tags: ["vacation", "family", "summer", "beach"],
}

export default function CapsuleDetailPage({ params }: { params: { id: string } }) {
  const capsule = mockCapsule // In real app: fetch by params.id

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="w-full max-w-4xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-balance">{capsule.title}</h1>
                <Badge variant={capsule.isLocked ? "default" : "secondary"} className="gap-1.5">
                  {capsule.isLocked ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      Locked
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      Unlocked
                    </>
                  )}
                </Badge>
              </div>
              {capsule.description && (
                <p className="text-muted-foreground text-lg text-pretty">{capsule.description}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <ShareDialog capsuleId={capsule.id} capsuleTitle={capsule.title} />
              <Button variant="outline" size="icon" className="bg-transparent text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        {capsule.isLocked ? (
          <LockedCapsuleView unlockDate={capsule.unlockDate} previewImage={capsule.previewImage} />
        ) : (
          <UnlockedCapsuleView
            textContent={capsule.textContent}
            images={capsule.images}
            audioUrl={capsule.audioUrl}
            createdDate={capsule.createdDate}
            unlockDate={capsule.unlockDate}
            tags={capsule.tags}
          />
        )}
      </main>
    </div>
  )
}
