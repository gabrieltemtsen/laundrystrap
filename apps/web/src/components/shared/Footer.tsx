import Link from 'next/link'
import { Zap, Twitter, Instagram, Mail } from 'lucide-react'

const nav = [
  {
    heading: 'Service',
    links: [
      { label: 'How It Works', href: '/#how-it-works' },
      { label: 'Services',     href: '/services' },
      { label: 'Pricing',      href: '/pricing' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About',   href: '/about' },
      { label: 'FAQ',     href: '/faq' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Operator',
    links: [
      { label: 'Operator Portal', href: '/ops' },
      { label: 'New Intake',      href: '/ops/intake' },
      { label: 'Customers',       href: '/ops/customers' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-lg tracking-tight">
                Laundry<span className="text-indigo-400">Strap</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-[200px]">
              Every garment photographed, tagged, and tracked from drop-off to pickup.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { icon: Twitter,   href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Mail,      href: 'mailto:hello@laundrystrap.com' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {nav.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">{col.heading}</p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-800 pt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} LaundryStrap. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs text-zinc-600">
            <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
            <Link href="/terms"   className="hover:text-zinc-400 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
