"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { CapsuleStorage } from "@/lib/capsule-storage"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  joinDate: Date
  stats: {
    totalCapsules: number
    lockedCapsules: number
    unlockedCapsules: number
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  updateUser: (updates: Partial<User>) => Promise<void>
  refreshStats: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'capsumi_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Function to get current stats from capsules
  const getCurrentStats = () => {
    return CapsuleStorage.getStats()
  }

  // Function to refresh user stats
  const refreshStats = () => {
    if (!user) return
    
    const stats = getCurrentStats()
    const updatedUser = { ...user, stats }
    setUser(updatedUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser))
  }

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const userData = JSON.parse(stored)
          // Convert joinDate string back to Date
          userData.joinDate = new Date(userData.joinDate)
          
          // Always get fresh stats from capsules
          userData.stats = getCurrentStats()
          
          setUser(userData)
        }
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [])

  // Listen for capsule changes and update stats automatically
  useEffect(() => {
    const handleCapsulesUpdate = () => {
      refreshStats()
    }

    window.addEventListener('capsulesUpdated', handleCapsulesUpdate)
    return () => window.removeEventListener('capsulesUpdated', handleCapsulesUpdate)
  }, [user])

  // Listen for storage changes across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        if (e.newValue) {
          const userData = JSON.parse(e.newValue)
          userData.joinDate = new Date(userData.joinDate)
          userData.stats = getCurrentStats()
          setUser(userData)
        } else {
          setUser(null)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // Get real stats from stored capsules
    const stats = getCurrentStats()
    
    const userData: User = {
      id: "1",
      name: "Alex Morgan",
      email,
      avatar: "/diverse-user-avatars.png",
      joinDate: new Date(),
      stats,
    }
    
    setUser(userData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
  }

  const register = async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    const userData: User = {
      id: "1",
      name,
      email,
      avatar: "/diverse-user-avatars.png",
      joinDate: new Date(),
      stats: {
        totalCapsules: 0,
        lockedCapsules: 0,
        unlockedCapsules: 0,
      }
    }
    
    setUser(userData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
  }

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return
    
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
        refreshStats,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}