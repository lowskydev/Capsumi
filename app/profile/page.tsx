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
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6 bg-gradient-to-br from-pink-50 to-white dark:from-[#0e0e0e] dark:to-[#1a1a1a] transition-colors duration-300 flex items-center justify-center">
          <div className="w-full max-w-4xl py-6 md:py-10">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold mb-2 text-brand-red">Profile Settings</h1>
              <p className="text-muted-foreground text-lg">
                Manage your account and preferences
              </p>
            </div>

            <div className="space-y-8">
              {/* Profile Overview */}
              <Card className="p-6 border-0 shadow-md dark:bg-[#151515]">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="relative group">
                    <Avatar className="w-32 h-32 ring-2 ring-brand-green ring-offset-2">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="text-3xl bg-brand-red/20 text-brand-red">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
              <Card className="p-6 border-0 shadow-md dark:bg-[#151515]">
                <h3 className="text-xl font-semibold mb-6 text-brand-red">Account Settings</h3>
                <form onSubmit={handleSave} className="space-y-5">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 border-border focus:ring-brand-green"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 border-border focus:ring-brand-green"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      className="bg-brand-green hover:bg-brand-red text-white rounded-xl"
                    >
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl border-brand-red text-brand-red hover:bg-brand-red/10"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>

              {/* Preferences */}
              <Card className="p-6 border-0 shadow-md dark:bg-[#151515]">
                <h3 className="text-xl font-semibold mb-6 text-brand-red">Preferences</h3>
                <div className="space-y-4">
                  {[
                    {
                      label: "Email Notifications",
                      desc: "Receive notifications when capsules unlock",
                      value: emailNotifications,
                      toggle: () => setEmailNotifications(!emailNotifications),
                    },
                    {
                      label: "Reminder Notifications",
                      desc: "Get reminders before capsules unlock",
                      value: reminderNotifications,
                      toggle: () => setReminderNotifications(!reminderNotifications),
                    },
                    {
                      label: "Public Profile",
                      desc: "Allow others to view your shared capsules",
                      value: publicProfile,
                      toggle: () => setPublicProfile(!publicProfile),
                    },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={item.toggle}
                      className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:bg-brand-green/5 transition-colors text-left"
                    >
                      <div>
                        <div className="font-medium text-foreground">{item.label}</div>
                        <div className="text-sm text-muted-foreground">{item.desc}</div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          item.value
                            ? "bg-brand-green text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {item.value ? "Enabled" : "Disabled"}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Log Out */}
              <Card className="p-6 border-0 shadow-md dark:bg-[#151515]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">Sign Out</div>
                    <div className="text-sm text-muted-foreground">Log out of your account</div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="gap-2 rounded-xl border-brand-red text-brand-red hover:bg-brand-red/10"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </Button>
                </div>
              </Card>

              {/* Danger Zone */}
              <Card className="p-6 border border-brand-red/30 bg-brand-red/5 shadow-md rounded-2xl">
                <h3 className="text-xl font-semibold mb-4 text-brand-red">Danger Zone</h3>
                <div className="flex items-center justify-between p-4 rounded-lg border border-brand-red/20 bg-background">
                  <div>
                    <div className="font-medium text-foreground">Delete Account</div>
                    <div className="text-sm text-muted-foreground">
                      Permanently delete your account and all capsules
                    </div>
                  </div>
                  <Button variant="destructive" size="sm" className="bg-brand-red hover:bg-brand-green">
                    Delete
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}