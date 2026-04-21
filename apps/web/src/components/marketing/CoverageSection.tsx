import { headers } from 'next/headers'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

export function CoverageSection() {
  const h = headers()
  const slug = h.get('x-tenant-slug')

  // For now: placeholder list; in real app, fetch tenant.service_areas server-side.
  const areas = slug?.includes('abuja')
    ? ['Wuse 2', 'Maitama', 'Asokoro', 'Garki', 'Jabi', 'Utako', 'Gwarinpa', 'Apo', 'Lugbe']
    : ['Rayfield', 'Terminus', 'Tudun Wada', 'Bukuru']

  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-3xl border border-gray-100 p-8 md:p-10 bg-gradient-to-br from-white to-gray-50">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-primary)]">
                <MapPin className="w-4 h-4" /> Coverage
              </div>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">
                We serve your neighborhood.
              </h2>
              <p className="mt-3 text-gray-600 max-w-xl">
                We’re currently active in these areas. If you don’t see your location, request it — we expand fast.
              </p>
            </div>

            <Link
              href="/schedule-pickup"
              className="inline-flex items-center justify-center bg-[color:var(--color-primary)] text-white font-semibold px-6 py-3 rounded-xl hover:opacity-95"
            >
              Schedule Pickup
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {areas.map((a) => (
              <span
                key={a}
                className="text-sm px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700"
              >
                {a}
              </span>
            ))}
            <span className="text-sm px-3 py-1.5 rounded-full bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)] border border-[color:var(--color-primary)]/20">
              Request your area
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
