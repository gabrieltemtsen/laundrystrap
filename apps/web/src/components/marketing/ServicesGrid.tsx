import Link from 'next/link'
import { Droplets, Wind, Shirt, Sparkles, SprayCan } from 'lucide-react'

const services = [
  { icon: Droplets, title: 'Wash Only', price: 'from ₦500', desc: 'Clean wash, carefully handled.' },
  { icon: Shirt, title: 'Wash & Iron', price: 'from ₦800', desc: 'Crisp finish, ready to wear.' },
  { icon: Sparkles, title: 'Dry Clean', price: 'from ₦2,000', desc: 'For suits, jackets, delicate fabrics.' },
  { icon: SprayCan, title: 'Starch', price: 'from ₦600', desc: 'Sharp look for natives and workwear.' },
  { icon: Wind, title: 'Iron Only', price: 'from ₦400', desc: 'Press and fold, neatly packaged.' },
]

export function ServicesGrid() {
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-[color:var(--color-primary)]">Services</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
              Premium laundry, transparent pricing.
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl">
              No surprises. You see itemized pricing on your receipt — and in your portal.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-900 hover:border-gray-300"
          >
            View full pricing
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-gray-100 p-7 hover:shadow-sm transition-shadow"
            >
              <div className="w-11 h-11 rounded-xl bg-[color:var(--color-primary)]/10 flex items-center justify-center">
                <s.icon className="w-5 h-5 text-[color:var(--color-primary)]" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">{s.title}</h3>
              <p className="mt-1 text-sm font-semibold text-[color:var(--color-accent)]">{s.price}</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
