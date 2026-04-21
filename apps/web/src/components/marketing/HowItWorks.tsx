import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const steps = [
  {
    step: '01',
    title: 'Drop off or request pickup',
    desc: 'Bring your items to the shop or schedule a pickup in minutes.',
  },
  {
    step: '02',
    title: 'We photograph & tag every item',
    desc: 'Each garment gets a QR tag and a clear photo captured at intake.',
  },
  {
    step: '03',
    title: 'Track progress, verify at pickup',
    desc: 'Statuses update as your items move through wash, dry, iron, and packaging.',
  },
]

export function HowItWorks() {
  return (
    <section className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-[color:var(--color-primary)]">How it works</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
              Built for trust — not vibes.
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl">
              The LaundryStrap system creates an audit trail for every garment. If something goes wrong,
              we can trace exactly what happened — and who last handled it.
            </p>
          </div>
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-[color:var(--color-primary)]"
          >
            See the full walkthrough <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="rounded-2xl bg-white border border-gray-100 p-7">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-400">STEP {s.step}</p>
                <CheckCircle2 className="w-5 h-5 text-[color:var(--color-primary)]" />
              </div>
              <h3 className="mt-3 text-lg font-bold text-gray-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
