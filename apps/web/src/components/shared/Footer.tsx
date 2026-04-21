import Link from 'next/link'

const links = [
  { label: 'Services', href: '/services' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Schedule pickup', href: '/schedule-pickup' },
  { label: 'FAQ', href: '/faq' },
]

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div>
            <p className="font-extrabold text-lg text-gray-900">LaundryStrap</p>
            <p className="mt-2 text-sm text-gray-600 max-w-sm">
              Trust-first laundry: photographed at drop-off, verified at pickup, and tracked through every stage.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-gray-600 hover:text-[color:var(--color-primary)]">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} LaundryStrap. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-gray-700">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-700">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
