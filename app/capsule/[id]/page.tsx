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
import Footer from "@/components/footer";


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
      <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
        <DashboardSidebar />
        <main className="flex-1 min-w-0 lg:ml-64 p-6 transition-all duration-300 flex items-center justify-center w-full">
          <div className="text-center">
            <p className="text-2xl font-semibold text-primary mb-6">Capsule not found.</p>
            <Button onClick={() => router.push("/mycapsules")} className="bg-primary text-primary-foreground hover:opacity-90 px-6 py-3 rounded-lg shadow-md cursor-pointer">
              Back to My Capsules
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <DashboardSidebar />

      <main className="flex-1 min-w-0 p-6 lg:ml-64 transition-all duration-300">
        <div className="max-w-5xl mx-auto py-6 md:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
            <div className="flex flex-col gap-3 flex-1 min-w-0">
              <h1 className="text-5xl font-extrabold leading-tight text-primary truncate">
                {capsule.title}
              </h1>

              <div className="flex items-center gap-4 flex-wrap">
                <Badge
                  variant={capsule.isLocked ? "default" : "secondary"}
                  className={`flex items-center gap-2 text-sm font-semibold border rounded-full px-3 py-1.5 ${
                    capsule.isLocked
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-secondary/20 border-secondary text-secondary-foreground"
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
                        className="text-primary bg-primary/10 border-none cursor-default"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>

              {capsule.description && (
                <p className="mt-3 text-lg text-muted-foreground leading-relaxed max-w-3xl">
                  {capsule.description}
                </p>
              )}
            </div>

            <div className="flex gap-3 items-center">
              <ShareDialog capsuleId={capsule.id} capsuleTitle={capsule.title} />
              <Button
                variant="outline"
                size="icon"
                onClick={handleDelete}
                className="border border-primary text-primary hover:bg-primary/15 transition-colors shadow-sm cursor-pointer"
                aria-label="Delete Capsule"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <section className="rounded-3xl border border-primary/30 bg-card shadow-lg p-8 transition-all">
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
                eventDate={capsule.eventDate}
                tags={capsule.tags}
                collaborators={capsule.collaborators}
                shared={capsule.shared}
              />
            )}
          </section>
        </div>
      </main>
        <div className="w-full p-6 lg:ml-64">
        <Footer />
      </div>
    </div>
  )
}