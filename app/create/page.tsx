"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { CreateCapsuleForm } from "@/components/create-capsule-form"
import Footer from "@/components/footer"

export default function CreatePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <DashboardSidebar />

      <main className="flex-1 w-full p-6 lg:ml-64 transition-all duration-300">
        <div className="w-full max-w-4xl mx-auto py-6 md:py-10">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-primary mb-2">
              Create Time Capsule
            </h1>
            <p className="text-muted-foreground text-lg">
              Preserve your memories, thoughts, and moments for the future
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-md transition-all p-6">
            <CreateCapsuleForm />
          </div>
        </div>
      </main>
      <div className="w-full p-6 lg:ml-64">
        <Footer />
      </div>
    </div>
  )
}