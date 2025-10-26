"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Moon, Sun, Search, Plus, User, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavigationProps {
  searchQuery?: string
  setSearchQuery?: (value: string) => void
}

export function Navigation({ searchQuery, setSearchQuery }: NavigationProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 relative">
        {/* Site Title */}
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <span className="text-xl font-semibold text-pink-700">Capsumi</span>
        </Link>

        {/* Centered Search */}
        {user && (
          <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-md md:flex hidden">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pink-700/70" />
              <Input
                type="search"
                placeholder="Search capsules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery?.(e.target.value)}
                className="pl-10 rounded-2xl border border-pink-500/40 shadow-sm focus:ring-2 focus:ring-pink-500 w-full"
              />
            </div>
          </div>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {user ? (
            <>
              {/* Create Capsule */}
              <Button asChild className="rounded-2xl gap-2 bg-pink-300/30 text-pink-700 hover:bg-pink-400/40 shadow-md transition-all">
                <Link href="/create">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Create Capsule</span>
                </Link>
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full hover:bg-pink-300/20 transition-all"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-300/20 transition-all">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" /> Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full hover:bg-pink-300/20 transition-all"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              <Button variant="outline" asChild className="rounded-2xl">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild className="rounded-2xl bg-pink-300 text-white hover:bg-pink-400">
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
