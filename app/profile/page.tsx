"use client"

import React, { useRef, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Camera, Package, Lock, Unlock, Calendar } from "lucide-react"
import Link from "next/link"

type User = {
  name: string
  email: string
  avatar?: string
  joinDate: string // ISO
  stats: {
    totalCapsules: number
    lockedCapsules: number
    unlockedCapsules: number
  }
}

// Mock user data
const mockUser: User = {
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  avatar: "/placeholder.svg?height=120&width=120",
  joinDate: new Date("2023-06-15").toISOString(),
  stats: {
    totalCapsules: 12,
    lockedCapsules: 8,
    unlockedCapsules: 4,
  },
}

export default function ProfilePage() {
  const [name, setName] = useState<string>(mockUser.name)
  const [email, setEmail] = useState<string>(mockUser.email)
  const [password, setPassword] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log("Save profile:", { name, email, password })
  }

  function handleAvatarClick() {
    fileInputRef.current?.click()
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    console.log("Selected avatar file:", file)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation (fixed or static depending on your setup) */}
      <Navigation />

      {/* Horizontally centered, scrollable content */}
      <main
        role="main"
        aria-label="Profile settings"
        className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12"
      >
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground text-base md:text-lg">Manage your account and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Overview */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative group">
                <Avatar className="w-28 h-28 md:w-32 md:h-32">
                  <AvatarImage src={mockUser.avatar || "/placeholder.svg"} alt={mockUser.name} />
                  <AvatarFallback className="text-3xl">
                    {mockUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  aria-hidden
                />

                <button
                  type="button"
                  aria-label="Change avatar"
                  onClick={handleAvatarClick}
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="w-5 h-5 md:w-6 md:h-6 text-white" aria-hidden />
                </button>
              </div>

              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-semibold mb-1">{mockUser.name}</h2>
                <p className="text-muted-foreground mb-4">{mockUser.email}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" aria-hidden />
                  <span>
                    Member since{" "}
                    <time dateTime={mockUser.joinDate}>
                      {new Date(mockUser.joinDate).toLocaleDateString()}
                    </time>
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <Card className="p-6">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Your Statistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <Package className="w-7 h-7 md:w-8 md:h-8 text-primary mx-auto mb-2" aria-hidden />
                <div className="text-2xl md:text-3xl font-bold mb-1">{mockUser.stats.totalCapsules}</div>
                <div className="text-sm text-muted-foreground">Total Capsules</div>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <Lock className="w-7 h-7 md:w-8 md:h-8 text-primary mx-auto mb-2" aria-hidden />
                <div className="text-2xl md:text-3xl font-bold mb-1">{mockUser.stats.lockedCapsules}</div>
                <div className="text-sm text-muted-foreground">Locked</div>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <Unlock className="w-7 h-7 md:w-8 md:h-8 text-accent-foreground mx-auto mb-2" aria-hidden />
                <div className="text-2xl md:text-3xl font-bold mb-1">{mockUser.stats.unlockedCapsules}</div>
                <div className="text-sm text-muted-foreground">Unlocked</div>
              </div>
            </div>
          </Card>

          {/* Account Settings */}
          <Card className="p-6">
            <h3 className="text-lg md:text-xl font-semibold mb-6">Account Settings</h3>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-2" />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="password">Change Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit">Save Changes</Button>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-transparent"
                  onClick={() => {
                    setName(mockUser.name)
                    setEmail(mockUser.email)
                    setPassword("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>

          {/* Preferences */}
          <Card className="p-6">
            <h3 className="text-lg md:text-xl font-semibold mb-6">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-muted-foreground">Receive notifications when capsules unlock</div>
                </div>
                <Badge variant="secondary">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Reminder Notifications</div>
                  <div className="text-sm text-muted-foreground">Get reminders before capsules unlock</div>
                </div>
                <Badge variant="secondary">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Public Profile</div>
                  <div className="text-sm text-muted-foreground">Allow others to view your shared capsules</div>
                </div>
                <Badge variant="outline">Disabled</Badge>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-destructive/50">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-destructive">Danger Zone</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Delete Account</div>
                  <div className="text-sm text-muted-foreground">Permanently delete your account and all capsules</div>
                </div>
                <Button variant="destructive" size="sm" onClick={() => console.log("Delete account")}>
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
