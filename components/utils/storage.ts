export interface Capsule {
  id: string
  title: string
  description?: string
  unlockDate: string
  createdDate: string
  isLocked: boolean
  previewImage?: string
  textContent?: string
  images?: File[]
  audio?: File | null
  contentTypes: ("text" | "image" | "audio")[]
  tags?: string[]
}

// Get all capsules from localStorage
export function getCapsules(): Capsule[] {
  const stored = localStorage.getItem("capsules")
  return stored ? JSON.parse(stored) : []
}

// Save a new capsule
export function saveCapsule(capsule: Capsule) {
  const capsules = getCapsules()
  capsules.push(capsule)
  localStorage.setItem("capsules", JSON.stringify(capsules))
}

// Clear all capsules
export function clearCapsules() {
  localStorage.removeItem("capsules")
}
