import Link from 'next/link'
import { Shirt } from 'lucide-react'

const links = [
  { label: 'Services', href: '/services' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
]

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-gradient-to-br from-[#0B7A75] to-[#096b66] text-white rounded-xl p-2">
                <Shirt className="w-4 h-4" />
              </span>
              <p className="font-extrabold text-lg text-gray-900">LaundryStrap</p>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Trust-first laundry — photographed at drop-off, tagged, tracked, and verified at every stage.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-gray-500 hover:text-[#0B7A75] transition-colors">
                {l.label}
              </Link>
            ))}
            <Link href="/ops" className="text-sm text-gray-500 hover:text-[#0B7A75] transition-colors">
              Operator Portal
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} LaundryStrap. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
