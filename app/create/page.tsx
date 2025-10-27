"use client"

import { Navigation } from "@/components/navigation"
import { CreateCapsuleForm } from "@/components/create-capsule-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreatePage() {
  const brandRed = "#f38283"
  const brandGreen = "#62cf91"

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-50 to-white dark:from-[#0e0e0e] dark:to-[#1a1a1a] transition-colors duration-300"
      style={
        {
          "--brand-red": brandRed,
          "--brand-green": brandGreen,
        } as React.CSSProperties
      }
    >
      <Navigation />

      <main className="w-full max-w-4xl mx-auto py-10 px-6">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/mycapsules"
            className="inline-flex items-center gap-2 text-pink-600 dark:text-[rgba(255,255,255,0.7)] hover:text-[var(--brand-red)] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Capsules
          </Link>

          <h1 className="text-4xl font-bold text-pink-800 dark:text-[var(--brand-red)] mb-2">
            Create Time Capsule
          </h1>
          <p className="text-pink-700 dark:text-[rgba(255,255,255,0.7)] text-lg">
            Preserve your memories, thoughts, and moments for the future
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl border border-pink-200 dark:border-[rgba(243,130,131,0.3)] bg-white dark:bg-[#161616] shadow-md transition-all p-6">
          <CreateCapsuleForm />
        </div>
      </main>
    </div>
  )
}
