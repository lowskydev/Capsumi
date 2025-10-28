"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Calendar, User, Moon, Sun, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { id: "mycapsules", label: "My Capsules", icon: Package, href: "/mycapsules" },
  { id: "timeline", label: "Timeline", icon: Calendar, href: "/timeline" },
  { id: "profile", label: "Profile", icon: User, href: "/profile" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const brandRed = "#f38283"
  const brandGreen = "#62cf91"

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...")
    // e.g., auth.logout() or router.push("/login")
  }

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col fixed top-0 left-0 h-screen w-64 p-6 z-40 border-r backdrop-blur-xl shadow-lg transition-colors duration-300",
        "bg-pink-50/40 border-pink-300 text-pink-700",
        "dark:bg-[#121212]/90 dark:border-[rgba(243,130,131,0.4)] dark:text-[rgba(255,255,255,0.9)]"
      )}
    >
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative rounded-full hover:bg-pink-300/20 dark:hover:bg-[rgba(243,130,131,0.2)] transition-all"
        >
          <Sun className="absolute h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      {/* Logo */}
      <div className="flex flex-col items-center justify-center mb-10 mt-6">
        <Image
          src="/capsumi-logo-color.PNG"
          alt="Capsumi Logo"
          width={120}
          height={50}
          className="object-contain mb-3"
          priority
        />
        <h1 className="text-lg font-bold text-pink-700 dark:text-[var(--brand-red)] text-center">
          Capsumi
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href ||
            (item.href === "/dashboard" && pathname === "/")

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all backdrop-blur-lg border",
                isActive
                  ? "bg-pink-100/40 text-pink-800 border-pink-500/40 shadow-md dark:bg-[rgba(243,130,131,0.15)] dark:text-[var(--brand-green)] dark:border-[rgba(98,207,145,0.5)]"
                  : "bg-pink-50/20 text-pink-700/85 border-pink-500/30 hover:bg-pink-100/30 hover:text-pink-800 dark:bg-[rgba(255,255,255,0.05)] dark:text-[rgba(255,255,255,0.8)] dark:border-[rgba(243,130,131,0.2)] dark:hover:bg-[rgba(243,130,131,0.15)] dark:hover:text-[var(--brand-green)]"
              )}
              style={
                {
                  "--brand-red": brandRed,
                  "--brand-green": brandGreen,
                } as React.CSSProperties
              }
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Help Text and Logout */}
      <div className="mt-auto pt-6 flex flex-col items-center gap-3">
        <p className="text-xs text-center text-pink-600/70 dark:text-[rgba(243,130,131,0.6)]">
          💡 Navigate your memory capsules
        </p>

        {/* Logout Button */}
        <Link href="/" className="w-full">
          <Button
            variant="outline"
            size="sm"
            className="flex w-full items-center justify-center gap-2 border-pink-300 text-pink-700 hover:bg-pink-100 dark:border-[rgba(243,130,131,0.3)] dark:text-[var(--brand-green)] dark:hover:bg-[rgba(243,130,131,0.15)]"
            style={{
              "--brand-red": brandRed,
              "--brand-green": brandGreen,
            } as React.CSSProperties}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </Link>
      </div>


    </aside>
  )
}
