"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Calendar, User, Moon, Sun, LogOut, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useAuth } from "@/components/auth-context"

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { id: "mycapsules", label: "My Capsules", icon: Package, href: "/mycapsules" },
  { id: "timeline", label: "Timeline", icon: Calendar, href: "/timeline" },
  { id: "profile", label: "Profile", icon: User, href: "/profile" },
]

function SidebarContent() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { logout } = useAuth()

  return (
    <div className="flex flex-col h-full">
      <div className="absolute top-6 left-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative rounded-full hover:bg-primary/20 dark:hover:bg-primary/20 transition-all cursor-pointer"
        >
          <Sun className="absolute h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center mb-10 mt-6">
        <Image
          src="/capsumi-logo-color.PNG"
          alt="Capsumi Logo"
          width={120}
          height={50}
          className="object-contain mb-3"
          priority
        />
        <h1 className="text-lg font-bold text-primary text-center">
          Capsumi
        </h1>
      </div>

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
                  ? "bg-primary/10 text-primary border-primary/40 shadow-md"
                  : "bg-primary/5 text-muted-foreground border-transparent hover:bg-primary/10 hover:text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-6 flex flex-col items-center gap-3">
        <p className="text-xs text-center text-muted-foreground">
          💡 Navigate your memory capsules
        </p>

        <Link href="/" className="w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 border-primary/30 text-primary hover:bg-primary/10 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </Link>
      </div>
    </div>
  )
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50 w-full">
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="cursor-pointer">
          <Menu className="h-6 w-6 text-foreground" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Image
            src="/capsumi-logo-color.PNG"
            alt="Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="font-bold text-lg text-primary">Capsumi</span>
        </div>
        
        <div className="w-10" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-background z-[70] lg:hidden border-r shadow-2xl p-6"
            >
              <div className="absolute top-4 right-4">
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="cursor-pointer">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "hidden lg:flex flex-col fixed top-0 left-0 h-screen w-64 p-6 z-40 border-r backdrop-blur-xl shadow-lg transition-colors duration-300",
          "bg-background/95 border-border"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}