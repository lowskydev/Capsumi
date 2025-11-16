"use client"

import React, { useMemo } from "react"
import { Calendar, Lock, Unlock, ImageIcon, FileText, Music, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Capsule } from "@/lib/capsule-storage"

interface Props {
  capsule: Capsule
  // optional fixedHeight override (px or Tailwind class) if you want different sizing later
  fixedHeightClass?: string
}

/**
 * TimelineItem - fixed-size variant
 *
 * Ensures each item renders at a consistent height regardless of its content.
 */
export function TimelineItem({ capsule, fixedHeightClass = "md:h-48" }: Props) {
  const createdDate = useMemo(() => (capsule.createdDate ? new Date(capsule.createdDate) : null), [capsule.createdDate])
  const unlockDate = useMemo(() => (capsule.unlockDate ? new Date(capsule.unlockDate) : null), [capsule.unlockDate])
  const now = useMemo(() => new Date(), [])

  const isLocked =
    typeof capsule.isLocked === "boolean"
      ? capsule.isLocked
      : unlockDate
      ? unlockDate > now
      : false

  const daysUntilUnlock = useMemo(() => {
    if (!unlockDate) return null
    const diffMs = unlockDate.getTime() - now.getTime()
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  }, [unlockDate, now])

  const contentTypes = capsule.contentTypes ?? []
  const tags = capsule.tags ?? []

  return (
    <div className="relative pl-8 pb-12 group">
      {/* Timeline Line */}
      <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-border dark:bg-[rgba(98,207,145,0.12)] group-last:hidden" />

      {/* Timeline Dot */}
      <div
        className={`absolute left-0 top-2 w-8 h-8 rounded-full border-4 border-background flex items-center justify-center ${
          isLocked
            ? "bg-primary text-primary-foreground dark:bg-[var(--brand-green)] dark:text-white"
            : "bg-accent text-accent-foreground dark:bg-[var(--brand-green)] dark:text-white"
        }`}
        aria-hidden
      >
        {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
      </div>

      {/* Content Card: fixed height to keep all items equal */}
      <div
        className={`bg-card rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${fixedHeightClass} dark:bg-[#0f0f0f] dark:border-[rgba(98,207,145,0.16)]`}
      >
        <div className="flex flex-col md:flex-row h-full">
          {/* Preview Image: fixed width and full height so it doesn't change the card height */}
          {capsule.previewImage ? (
            <div className="md:w-64 h-40 md:h-full flex-shrink-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 overflow-hidden">
              <img
                src={capsule.previewImage}
                alt={capsule.title ?? "Capsule preview"}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="md:w-64 h-40 md:h-full flex-shrink-0 bg-muted/5 flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-muted-foreground" />
            </div>
          )}

          {/* Content area: flex-1 with min-h-0 so children can truncate/scroll inside fixed height */}
          <div className="flex-1 p-4 md:p-6 min-h-0 flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1 text-balance truncate dark:text-[rgba(255,255,255,0.95)]">{capsule.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground truncate dark:text-[rgba(255,255,255,0.75)]">
                  {createdDate && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">Created {createdDate.toLocaleDateString()}</span>
                    </div>
                  )}
                  {unlockDate && (
                    <div className="flex items-center gap-1.5 font-medium truncate">
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">Opens {unlockDate.toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status badges (kept small so they don't grow card) */}
              <div className="ml-3 flex-shrink-0 flex flex-col items-end gap-2">
                {isLocked && daysUntilUnlock !== null && daysUntilUnlock > 0 && (
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-1 bg-[var(--brand-green)] text-white dark:bg-[var(--brand-green)] dark:text-white"
                  >
                    {daysUntilUnlock}d
                  </Badge>
                )}
                {!isLocked && (
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-1 bg-accent/10 text-accent-foreground border-accent/20 dark:bg-[var(--brand-green)] dark:text-white dark:border-[rgba(98,207,145,0.06)]"
                  >
                    Unlocked
                  </Badge>
                )}
              </div>
            </div>

            {/* Description: allow truncation with line-clamp so it won't expand card */}
            {capsule.description && (
              <p className="text-muted-foreground mt-2 mb-3 line-clamp-3 text-sm overflow-hidden dark:text-[rgba(255,255,255,0.75)]">
                {capsule.description}
              </p>
            )}

            <div className="mt-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {contentTypes.includes("text") && (
                    <div className="p-1.5 rounded-lg bg-muted">
                      <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  )}
                  {contentTypes.includes("image") && (
                    <div className="p-1.5 rounded-lg bg-muted">
                      <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  )}
                  {contentTypes.includes("audio") && (
                    <div className="p-1.5 rounded-lg bg-muted">
                      <Music className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs dark:border-[rgba(98,207,145,0.12)] dark:text-[var(--brand-green)]">
                        {tag}
                      </Badge>
                    ))}
                    {tags.length > 3 && (
                      <Badge variant="outline" className="text-xs dark:text-[var(--brand-green)]">+{tags.length - 3}</Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/capsule/${capsule.id}`}>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    View
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}