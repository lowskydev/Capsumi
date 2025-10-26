"use client"

export interface Capsule {
  id: string
  title: string
  description?: string
  unlockDate: Date
  createdDate: Date
  isLocked: boolean
  previewImage?: string
  textContent?: string
  images?: string[]
  audioUrl?: string
  contentTypes: readonly ("text" | "image" | "audio")[]
  tags?: string[]
}

const CAPSULES_KEY = 'capsumi_capsules'

export class CapsuleStorage {
  static getAllCapsules(): Capsule[] {
    try {
      const stored = localStorage.getItem(CAPSULES_KEY)
      if (!stored) return []
      
      const capsules = JSON.parse(stored)
      // Convert date strings back to Date objects
      return capsules.map((c: any) => ({
        ...c,
        unlockDate: new Date(c.unlockDate),
        createdDate: new Date(c.createdDate),
      }))
    } catch (error) {
      console.error('Error loading capsules:', error)
      return []
    }
  }

  static getCapsuleById(id: string): Capsule | null {
    const capsules = this.getAllCapsules()
    return capsules.find(c => c.id === id) || null
  }

  static saveCapsule(capsule: Capsule): void {
    try {
      const capsules = this.getAllCapsules()
      
      // Check if capsule already exists
      const existingIndex = capsules.findIndex(c => c.id === capsule.id)
      
      if (existingIndex >= 0) {
        // Update existing capsule
        capsules[existingIndex] = capsule
      } else {
        // Add new capsule
        capsules.push(capsule)
      }
      
      localStorage.setItem(CAPSULES_KEY, JSON.stringify(capsules))
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('capsulesUpdated'))
    } catch (error) {
      console.error('Error saving capsule:', error)
    }
  }

  static deleteCapsule(id: string): void {
    try {
      const capsules = this.getAllCapsules()
      const filtered = capsules.filter(c => c.id !== id)
      localStorage.setItem(CAPSULES_KEY, JSON.stringify(filtered))
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('capsulesUpdated'))
    } catch (error) {
      console.error('Error deleting capsule:', error)
    }
  }

  static getStats() {
    const capsules = this.getAllCapsules()
    const now = new Date()
    
    const locked = capsules.filter(c => new Date(c.unlockDate) > now).length
    const unlocked = capsules.filter(c => new Date(c.unlockDate) <= now).length
    
    return {
      totalCapsules: capsules.length,
      lockedCapsules: locked,
      unlockedCapsules: unlocked,
    }
  }

  static clearAllCapsules(): void {
    try {
      localStorage.removeItem(CAPSULES_KEY)
      // Notify other components that capsules were cleared
      window.dispatchEvent(new CustomEvent('capsulesUpdated'))
    } catch (error) {
      console.error('Error clearing capsules:', error)
    }
  }
}