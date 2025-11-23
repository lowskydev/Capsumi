"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Calendar, LogOut } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

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

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <DashboardSidebar />

      <main className="flex-1 w-full p-6 lg:ml-64 transition-all duration-300 flex items-center justify-center">
        <div className="w-full max-w-4xl py-6 md:py-10">
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-2 text-primary">Profile Settings</h1>
            <p className="text-muted-foreground text-lg">Manage your account and preferences</p>
          </div>

          <div className="space-y-8">
            {/* Profile Overview */}
            <Card className="p-6 border-0 shadow-md bg-card">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="relative group">
                  <Avatar className="w-32 h-32 ring-2 ring-secondary ring-offset-2">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-3xl bg-primary/20 text-primary">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                </div>

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

            {/* Account Settings */}
            <Card className="p-6 border-0 shadow-md bg-card">
              <h3 className="text-xl font-semibold mb-6 text-primary">Account Settings</h3>
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
                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground rounded-xl cursor-pointer">
                    Save Changes
                  </Button>
                  <Button type="button" variant="outline" className="rounded-xl border-primary text-primary hover:bg-primary/10 cursor-pointer">
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>

            {/* Preferences */}
            <Card className="p-6 border-0 shadow-md bg-card">
              <h3 className="text-xl font-semibold mb-6 text-primary">Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: "Email Notifications", desc: "Receive notifications when capsules unlock", value: emailNotifications, toggle: () => setEmailNotifications(!emailNotifications) },
                  { label: "Reminder Notifications", desc: "Get reminders before capsules unlock", value: reminderNotifications, toggle: () => setReminderNotifications(!reminderNotifications) },
                  { label: "Public Profile", desc: "Allow others to view your shared capsules", value: publicProfile, toggle: () => setPublicProfile(!publicProfile) },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.toggle}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:bg-secondary/5 transition-colors text-left cursor-pointer"
                  >
                    <div>
                      <div className="font-medium text-foreground">{item.label}</div>
                      <div className="text-sm text-muted-foreground">{item.desc}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${item.value ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {item.value ? "Enabled" : "Disabled"}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Log Out */}
            <Card className="p-6 border-0 shadow-md bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">Sign Out</div>
                  <div className="text-sm text-muted-foreground">Log out of your account</div>
                </div>
                <Button variant="outline" onClick={handleLogout} className="gap-2 rounded-xl border-primary text-primary hover:bg-primary/10 cursor-pointer">
                  <LogOut className="w-4 h-4" />
                  Log Out
                </Button>
              </div>
            </Card>

            {/* Danger Zone */}
            <Card className="p-6 border border-primary/30 bg-primary/5 shadow-md rounded-2xl">
              <h3 className="text-xl font-semibold mb-4 text-primary">Danger Zone</h3>
              <div className="flex items-center justify-between p-4 rounded-lg border border-primary/20 bg-background">
                <div>
                  <div className="font-medium text-foreground">Delete Account</div>
                  <div className="text-sm text-muted-foreground">Permanently delete your account and all capsules</div>
                </div>
                <Button variant="destructive" size="sm" className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer">
                  Delete
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}