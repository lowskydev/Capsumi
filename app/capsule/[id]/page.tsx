"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { LockedCapsuleView } from "@/components/locked-capsule-view"
import { UnlockedCapsuleView } from "@/components/unlocked-capsule-view"
import { ShareDialog } from "@/components/share-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trash2, Lock, Unlock } from "lucide-react"
import Link from "next/link"
import { getCapsules, Capsule } from "@/components/utils/storage"

export default function CapsuleDetailPage() {
  const params = useParams() // ✅ get dynamic params properly
  const [capsule, setCapsule] = useState<Capsule | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!params?.id) return
    const allCapsules = getCapsules().map(c => ({
      ...c,
      unlockDate: new Date(c.unlockDate),
      createdDate: new Date(c.createdDate),
    }))
    const found = allCapsules.find(c => c.id === params.id)
    setCapsule(found || null)
  }, [params?.id])

  if (!capsule) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Capsule not found.</p>
        <Button onClick={() => router.push("/dashboard")} className="ml-4">
          Back to Dashboard
        </Button>
      </div>
    )
  }

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
