"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { LockedCapsuleView } from "@/components/locked-capsule-view"
import { UnlockedCapsuleView } from "@/components/unlocked-capsule-view"
import { ShareDialog } from "@/components/share-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Lock, Unlock } from "lucide-react"
import { CapsuleStorage, type Capsule } from "@/lib/capsule-storage"
import { useAuth } from "@/components/auth-context"

export default function CapsuleDetailPage() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id
  const [capsule, setCapsule] = useState<Capsule | null>(() =>
    id ? CapsuleStorage.getCapsuleById(id) : null
  )
  const router = useRouter()
  const auth = useAuth()
  const { refreshStats } = auth ?? {}

  const currentUserIdentifier =
    (auth && (auth.user?.email || auth.user?.name || auth.user?.id)) ?? null

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
    refreshStats?.()
    router.push("/mycapsules")
  }

  if (!capsule) {
    return (
      <div className="min-h-screen flex flex-col transition-colors duration-300">
        <div className="flex flex-1 relative">
          <DashboardSidebar />
          <main className="flex-1 lg:ml-64 p-6 bg-gradient-to-br from-pink-50 to-white dark:from-[#0e0e0e] dark:to-[#1a1a1a] transition-colors duration-300 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-semibold text-pink-600 dark:text-white/70 mb-6">
                Capsule not found.
              </p>
              <Button
                onClick={() => router.push("/mycapsules")}
                className="bg-brand-red hover:opacity-90 text-white px-6 py-3 rounded-lg shadow-md"
              >
                Back to My Capsules
              </Button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6 bg-gradient-to-br from-pink-50 to-white dark:from-[#0e0e0e] dark:to-[#1a1a1a] transition-colors duration-300">
          <div className="max-w-5xl mx-auto py-6 md:py-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
              <div className="flex flex-col gap-3 flex-1 min-w-0">
                <h1 className="text-5xl font-extrabold leading-tight text-pink-900 dark:text-brand-red truncate">
                  {capsule.title}
                </h1>

                <div className="flex items-center gap-4 flex-wrap">
                  <Badge
                    variant={capsule.isLocked ? "default" : "secondary"}
                    className={`flex items-center gap-2 text-sm font-semibold border rounded-full px-3 py-1.5 ${
                      capsule.isLocked
                        ? "bg-brand-red/20 border-brand-red text-brand-red"
                        : "bg-brand-green/20 border-brand-green text-brand-green"
                    }`}
                  >
                    {capsule.isLocked ? (
                      <>
                        <Lock className="w-4 h-4" />
                        Locked
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4" />
                        Unlocked
                      </>
                    )}
                  </Badge>

                  {capsule.tags?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {capsule.tags.map((tag, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="text-brand-red bg-brand-red/10 border-none cursor-default"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>

                {capsule.description && (
                  <p className="mt-3 text-lg text-pink-700 dark:text-white/75 leading-relaxed max-w-3xl">
                    {capsule.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 items-center">
                <ShareDialog capsuleId={capsule.id} capsuleTitle={capsule.title} />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDelete}
                  className="border border-brand-red text-brand-red hover:bg-brand-red/15 transition-colors shadow-sm"
                  aria-label="Delete Capsule"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Capsule Content */}
            <section
              className="rounded-3xl border border-pink-300 dark:border-brand-red/30 bg-white dark:bg-[#161616] shadow-lg p-8 transition-all"
            >
              {capsule.isLocked ? (
                <LockedCapsuleView
                  capsule={capsule}
                  currentUserIdentifier={currentUserIdentifier}
                />
              ) : (
                <UnlockedCapsuleView
                  textContent={capsule.textContent}
                  images={capsule.images}
                  audioUrl={capsule.audioUrl}
                  createdDate={capsule.createdDate}
                  unlockDate={capsule.unlockDate}
                  tags={capsule.tags}
                  collaborators={capsule.collaborators}
                  shared={capsule.shared}
                />
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}