'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Shirt } from 'lucide-react'

const links = [
  { label: 'Services', href: '/services' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-[#0F3460]">
          <span className="bg-gradient-to-br from-[#0B7A75] to-[#096b66] text-white rounded-xl p-2 shadow-md shadow-[#0B7A75]/20">
            <Shirt className="w-4 h-4" />
          </span>
          LaundryStrap
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-gray-500 hover:text-[#0B7A75] transition-colors font-medium"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Operator portal link */}
        <div className="hidden md:flex items-center">
          <Link
            href="/ops"
            className="text-sm font-semibold text-[#0B7A75] border border-[#0B7A75]/30 hover:border-[#0B7A75] hover:bg-[#0B7A75]/5 px-4 py-2 rounded-lg transition-all"
          >
            Operator Portal
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
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block text-sm font-medium text-gray-700 py-2.5 border-b border-gray-50 last:border-0"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/ops"
            className="block w-full text-center text-[#0B7A75] border border-[#0B7A75]/40 text-sm font-semibold px-5 py-3 rounded-lg mt-3"
            onClick={() => setOpen(false)}
          >
            Operator Portal
          </Link>
        </div>
      )}
    </header>
  )
}
