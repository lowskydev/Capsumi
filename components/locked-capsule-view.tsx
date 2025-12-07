"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { Lock, Calendar, Clock, UserPlus, ImageIcon, Music, Tag, Plus, Upload, X as XIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CapsuleStorage, type Capsule } from "@/lib/capsule-storage"
import { useAuth } from "@/components/auth-context"
import Image from "next/image"

/**
 * LockedCapsuleView (audio + removable tags)
 * - Removed video upload support, added audio upload support for contributors
 * - Tags in the contributor panel now render a small X so contributors can remove tags before saving
 */

interface LockedCapsuleViewProps {
  capsule?: Capsule
  unlockDate?: Date | string
  previewImage?: string
  currentUserIdentifier?: string | null
}

export function LockedCapsuleView({
  capsule,
  unlockDate: legacyUnlockDate,
  previewImage: legacyPreview,
  currentUserIdentifier: propCurrentUserIdentifier,
}: LockedCapsuleViewProps) {
  const auth = useAuth()
  const authIdentifier =
    (auth && (auth.user?.email || auth.user?.name || auth.user?.id)) ?? null
  const currentUserIdentifier = propCurrentUserIdentifier ?? authIdentifier

  const unlock = useMemo(() => {
    if (capsule?.unlockDate) return new Date(capsule.unlockDate)
    if (legacyUnlockDate) return new Date(legacyUnlockDate as string)
    return new Date()
  }, [capsule, legacyUnlockDate])

  const previewImage = capsule?.previewImage ?? legacyPreview
  const now = new Date()
  const timeUntilUnlock = Math.max(0, unlock.getTime() - now.getTime())
  const daysUntilUnlock = Math.ceil(timeUntilUnlock / (1000 * 60 * 60 * 24))
  const hoursUntilUnlock = Math.ceil(timeUntilUnlock / (1000 * 60 * 60))

  // contributor UI state
  const [localImages, setLocalImages] = useState<File[]>([])
  const [localImagePreviews, setLocalImagePreviews] = useState<string[]>([])
  const [localAudios, setLocalAudios] = useState<File[]>([])
  const [localAudioPreviews, setLocalAudioPreviews] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [addedTags, setAddedTags] = useState<string[]>(() => capsule?.tags ?? [])
  const [message, setMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [statusText, setStatusText] = useState<string | null>(null)

  // refs for file inputs (so buttons can trigger them)
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const audioInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    return () => {
      localImagePreviews.forEach((u) => URL.revokeObjectURL(u))
      localAudioPreviews.forEach((u) => URL.revokeObjectURL(u))
    }
  }, [localImagePreviews, localAudioPreviews])

  // Reset contributor-local UI when capsule changes to avoid showing stale previews/tags
  useEffect(() => {
    // Revoke any currently created object URLs
    localImagePreviews.forEach((u) => URL.revokeObjectURL(u))
    localAudioPreviews.forEach((u) => URL.revokeObjectURL(u))

    setLocalImages([])
    setLocalImagePreviews([])
    setLocalAudios([])
    setLocalAudioPreviews([])
    setMessage("")
    setIsSaving(false)
    setStatusText(null)
    setAddedTags(capsule?.tags ?? [])
    // Intentionally depend only on capsule id (or capsule reference)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capsule?.id])

  const isShared = !!(capsule && (capsule.shared || (capsule.collaborators && capsule.collaborators.length > 0)))
  const collaborators = capsule?.collaborators ?? []
  
  // Permission Logic
  const collaboratorRecord = collaborators.find(c => 
    typeof c === 'string' ? c === currentUserIdentifier : c.email === currentUserIdentifier
  )
  const isCollaborator = !!collaboratorRecord
  
  // Check permission: explicitly 'editor' OR legacy global 'allowContributors'
  const canContribute = typeof collaboratorRecord === 'object' 
    ? collaboratorRecord.role === 'editor' 
    : !!capsule?.allowContributors

  // select handlers (use refs for robust file picker opening)
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    if (files.length === 0) return
    setLocalImages((s) => [...s, ...files])
    const urls = files.map((f) => URL.createObjectURL(f))
    setLocalImagePreviews((s) => [...s, ...urls])
    if (e.currentTarget) e.currentTarget.value = ""
  }

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    if (files.length === 0) return
    setLocalAudios((s) => [...s, ...files])
    const urls = files.map((f) => URL.createObjectURL(f))
    setLocalAudioPreviews((s) => [...s, ...urls])
    if (e.currentTarget) e.currentTarget.value = ""
  }

  const removeLocalImage = (index: number) => {
    URL.revokeObjectURL(localImagePreviews[index])
    setLocalImages((s) => s.filter((_, i) => i !== index))
    setLocalImagePreviews((s) => s.filter((_, i) => i !== index))
  }

  const removeLocalAudio = (index: number) => {
    URL.revokeObjectURL(localAudioPreviews[index])
    setLocalAudios((s) => s.filter((_, i) => i !== index))
    setLocalAudioPreviews((s) => s.filter((_, i) => i !== index))
  }

  const handleAddTag = () => {
    const t = newTag.trim()
    if (!t) return
    if (!addedTags.includes(t)) {
      setAddedTags((s) => [...s, t])
    }
    setNewTag("")
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setAddedTags((s) => s.filter((t) => t !== tagToRemove))
  }

  const handleSaveContributions = async () => {
    if (!capsule) {
      setStatusText("No capsule context to save to.")
      return
    }

    if (!canContribute) {
      setStatusText("You don't have permission to contribute to this capsule.")
      console.debug("Save blocked: contributorAllowed false")
      return
    }

    setIsSaving(true)
    setStatusText(null)
    console.debug("Saving contributions...", { localImages, localAudios, addedTags, message })

    try {
      // convert files to data urls
      const imageDataUrls: string[] = await Promise.all(
        localImages.map(
          (f) =>
            new Promise<string>((resolve) => {
              const r = new FileReader()
              r.onloadend = () => resolve(r.result as string)
              r.readAsDataURL(f)
            })
        )
      )

      const audioDataUrls: string[] = await Promise.all(
        localAudios.map(
          (f) =>
            new Promise<string>((resolve) => {
              const r = new FileReader()
              r.onloadend = () => resolve(r.result as string)
              r.readAsDataURL(f)
            })
        )
      )

      const updated = {
        ...capsule,
        images: Array.isArray(capsule.images) ? [...capsule.images] : [],
        audios: Array.isArray((capsule as any).audios) ? [...(capsule as any).audios] : [],
        tags: Array.isArray(capsule.tags) ? [...capsule.tags] : [],
        textContent: capsule.textContent ?? "",
      } as any

      if (imageDataUrls.length > 0) updated.images.push(...imageDataUrls)
      if (audioDataUrls.length > 0) updated.audios.push(...audioDataUrls)

      // Append tags (dedupe)
      addedTags.forEach((t) => {
        if (!updated.tags.includes(t)) updated.tags.push(t)
      })

      if (message.trim()) {
        const who = currentUserIdentifier ?? "A collaborator"
        const when = new Date().toLocaleString()
        const contributionNote = `\n\n---\n${who} (${when}):\n${message.trim()}`
        updated.textContent = (updated.textContent || "") + contributionNote
      }

      if (!updated.shared) updated.shared = true

      CapsuleStorage.saveCapsule(updated as any)
      console.debug("Saved capsule to storage", updated.id)

      // clear local inputs
      localImagePreviews.forEach((u) => URL.revokeObjectURL(u))
      localAudioPreviews.forEach((u) => URL.revokeObjectURL(u))
      setLocalImages([])
      setLocalImagePreviews([])
      setLocalAudios([])
      setLocalAudioPreviews([])
      setMessage("")
      setAddedTags([])
      setStatusText("Saved contributions")
    } catch (err) {
      console.error("Failed to save contributions:", err)
      setStatusText("Failed to save contributions. Try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const collaboratorCount = collaborators.length
  const collabNames = collaborators.map(c => typeof c === 'string' ? c : c.email).join(", ")

  return (
    <Card className="p-8 md:p-12 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex justify-center">
          <div className="p-6 rounded-full bg-primary/10" aria-label="Locked capsule icon">
            <Lock className="w-16 h-16 text-primary" aria-hidden="true" />
          </div>
        </div>

        {previewImage && (
          <div className="mb-6 relative h-64 rounded-2xl overflow-hidden">
            <Image
              src={previewImage || "/placeholder.svg"}
              alt="Capsule preview image (locked and blurred)"
              fill
              className="object-cover blur-lg"
              unoptimized={previewImage.startsWith("data:") || previewImage.startsWith("blob:")}
            />
            <div className="absolute inset-0 bg-background/40 flex items-center justify-center z-10">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Preview Hidden
              </Badge>
            </div>
          </div>
        )}

        <h2 className="text-3xl font-bold mb-3 text-balance">This Capsule is Locked</h2>
        <p className="text-muted-foreground text-lg mb-6 text-pretty">
          Your memories are safely preserved and will be revealed when the time comes.
        </p>

        {capsule?.eventDate && (
          <div className="mb-6 flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Event happened on {new Date(capsule.eventDate).toLocaleDateString()}</span>
          </div>
        )}

        {isShared && (
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 text-sm text-pink-700 dark:text-[rgba(255,255,255,0.85)]">
              <UserPlus className="w-4 h-4" />
              <span>
                Shared with{" "}
                <strong className="font-medium" title={collabNames}>
                  {collaboratorCount > 0 ? (collaboratorCount === 1 ? collabNames : `${collaboratorCount} people`) : "people"}
                </strong>
              </span>
            </div>
            {!canContribute && isCollaborator && (
               <div className="text-xs text-muted-foreground mt-1">(You are in View Only mode)</div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="p-6 bg-muted/50" aria-label={`${daysUntilUnlock} days remaining until unlock`}>
            <Calendar className="w-8 h-8 text-primary mx-auto mb-3" aria-hidden="true" />
            <div className="text-3xl font-bold mb-1">{daysUntilUnlock > 0 ? daysUntilUnlock : 0}</div>
            <div className="text-sm text-muted-foreground">Days Until Unlock</div>
          </Card>

          <Card className="p-6 bg-muted/50" aria-label={`${hoursUntilUnlock} hours remaining until unlock`}>
            <Clock className="w-8 h-8 text-primary mx-auto mb-3" aria-hidden="true" />
            <div className="text-3xl font-bold mb-1">{hoursUntilUnlock > 0 ? hoursUntilUnlock : 0}</div>
            <div className="text-sm text-muted-foreground">Hours Until Unlock</div>
          </Card>
        </div>

        <div className="p-6 rounded-xl bg-primary/5 border border-primary/20 mb-6">
          <div className="text-sm text-muted-foreground mb-1">Unlocks on</div>
          <div className="text-2xl font-semibold text-primary">
            {unlock.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {isShared && (
          <div className="mb-6 text-left">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <UserPlus className="w-5 h-5" /> Contributions
            </h3>

            {!canContribute ? (
              <div className="p-4 rounded-lg bg-muted/5 text-sm text-muted-foreground border border-dashed">
                {isCollaborator ? (
                  <div>
                    You are listed as a Viewer. Only Editors can add content to this capsule.
                  </div>
                ) : (
                  <div>You are not a collaborator on this capsule.</div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-lg border bg-white/60 dark:bg-[#0b0b0b]/60">
                {/* Images */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Add images</span>
                  </div>

                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="sr-only"
                    aria-hidden={true}
                    tabIndex={-1}
                  />
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border cursor-pointer"
                  >
                    <Upload className="w-4 h-4" /> Choose images
                  </button>

                  {localImagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {localImagePreviews.map((u, i) => (
                        <div key={i} className="relative rounded-md overflow-hidden h-20">
                          <Image
                            src={u}
                            alt={`preview-${i}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <button
                            onClick={() => removeLocalImage(i)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-white/80 cursor-pointer"
                            aria-label="Remove image"
                          >
                            <XIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Audio */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Music className="w-4 h-4" />
                    <span className="text-sm font-medium">Add audio</span>
                  </div>

                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    multiple
                    onChange={handleAudioSelect}
                    className="sr-only"
                    aria-hidden={true}
                    tabIndex={-1}
                  />
                  <button
                    type="button"
                    onClick={() => audioInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border cursor-pointer"
                  >
                    <Upload className="w-4 h-4" /> Choose audio
                  </button>

                  {localAudioPreviews.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {localAudioPreviews.map((u, i) => (
                        <div key={i} className="relative rounded-md overflow-hidden p-2 bg-muted/5">
                          <audio src={u} controls className="w-full" />
                          <button
                            onClick={() => removeLocalAudio(i)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-white/80 cursor-pointer"
                            aria-label="Remove audio"
                          >
                            <XIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4" />
                    <span className="text-sm font-medium">Add tags</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-md border"
                      placeholder="Enter tag and press Enter"
                    />
                    <button type="button" onClick={handleAddTag} className="px-3 py-2 rounded-md border cursor-pointer">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {addedTags.map((t) => (
                      <div key={t} className="flex items-center gap-1 bg-white/60 dark:bg-[#111]/60 border rounded-full px-2 py-1 text-xs">
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="ml-1 p-0.5 rounded-full hover:bg-muted/20 cursor-pointer"
                          aria-label={`Remove tag ${t}`}
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="mb-3">
                  <label className="text-sm font-medium block mb-1">Message / note</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a short message to add to the capsule"
                    className="w-full px-3 py-2 rounded-md border min-h-[84px]"
                  />
                </div>

                {/* Save */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSaveContributions}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-md bg-[var(--brand-red)] text-white disabled:opacity-60 cursor-pointer"
                  >
                    {isSaving ? "Saving..." : "Save contributions"}
                  </button>
                  {statusText && <div className="text-sm text-muted-foreground">{statusText}</div>}
                </div>
              </div>
            )}
          </div>
        )}

        {!isShared && (
          <div className="text-sm text-muted-foreground mt-4">
            This capsule is private — only the owner can add content.
          </div>
        )}
      </div>
    </Card>
  )
}