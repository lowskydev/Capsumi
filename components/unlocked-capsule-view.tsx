"use client"

import React from "react"
import { ImageIcon, FileText, Music, Calendar, Tag, UserPlus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface UnlockedCapsuleViewProps {
  textContent?: string
  images?: string[]
  audioUrl?: string
  createdDate: Date | string
  unlockDate: Date | string
  tags?: string[]
  // new optional sharing fields
  shared?: boolean
  collaborators?: string[]
  allowContributors?: boolean
}

export function UnlockedCapsuleView({
  textContent,
  images = [],
  audioUrl,
  createdDate,
  unlockDate,
  tags = [],
  shared = false,
  collaborators = [],
  allowContributors = false,
}: UnlockedCapsuleViewProps) {
  const created = new Date(createdDate)
  const unlocked = new Date(unlockDate)

  return (
    <div className="space-y-6">
      {/* Sharing summary (if shared) */}
      {shared && (
        <Card className="p-4 bg-accent/5 border-accent/10">
          <div className="flex items-start gap-3">
            <UserPlus className="w-5 h-5 text-accent-foreground mt-0.5" />
            <div>
              <div className="text-sm text-pink-700 dark:text-[rgba(255,255,255,0.85)]">
                Shared with{" "}
                <strong className="font-medium">
                  {collaborators.length > 0 ? collaborators.join(", ") : "people"}
                </strong>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {allowContributors
                  ? "Contributors were able to add content while the capsule was locked. The capsule is now unlocked and read-only."
                  : "Contributors were not allowed to add content. The capsule is unlocked and read-only."}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Timeline Info */}
      <Card className="p-6 bg-accent/10 border-accent/20">
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent-foreground" />
            <span className="text-muted-foreground">Created:</span>
            <span className="font-medium">{created.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent-foreground" />
            <span className="text-muted-foreground">Unlocked:</span>
            <span className="font-medium">{unlocked.toLocaleDateString()}</span>
          </div>
        </div>
      </Card>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="w-4 h-4 text-muted-foreground" />
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Text Content */}
      {textContent && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">Your Message</h3>
          </div>
          <div className="prose prose-lg max-w-none">
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">
              {textContent}
            </p>
          </div>
        </Card>
      )}

      {/* Images */}
      {images.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">
              Photos ({images.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image, index) => (
              <motion.div
                key={index}
                className="rounded-xl overflow-hidden group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Memory photo ${index + 1}`}
                  className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Audio */}
      {audioUrl && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Music className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">Audio Message</h3>
          </div>
          <audio
            controls
            className="w-full"
            aria-label="Audio message playback"
          >
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </Card>
      )}
    </div>
  )
}