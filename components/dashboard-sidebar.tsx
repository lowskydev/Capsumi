"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Calendar, User } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { id: "mycapsules", label: "My Capsules", icon: Package, href: "/mycapsules" },
  { id: "timeline", label: "Timeline", icon: Calendar, href: "/timeline" },
  { id: "profile", label: "Profile", icon: User, href: "/profile" },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-64 p-6
                       bg-pink-50/40 backdrop-blur-xl border-r border-pink-500/50
                       shadow-lg z-40">
      
      {/* Logo and Main Title */}
      <div className="mb-8 flex flex-col items-center">
        <Image 
          src="/capsumi-logo-color.PNG" 
          alt="Capsumi Logo" 
          width={100} 
          height={40} 
          className="object-contain mb-2" 
        />
        <h1 className="text-lg font-bold text-pink-700 text-center">Capsumi</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
                          (item.href === "/dashboard" && pathname === "/")
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all backdrop-blur-lg border",
                isActive
                  ? "bg-pink-100/40 text-pink-800 border-pink-500/40 shadow-md"
                  : "bg-pink-50/20 text-pink-700/85 border-pink-500/30 hover:bg-pink-100/30 hover:text-pink-800"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Help Text */}
      <div className="mt-auto pt-6">
        <p className="text-xs text-center text-pink-600/70">
          💡 Navigate your memory capsules
        </p>
      </div>
    </aside>
  )
}
