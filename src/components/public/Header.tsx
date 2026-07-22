"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Heart, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "Acheter", href: "/recherche?listingType=SELL" },
  { label: "Louer", href: "/recherche?listingType=RENT" },
  { label: "Villes", href: "/villes" },
  { label: "Types de terrain", href: "/types" },
  { label: "FAQ", href: "/faq" },
]

export function Header({ siteName = "Parcelles" }: { siteName?: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
              <span className="text-sm font-bold text-white">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900">{siteName}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/recherche"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
            >
              <Search className="h-4 w-4" />
              <span>Rechercher</span>
            </Link>
            <Link href="/favoris" className="p-2 text-gray-500 hover:text-emerald-600 transition-colors">
              <Heart className="h-5 w-5" />
            </Link>
            <Link href="/alertes" className="p-2 text-gray-500 hover:text-emerald-600 transition-colors">
              <Bell className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-emerald-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
