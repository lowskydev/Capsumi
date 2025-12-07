"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Clock, Lock, Share2, Sparkles, ArrowRight, Check, ImageIcon, Music, FileText, Calendar } from "lucide-react"
import Footer from "@/components/footer"
import { CapsuleCard } from "@/components/capsule-card"

export default function LandingPage() {
  // Mock data for demonstration purposes
  const demoLockedDate = new Date()
  demoLockedDate.setDate(demoLockedDate.getDate() + 365) // 1 year from now

  const demoUnlockedDate = new Date()
  demoUnlockedDate.setDate(demoUnlockedDate.getDate() - 10) // 10 days ago

  const demoCreatedDate = new Date()

  return (
    <div className="min-h-screen page-transition">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className=" w-full flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/capsumi-logo-color.PNG"
              alt="Capsumi"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-xl font-semibold">
              Capsumi
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="rounded-2xl">
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild className="rounded-2xl">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Preserve Your Precious Moments
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
            Digital Time Capsules for Your Memories
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 text-pretty leading-relaxed max-w-2xl mx-auto">
            Lock away your photos, videos, and messages to unlock them in the future. Create meaningful moments that
            last forever with Capsumi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="rounded-2xl text-lg h-14 px-8 hover-lift">
              <Link href="/register">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* NEW: Visual Example Section */}
      <section className="px-4 py-16 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See It in Action</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              This is exactly what your capsules will look like. Securely locked until the date you choose, or ready to relive the moment.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
            {/* Example 1: Locked Capsule */}
            <div className="w-full max-w-sm pointer-events-none select-none transform hover:scale-105 transition-transform duration-300">
              <div className="text-center mb-4 text-sm font-medium text-primary uppercase tracking-wider">Locked State</div>
              <CapsuleCard 
                id="demo-1"
                title="A Letter to My Future Self"
                description="Open this in one year to see how far you've come!"
                unlockDate={demoLockedDate}
                createdDate={demoCreatedDate}
                isLocked={true}
                previewImage="/kids-surfing-ocean.jpg"
                contentTypes={['text', 'image']}
                tags={['motivation', 'future']}
              />
            </div>

            {/* Arrow for visual flow (optional) */}
            <div className="hidden md:block text-muted-foreground/30">
              <ArrowRight className="w-12 h-12" />
            </div>

            {/* Example 2: Unlocked Capsule */}
            <div className="w-full max-w-sm pointer-events-none select-none transform hover:scale-105 transition-transform duration-300">
              <div className="text-center mb-4 text-sm font-medium text-secondary uppercase tracking-wider">Unlocked State</div>
              <CapsuleCard 
                id="demo-2"
                title="Family Beach Vacation"
                description="Best memories from our trip to the coast. The sunset was amazing!"
                unlockDate={demoUnlockedDate}
                createdDate={demoCreatedDate}
                eventDate={demoUnlockedDate}
                isLocked={false}
                previewImage="/family-beach-sunset.jpg"
                contentTypes={['image', 'audio']}
                tags={['family', 'travel', 'summer']}
              />
            </div>
          </div>
        </div>
      </section>

      {/* What is Capsumi Section */}
      <section className="px-4 py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 text-balance">What is Capsumi?</h2>
          <p className="text-lg md:text-xl text-muted-foreground text-center mb-12 text-pretty leading-relaxed max-w-3xl mx-auto">
            Capsumi is a digital memory preservation platform that lets you create time capsules filled with photos,
            videos, audio messages, and text. Set a future unlock date and relive your memories when the time comes.
            Perfect for birthdays, anniversaries, graduations, or any special moment you want to preserve.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Time-Based Unlocking</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Choose any future date to unlock your capsule. Perfect for milestone celebrations or future
                    surprises.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 shrink-0">
                  <ImageIcon className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Rich Media Content</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Add unlimited photos, videos, and audio recordings to create immersive memory experiences.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 shrink-0">
                  <FileText className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Personal Messages</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Write heartfelt messages to your future self or loved ones that will be revealed at the perfect
                    time.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                  <Music className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Audio Memories</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Capture voice messages, favorite songs, or ambient sounds to make your capsules truly special.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-balance">
            Everything You Need to Preserve Memories
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-16 text-pretty max-w-2xl mx-auto">
            Capsumi makes it easy to create, organize, and share your digital time capsules
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-3xl p-8 hover-lift border border-border/50">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                <Lock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Time-Locked Content</h3>
              <p className="text-muted-foreground leading-relaxed">
                Set future unlock dates for your capsules. Your memories stay sealed until the perfect moment arrives.
              </p>
            </div>

            <div className="bg-card rounded-3xl p-8 hover-lift border border-border/50">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 mb-6">
                <Clock className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Organized Timeline</h3>
              <p className="text-muted-foreground leading-relaxed">
                View all your capsules in a beautiful timeline. Track upcoming unlocks and revisit opened memories.
              </p>
            </div>

            <div className="bg-card rounded-3xl p-8 hover-lift border border-border/50">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 mb-6">
                <Share2 className="h-7 w-7 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Easy Sharing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Share capsules with friends and family. Create collaborative memories together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl text-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-12 md:p-16 border border-border/50">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">Ready to Start Your Journey?</h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Join thousands of people preserving their most precious moments with Capsumi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-5 w-5 text-primary" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-5 w-5 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-5 w-5 text-primary" />
              <span>Unlimited capsules</span>
            </div>
          </div>
          <Button size="lg" asChild className="rounded-2xl text-lg h-14 px-8 hover-lift">
            <Link href="/register">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}