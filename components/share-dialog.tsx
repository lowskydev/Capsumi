"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Share2, Copy, Mail, LinkIcon, Check } from "lucide-react"

interface ShareDialogProps {
  capsuleId: string
  capsuleTitle: string
}

export function ShareDialog({ capsuleId, capsuleTitle }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/capsule/${capsuleId}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Check out my time capsule: ${capsuleTitle}`)
    const body = encodeURIComponent(`I'd like to share my time capsule with you!\n\n${shareUrl}`)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="bg-transparent">
          <Share2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Capsule</DialogTitle>
          <DialogDescription>Share this time capsule with friends and family</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Share Link */}
          <div>
            <Label htmlFor="share-link" className="text-sm font-medium mb-2 block">
              Share Link
            </Label>
            <div className="flex gap-2">
              <Input id="share-link" value={shareUrl} readOnly className="flex-1" />
              <Button onClick={handleCopy} size="icon" variant="outline" className="bg-transparent flex-shrink-0">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Share Options */}
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleCopy} variant="outline" className="gap-2 bg-transparent">
              <LinkIcon className="w-4 h-4" />
              Copy Link
            </Button>
            <Button onClick={handleEmailShare} variant="outline" className="gap-2 bg-transparent">
              <Mail className="w-4 h-4" />
              Email
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Recipients will be able to view this capsule when it unlocks
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
