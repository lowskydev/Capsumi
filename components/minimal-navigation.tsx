"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function MinimalNavigation() {
    const { theme, setTheme } = useTheme()

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-700/40 bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
            <div className="flex h-16 items-center justify-end px-4">
                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="relative rounded-full hover:bg-gray-700/40 transition-all"
                >
                    {/* Sun icon for light mode */}
                    <Sun className="h-5 w-5 transition-all duration-300 ease-in-out text-yellow-400 dark:text-yellow-500 
                        rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
                    {/* Moon icon for dark mode */}
                    <Moon className="absolute h-5 w-5 transition-all duration-300 ease-in-out text-gray-200 
                        rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>
        </nav>
    )
}
