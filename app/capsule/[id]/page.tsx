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
import { CapsuleStorage, type Capsule } from "@/lib/capsule-storage"
import { useAuth } from "@/components/auth-context"

export default function CapsuleDetailPage() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id
  const [capsule, setCapsule] = useState<Capsule | null>(() =>
    id ? CapsuleStorage.getCapsuleById(id) : null
  )
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { refreshStats } = useAuth()

  useEffect(() => {
    if (!id) return
    const handleUpdate = () => {
      const updated = CapsuleStorage.getCapsuleById(id)
      setCapsule(updated || null)
    }
    handleUpdate()
    window.addEventListener("capsulesUpdated", handleUpdate)
    return () => window.removeEventListener("capsulesUpdated", handleUpdate)
  }, [id])

  const handleDelete = () => {
    if (!capsule) return
    CapsuleStorage.deleteCapsule(capsule.id)
    refreshStats()
    router.push("/mycapsules")
  }

  const brandRed = "#f38283"
  const brandGreen = "#62cf91"

  if (!capsule) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white dark:from-[#0e0e0e] dark:to-[#1a1a1a] transition-colors duration-300"
        style={
          {
            "--brand-red": brandRed,
            "--brand-green": brandGreen,
          } as React.CSSProperties
        }
      >
        <p className="text-pink-600 dark:text-[rgba(255,255,255,0.7)] text-lg">
          Capsule not found.
        </p>
        <Button
          onClick={() => router.push("/mycapsules")}
          className="ml-4 bg-[var(--brand-red)] hover:opacity-90 text-white"
        >
          Back to My Capsules
        </Button>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-50 to-white dark:from-[#0e0e0e] dark:to-[#1a1a1a] transition-colors duration-300"
      style={
        {
          "--brand-red": brandRed,
          "--brand-green": brandGreen,
        } as React.CSSProperties
      }
    >
      <Navigation searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="w-full max-w-4xl mx-auto py-10 px-6">
        {/* Back Link */}
        <Link
          href="/mycapsules"
          className="inline-flex items-center gap-2 text-pink-600 dark:text-[rgba(255,255,255,0.7)] hover:text-[var(--brand-red)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Capsules
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-pink-800 dark:text-[var(--brand-red)] break-words">
                {capsule.title}
              </h1>

              <Badge
                variant={capsule.isLocked ? "default" : "secondary"}
                className={`
                  flex items-center gap-1.5 px-2.5 py-1 text-sm font-medium border 
                  ${
                    capsule.isLocked
                      ? "bg-[var(--brand-red)]/10 border-[var(--brand-red)] text-[var(--brand-red)]"
                      : "bg-[var(--brand-green)]/10 border-[var(--brand-green)] text-[var(--brand-green)]"
                  }
                `}
              >
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
              <p className="text-pink-700 dark:text-[rgba(255,255,255,0.7)] text-lg leading-relaxed">
                {capsule.description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <ShareDialog capsuleId={capsule.id} capsuleTitle={capsule.title} />
            <Button
              variant="outline"
              size="icon"
              onClick={handleDelete}
              className="border border-[var(--brand-red)] text-[var(--brand-red)] hover:bg-[var(--brand-red)]/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Capsule Content */}
        <div
          className="rounded-2xl border border-pink-200 dark:border-[rgba(243,130,131,0.3)] bg-white dark:bg-[#161616] shadow-md transition-all"
        >
          {capsule.isLocked ? (
            <LockedCapsuleView
              unlockDate={capsule.unlockDate}
              previewImage={capsule.previewImage}
            />
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
        </div>
      </main>
    </div>
  )
}
