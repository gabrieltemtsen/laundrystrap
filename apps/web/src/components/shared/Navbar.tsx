'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Shirt } from 'lucide-react'
import { cn } from '@/lib/cn'

const links = [
  { label: 'Services', href: '/services' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-[#0F3460]">
          <span className="bg-[#0B7A75] text-white rounded-lg p-1.5">
            <Shirt className="w-4 h-4" />
          </span>
          LaundryStrap
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-gray-600 hover:text-[#0B7A75] transition-colors font-medium"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/portal"
            className="text-sm font-medium text-gray-600 hover:text-[#0B7A75] transition-colors"
          >
            My Orders
          </Link>
          <Link
            href="/schedule-pickup"
            className="bg-[#0B7A75] hover:bg-[#096b66] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Schedule Pickup
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block text-sm font-medium text-gray-700 py-2"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/schedule-pickup"
            className="block w-full text-center bg-[#0B7A75] text-white text-sm font-semibold px-5 py-3 rounded-lg mt-2"
            onClick={() => setOpen(false)}
          >
            Schedule Pickup
          </Link>
        </div>
      )}
    </header>
  )
}
