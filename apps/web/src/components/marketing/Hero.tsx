import Link from 'next/link'
import { ArrowRight, ShieldCheck, Star } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative bg-[#0F3460] text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 50%, #0B7A75 0%, transparent 60%),
                             radial-gradient(circle at 75% 20%, #0B7A75 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28 lg:py-36">
        <div className="max-w-3xl">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium text-white/90 mb-8">
            <ShieldCheck className="w-4 h-4 text-[#0B7A75]" />
            Photo-verified. Tag-tracked. 100% accountable.
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Never lose a
            <br />
            <span className="text-[#4ECDC4]">garment again.</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/75 leading-relaxed mb-10 max-w-xl">
            Every item you drop off is{' '}
            <strong className="text-white font-semibold">photographed, tagged, and tracked</strong>{' '}
            through every stage of washing — so you always know exactly where your clothes are.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/schedule-pickup"
              className="inline-flex items-center justify-center gap-2 bg-[#0B7A75] hover:bg-[#096b66] text-white font-semibold text-base px-8 py-4 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-[#0B7A75]/30"
            >
              Schedule a Free Pickup
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-base px-8 py-4 rounded-xl transition-all"
            >
              See How It Works
            </Link>
          </div>

          {/* Social proof numbers */}
          <div className="flex flex-wrap gap-8 mt-14 pt-10 border-t border-white/10">
            {[
              { label: 'Items tracked', value: '50,000+' },
              { label: 'Zero items lost', value: '0' },
              { label: 'Customer rating', value: '4.9 ★' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
