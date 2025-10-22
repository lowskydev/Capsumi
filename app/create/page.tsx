import { Navigation } from "@/components/navigation"
import { CreateCapsuleForm } from "@/components/create-capsule-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreatePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-4xl py-8 px-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2 text-balance">Create Time Capsule</h1>
          <p className="text-muted-foreground text-lg">Preserve your memories, thoughts, and moments for the future</p>
        </div>

        {/* Form */}
        <CreateCapsuleForm />
      </main>
    </div>
  )
}
