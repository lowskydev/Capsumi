"use client"

import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const router = useRouter()
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-3xl font-bold mb-4">Forgot Password</h1>
      <p className="text-lg text-muted-foreground mb-8">Coming Soon!</p>
      <button
        onClick={() => router.back()}
        className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition-colors"
      >
        Go Back
      </button>
    </main>
  )
}