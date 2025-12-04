"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 px-4 py-8 text-center text-sm text-muted-foreground">
      <nav className="mb-2 flex flex-wrap items-center justify-center gap-4 text-sm">
        <Link href="/faq" className="hover:underline">
          FAQ
        </Link>
        <Link href="/contact" className="hover:underline">
          Contact
        </Link>
        <Link href="/privacy-policy" className="hover:underline">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:underline">
          Terms
        </Link>
        <Link href="/support" className="hover:underline">
          Support
        </Link>
        <Link href="/tutorial" className="hover:underline">
          Tutorial
        </Link>
      </nav>
      <div>© 2025 Capsumi</div>
    </footer>
  )
}