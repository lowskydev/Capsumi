"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { CreateCapsuleForm } from "@/components/create-capsule-form"

export default function CreatePage() {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6 bg-gradient-to-br from-pink-50 to-white dark:from-[#0e0e0e] dark:to-[#1a1a1a] transition-colors duration-300">
          <div className="w-full max-w-4xl mx-auto py-6 md:py-10">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-pink-800 dark:text-brand-red mb-2">
                Create Time Capsule
              </h1>
              <p className="text-pink-700 dark:text-white/70 text-lg">
                Preserve your memories, thoughts, and moments for the future
              </p>
            </div>

            {/* Form Container */}
            <div className="rounded-2xl border border-pink-200 dark:border-brand-red/30 bg-white dark:bg-[#161616] shadow-md transition-all p-6">
              <CreateCapsuleForm />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}