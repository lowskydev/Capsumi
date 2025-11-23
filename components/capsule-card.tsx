"use client"

import { Calendar, Lock, Unlock, ImageIcon, FileText, Music, Trash2, UserPlus, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

interface CapsuleCardProps {
  id: string
  title: string
  unlockDate: Date
  createdDate: Date
  eventDate?: Date
  isLocked: boolean
  previewImage?: string
  contentTypes: readonly ("text" | "image" | "audio")[]
  tags?: string[]
  // optional sharing fields (new)
  shared?: boolean
  collaborators?: string[]
  allowContributors?: boolean
  onDelete?: (id: string) => void
}

export function CapsuleCard({
  id,
  title,
  unlockDate,
  createdDate,
  eventDate,
  isLocked,
  previewImage,
  contentTypes = [],
  tags = [],
  shared = false,
  collaborators = [],
  allowContributors = false,
  onDelete,
}: CapsuleCardProps) {
  const daysUntilUnlock = Math.ceil((unlockDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const brandRed = "#f38283"
  const brandGreen = "#62cf91"

  return (
    <Link href={`/capsule/${id}`} className="relative block">
      {/* Note: to keep the exact content positions you had (preview image on top,
        overlays, then content block), we only enforce a fixed height on the Card root
        and make the card a column flex so the image remains at the top and the content
        area is constrained to the remaining space. Content that overflows will be hidden
        / truncated so all cards have the same dimensions without reordering elements.
      */}
      <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer rounded-2xl border border-pink-200 dark:border-[rgba(243,130,131,0.3)] bg-gradient-to-br from-pink-50 to-white dark:from-[#0e0e0e] dark:to-[#1a1a1a] p-0 flex flex-col h-120">
        {/* Delete Button */}
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDelete(id)
            }}
            className="absolute top-2 right-2 z-10 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-80 hover:opacity-100 transition cursor-pointer"
            aria-label="Delete capsule"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Preview Image (kept at the top, fixed height) */}
        <div className="relative w-full h-48 flex-shrink-0">
          {previewImage ? (
            <Image
              src={previewImage}
              alt={title}
              fill
              className="object-cover"
              unoptimized={previewImage.startsWith("data:") || previewImage.startsWith("blob:")}
            />
          ) : (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
              <div className="text-6xl opacity-20">📦</div>
            </div>
          )}

          {/* Shared / Collaborators Overlay */}
          {shared && (
            <div className="absolute top-3 left-3 z-10">
              <div
                className="p-2 rounded-full backdrop-blur-sm bg-[rgba(255,255,255,0.85)] dark:bg-[rgba(10,10,10,0.6)] text-pink-600 dark:text-[var(--brand-green)] flex items-center gap-1"
                title={collaborators.length > 0 ? `Shared with ${collaborators.join(", ")}` : "Shared"}
              >
                <UserPlus className="w-4 h-4" />
                {collaborators.length > 0 && (
                  <span className="text-xs font-medium hidden sm:inline-block">{collaborators.length}</span>
                )}
              </div>
            </div>
          )}

          {/* Lock Status Overlay */}
          <div className="absolute top-3 right-3 z-10">
            <div
              className={`p-2 rounded-full backdrop-blur-sm ${
                isLocked
                  ? "bg-blue-100/90 text-blue-700 dark:bg-[rgba(243,130,131,0.15)] dark:text-[var(--brand-red)]"
                  : "bg-green-100/90 text-green-700 dark:bg-[rgba(98,207,145,0.15)] dark:text-[var(--brand-green)]"
              }`}
            >
              {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </div>
          </div>

          {/* Days Until Unlock */}
          {isLocked && daysUntilUnlock > 0 && (
            <div className="absolute bottom-3 left-3 z-10">
              <Badge
                variant="secondary"
                className="backdrop-blur-sm bg-white/80 dark:bg-[#1a1a1a]/80 border border-gray-200 dark:border-[rgba(243,130,131,0.3)] text-sm font-medium"
                style={
                  {
                    color: isLocked ? brandRed : brandGreen,
                  } as React.CSSProperties
                }
              >
                {daysUntilUnlock} days left
              </Badge>
            </div>
          )}
        </div>

        {/* Card Content */}
        {/* make this the flex-1 area and hide overflow so card height remains fixed */}
        <div className="p-5 flex-1 overflow-hidden">
          <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white line-clamp-2 group-hover:text-[var(--brand-red)] transition-colors">
            {title}
          </h3>

          {/* Dates */}
          <div className="space-y-1 mb-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Created {createdDate.toLocaleDateString()}</span>
            </div>
            {eventDate && (
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Event {eventDate.toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span className="font-medium">Opens {unlockDate.toLocaleDateString()}</span>
            </div>
          </div>

          {/* Content Type Icons */}
          <div className="flex items-center gap-2 mb-3">
            {contentTypes.includes("text") && (
              <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                <FileText className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
              </div>
            )}
            {contentTypes.includes("image") && (
              <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                <ImageIcon className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
              </div>
            )}
            {contentTypes.includes("audio") && (
              <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                <Music className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
              </div>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}

export default CapsuleCard