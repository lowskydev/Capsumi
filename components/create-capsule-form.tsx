"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Upload, X, ImageIcon, FileText, Music, Plus } from "lucide-react"

import { saveCapsule, Capsule } from "@/components/utils/storage"

export function CreateCapsuleForm() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [unlockDate, setUnlockDate] = useState("")
  const [textContent, setTextContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [audio, setAudio] = useState<File | null>(null)
  const [isLocked, setIsLocked] = useState(true) // NEW: state for locked/unlocked

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)])
    }
  }

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudio(e.target.files[0])
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newCapsule: Capsule = {
      id: Date.now().toString(),
      title,
      description,
      unlockDate: new Date(unlockDate),
      createdDate: new Date(),
      isLocked: isLocked, // NEW: use checkbox value
      previewImage: images[0] ? URL.createObjectURL(images[0]) : "/placeholder.svg",
      textContent,
      images: images.map((file) => URL.createObjectURL(file)),
      audioUrl: audio ? URL.createObjectURL(audio) : "",
      tags,
      contentTypes: [
        textContent ? "text" : null,
        images.length ? "image" : null,
        audio ? "audio" : null,
      ].filter(Boolean) as ("text" | "image" | "audio")[],
    }

    saveCapsule(newCapsule)
    router.push("/dashboard")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          Basic Information
        </h2>

        <div className="space-y-5">
          <div>
            <Label htmlFor="title" className="text-base">Capsule Title *</Label>
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
            <Label htmlFor="description" className="text-base">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this capsule about?"
              rows={3}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="unlockDate" className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Unlock Date *
            </Label>
            <Input
              id="unlockDate"
              type="date"
              value={unlockDate}
              onChange={(e) => setUnlockDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1.5">
              Choose when this capsule will be unlocked and revealed
            </p>
          </div>

          {/* Locked/Unlocked Toggle */}
          <div className="flex items-center gap-2 mt-2">
            <input
              id="isLocked"
              type="checkbox"
              checked={isLocked}
              onChange={(e) => setIsLocked(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            <Label htmlFor="isLocked" className="text-base cursor-pointer">
              Locked? (unchecked = immediately unlocked)
            </Label>
          </div>

          <div>
            <Label htmlFor="tags" className="text-base">Tags</Label>
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
              <Button type="button" onClick={handleAddTag} variant="outline" className="gap-2 bg-transparent">
                <Plus className="w-4 h-4" /> Add
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
                      className="hover:bg-background/50 rounded-full p-0.5"
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

      {/* Text Content */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          Text Content
        </h2>

        <div>
          <Label htmlFor="textContent" className="text-base">Your Message</Label>
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
          <Label htmlFor="images" className="text-base">Upload Photos</Label>
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

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
          <Label htmlFor="audio" className="text-base">Upload Audio Message</Label>
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
                className="p-1.5 hover:bg-background rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Submit Buttons */}
      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard")} size="lg">
          Cancel
        </Button>
        <Button type="submit" size="lg" className="gap-2">
          <Plus className="w-5 h-5" /> Create Capsule
        </Button>
      </div>
    </form>
  )
}
