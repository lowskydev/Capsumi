import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Camera, Package, Lock, Unlock, Calendar } from "lucide-react"
import Link from "next/link"

// Mock user data
const mockUser = {
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  avatar: "/placeholder.svg?height=120&width=120",
  joinDate: new Date("2023-06-15"),
  stats: {
    totalCapsules: 12,
    lockedCapsules: 8,
    unlockedCapsules: 4,
  },
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container max-w-4xl py-8 px-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
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
                  <AvatarImage src={mockUser.avatar || "/placeholder.svg"} alt={mockUser.name} />
                  <AvatarFallback className="text-3xl">
                    {mockUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-1">{mockUser.name}</h2>
                <p className="text-muted-foreground mb-4">{mockUser.email}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {mockUser.joinDate.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Your Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <Package className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold mb-1">{mockUser.stats.totalCapsules}</div>
                <div className="text-sm text-muted-foreground">Total Capsules</div>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <Lock className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold mb-1">{mockUser.stats.lockedCapsules}</div>
                <div className="text-sm text-muted-foreground">Locked</div>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <Unlock className="w-8 h-8 text-accent-foreground mx-auto mb-2" />
                <div className="text-3xl font-bold mb-1">{mockUser.stats.unlockedCapsules}</div>
                <div className="text-sm text-muted-foreground">Unlocked</div>
              </div>
            </div>
          </Card>

          {/* Account Settings */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Account Settings</h3>
            <form className="space-y-5">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={mockUser.name} className="mt-2" />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={mockUser.email} className="mt-2" />
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
            <h3 className="text-xl font-semibold mb-4 text-destructive">Danger Zone</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Delete Account</div>
                  <div className="text-sm text-muted-foreground">Permanently delete your account and all capsules</div>
                </div>
                <Button variant="destructive" size="sm">
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
