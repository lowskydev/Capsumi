"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Upload, X, ImageIcon, FileText, Music, Plus, CheckCircle, UserPlus, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CapsuleStorage, type Capsule } from "@/lib/capsule-storage"
import { useAuth } from "@/components/auth-context"
import { DatePicker } from "@/components/date-picker"

export function CreateCapsuleForm() {
  const router = useRouter()
  const { refreshStats } = useAuth()
  
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [unlockDate, setUnlockDate] = useState<Date | undefined>(undefined)
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined)
  const [textContent, setTextContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [audio, setAudio] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [unlockImmediately, setUnlockImmediately] = useState(false)

  // Sharing / collaborators state
  const [sharedWith, setSharedWith] = useState<string[]>([])
  const [currentShare, setCurrentShare] = useState("")
  const [allowContributors, setAllowContributors] = useState(false)

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleAddShare = () => {
    const trimmed = currentShare.trim()
    if (!trimmed) return
    if (!sharedWith.includes(trimmed)) {
      setSharedWith([...sharedWith, trimmed])
      setCurrentShare("")
    }
  }

  const handleRemoveShare = (shareToRemove: string) => {
    setSharedWith(sharedWith.filter((s) => s !== shareToRemove))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setImages([...images, ...newFiles])
      
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file))
      setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls])
    }
  }

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudio(e.target.files[0])
    }
  }

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(imagePreviewUrls[index])
    
    setImages(images.filter((_, i) => i !== index))
    setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!unlockDate && !unlockImmediately) {
      alert("Please select an unlock date")
      return
    }
    
    setIsSubmitting(true)

    try {
      const contentTypes: ("text" | "image" | "audio")[] = []
      if (textContent) contentTypes.push("text")
      if (images.length > 0) contentTypes.push("image")
      if (audio) contentTypes.push("audio")

      const imageUrls = await Promise.all(
        images.map(img => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.readAsDataURL(img)
          })
        })
      )

      let audioUrl: string | undefined
      if (audio) {
        audioUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(audio)
        })
      }

      const isLocked = unlockImmediately ? false : (unlockDate && unlockDate > new Date())

      const newCapsule: Capsule & {
        shared?: boolean
        collaborators?: string[]
        allowContributors?: boolean
      } = {
        id: `capsule_${Date.now()}`,
        title,
        description: description || undefined,
        unlockDate: unlockImmediately ? new Date() : unlockDate!,
        createdDate: new Date(),
        eventDate: eventDate || undefined,
        isLocked: !!isLocked,
        previewImage: imageUrls[0] || undefined,
        textContent: textContent || undefined,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        audioUrl,
        contentTypes: contentTypes as readonly ("text" | "image" | "audio")[],
        tags: tags.length > 0 ? tags : undefined,
        shared: sharedWith.length > 0,
        collaborators: sharedWith.length > 0 ? sharedWith : undefined,
        allowContributors: sharedWith.length > 0 ? allowContributors : undefined,
      }

      CapsuleStorage.saveCapsule(newCapsule)
      refreshStats()
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url))
      router.push(`/capsule/${newCapsule.id}`)
    } catch (error) {
      console.error("Error creating capsule:", error)
      alert("Failed to create capsule. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          Basic Information
        </h2>

        <div className="space-y-5">
          <div>
            <Label htmlFor="title" className="text-base">
              Capsule Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your capsule a memorable name"
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-base">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this capsule about?"
              rows={3}
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Unlock Date *
              </Label>
              <div className="mt-2">
                <DatePicker
                  date={unlockDate}
                  onDateChange={setUnlockDate}
                  placeholder="When should this open?"
                  minDate={new Date()} // Prevents picking past dates for unlock
                  disabled={unlockImmediately}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1.5">
                The date when this capsule becomes available
              </p>
            </div>

            <div>
              <Label className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Event Happened Date
              </Label>
              <div className="mt-2">
                <DatePicker
                  date={eventDate}
                  onDateChange={setEventDate}
                  placeholder="When did this memory happen?"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1.5">
                Optional: The actual date of the memory/event
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-accent/5">
            <input
              type="checkbox"
              id="unlockImmediately"
              checked={unlockImmediately}
              onChange={(e) => setUnlockImmediately(e.target.checked)}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-2 focus:ring-primary cursor-pointer"
            />
            <Label htmlFor="unlockImmediately" className="text-sm cursor-pointer">
              <span className="font-medium">Unlock immediately</span>
              <span className="block text-muted-foreground mt-0.5">
                Create this capsule in an unlocked state (bypass the unlock date)
              </span>
            </Label>
          </div>

          {/* Tags Section */}
          <div>
            <Label htmlFor="tags" className="text-base">
              Tags
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                placeholder="Add tags (press Enter)"
              />
              <Button type="button" onClick={handleAddTag} variant="outline" className="gap-2 bg-transparent cursor-pointer">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1.5 pr-1.5">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-background/50 rounded-full p-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Sharing & Permissions */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-primary" />
          Sharing & Permissions
        </h2>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Share this capsule with people. Those people will be able to add images/photos to the capsule.
          </p>

          <div className="flex gap-2 items-start">
            <div className="flex-1 min-w-0">
              <Label className="text-sm">Add people (email or username)</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={currentShare}
                  onChange={(e) => setCurrentShare(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddShare()
                    }
                  }}
                  placeholder="e.g. alice@example.com or @alice"
                />
                <Button type="button" onClick={handleAddShare} variant="outline" className="cursor-pointer">
                  Add
                </Button>
              </div>

              {sharedWith.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {sharedWith.map((s) => (
                    <Badge key={s} variant="secondary" className="gap-1.5 pr-1.5">
                      {s}
                      <button
                        type="button"
                        onClick={() => handleRemoveShare(s)}
                        className="hover:bg-background/50 rounded-full p-0.5 cursor-pointer"
                        aria-label={`Remove ${s}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="w-56">
              <Label className="text-sm">Permissions</Label>
              <div className="mt-2 flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="permission"
                    checked={!allowContributors}
                    onChange={() => setAllowContributors(false)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm">View only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="permission"
                    checked={allowContributors}
                    onChange={() => setAllowContributors(true)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm">Add people (can contribute)</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Text Content */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          Text Content
        </h2>

        <div>
          <Label htmlFor="textContent" className="text-base">
            Your Message
          </Label>
          <Textarea
            id="textContent"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Write a letter to your future self, document memories, or share your thoughts..."
            rows={8}
            className="mt-2"
          />
          <p className="text-sm text-muted-foreground mt-1.5">
            This message will be preserved and revealed when the capsule unlocks
          </p>
        </div>
      </Card>

      {/* Image Upload */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-primary" />
          Images
        </h2>

        <div>
          <Label htmlFor="images" className="text-base">
            Upload Photos
          </Label>
          <div className="mt-2">
            <label
              htmlFor="images"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">Click to upload images</span>
              <span className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</span>
            </label>
            <input id="images" type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
          </div>

          {imagePreviewUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="relative group w-full h-32">
                  <Image
                    src={url}
                    alt={`Upload ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Audio Upload */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Music className="w-6 h-6 text-primary" />
          Audio
        </h2>

        <div>
          <Label htmlFor="audio" className="text-base">
            Upload Audio Message
          </Label>
          <div className="mt-2">
            <label
              htmlFor="audio"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">Click to upload audio</span>
              <span className="text-xs text-muted-foreground mt-1">MP3, WAV up to 50MB</span>
            </label>
            <input id="audio" type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" />
          </div>

          {audio && (
            <div className="mt-4 p-4 bg-muted rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{audio.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setAudio(null)}
                className="p-1.5 hover:bg-background rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Submit Buttons */}
      <div className="flex gap-4 justify-end">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push("/dashboard")} 
          size="lg"
          disabled={isSubmitting}
          className="cursor-pointer"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          size="lg" 
          className="gap-2 cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Creating...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Create Capsule
            </>
          )}
        </Button>
      </div>
    </form>
  )
}