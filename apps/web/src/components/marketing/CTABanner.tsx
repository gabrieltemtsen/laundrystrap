import { Phone, MessageCircle, MapPin, ArrowRight } from 'lucide-react'

export function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-white py-20">
      {/* Background gradient band */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500" />
      {/* Subtle noise/texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">

          {/* Left copy */}
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-3">Ready to drop off?</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              Walk in. We handle{' '}
              <span className="text-cyan-200">the rest.</span>
            </h2>
            <p className="mt-4 text-white/70 text-lg leading-relaxed">
              Your reference code is generated at intake. Track from this page — no app, no login required.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="tel:"
                className="inline-flex items-center gap-2.5 h-12 px-6 bg-white text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-50 transition-all shadow-lg"
              >
                <Phone className="w-4 h-4" />
                Call us
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://wa.me/"
                className="inline-flex items-center gap-2.5 h-12 px-6 bg-white/15 hover:bg-white/25 text-white font-bold text-sm rounded-xl transition-all border border-white/20"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              <a
                href="/location"
                className="inline-flex items-center gap-2.5 h-12 px-6 bg-white/15 hover:bg-white/25 text-white font-bold text-sm rounded-xl transition-all border border-white/20"
              >
                <MapPin className="w-4 h-4" />
                Find us
              </a>
            </div>
          </div>

          {/* Right stats */}
          <div className="shrink-0 grid grid-cols-2 gap-3 md:min-w-[260px]">
            {[
              { value: '0',      label: 'Items ever lost',    sub: 'since day one' },
              { value: '4.9★',   label: 'Average rating',     sub: 'from customers' },
              { value: '48hrs',  label: 'Avg. turnaround',    sub: 'standard wash' },
              { value: '100%',   label: 'Photo-verified',      sub: 'every item' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/10 border border-white/15 p-4 text-center">
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-xs font-semibold text-white/80 mt-0.5">{s.label}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
