"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Camera, Package, Lock, Unlock, Calendar, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-context"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth()
  const router = useRouter()
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [reminderNotifications, setReminderNotifications] = useState(true)
  const [publicProfile, setPublicProfile] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateUser({ name, email })
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container max-w-4xl py-8 px-6 items-center mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground text-lg">Manage your account and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Overview */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="relative group">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-1">{user.name}</h2>
                <p className="text-muted-foreground mb-4">{user.email}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {user.joinDate.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Your Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Capsules */}
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                <Package className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold mb-1 text-primary">{user.stats.totalCapsules}</div>
                <div className="text-sm font-medium text-foreground/70">Total Capsules</div>
              </div>

              {/* Locked */}
              <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20 text-center">
                <Lock className="w-8 h-8 text-secondary mx-auto mb-2" />
                <div className="text-3xl font-bold mb-1 text-secondary">{user.stats.lockedCapsules}</div>
                <div className="text-sm font-medium text-foreground/70">Locked</div>
              </div>

              {/* Unlocked */}
              <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-center">
                <Unlock className="w-8 h-8 text-accent-foreground mx-auto mb-2" />
                <div className="text-3xl font-bold mb-1 text-accent-foreground">{user.stats.unlockedCapsules}</div>
                <div className="text-sm font-medium text-foreground/70">Unlocked</div>
              </div>
            </div>
          </Card>

          {/* Account Settings */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Account Settings</h3>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2"
                />
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
                <Input id="password" type="password" placeholder="Enter new password" className="mt-2" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit">Save Changes</Button>
                <Button type="button" variant="outline" className="bg-transparent">
                  Cancel
                </Button>
              </div>
            </form>
          </Card>

          {/* Preferences */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Preferences</h3>
            <div className="space-y-4">
              {/* Email Notifications Toggle */}
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors text-left"
              >
                <div>
                  <div className="font-medium text-foreground">Email Notifications</div>
                  <div className="text-sm text-muted-foreground">Receive notifications when capsules unlock</div>
                </div>
                <div className={`
                  px-3 py-1 rounded-full text-xs font-semibold transition-colors
                  ${emailNotifications
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-muted text-muted-foreground'}
                `}>
                  {emailNotifications ? 'Enabled' : 'Disabled'}
                </div>
              </button>

              {/* Reminder Notifications Toggle */}
              <button
                onClick={() => setReminderNotifications(!reminderNotifications)}
                className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors text-left"
              >
                <div>
                  <div className="font-medium text-foreground">Reminder Notifications</div>
                  <div className="text-sm text-muted-foreground">Get reminders before capsules unlock</div>
                </div>
                <div className={`
                  px-3 py-1 rounded-full text-xs font-semibold transition-colors
                  ${reminderNotifications
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-muted text-muted-foreground'}
                `}>
                  {reminderNotifications ? 'Enabled' : 'Disabled'}
                </div>
              </button>

              {/* Public Profile Toggle */}
              <button
                onClick={() => setPublicProfile(!publicProfile)}
                className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors text-left"
              >
                <div>
                  <div className="font-medium text-foreground">Public Profile</div>
                  <div className="text-sm text-muted-foreground">Allow others to view your shared capsules</div>
                </div>
                <div className={`
                  px-3 py-1 rounded-full text-xs font-semibold transition-colors
                  ${publicProfile
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-muted text-muted-foreground'}
                `}>
                  {publicProfile ? 'Enabled' : 'Disabled'}
                </div>
              </button>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-destructive/30 bg-destructive/5">
            <h3 className="text-xl font-semibold mb-4 text-destructive">Danger Zone</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-background">
                <div>
                  <div className="font-medium text-foreground">Delete Account</div>
                  <div className="text-sm text-muted-foreground">Permanently delete your account and all capsules</div>
                </div>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </div>
          </Card>

          {/* Log Out */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">Sign Out</div>
                <div className="text-sm text-muted-foreground">Log out of your account</div>
              </div>
              <Button variant="outline" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Log Out
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}