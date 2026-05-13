import { Phone, MessageCircle, MapPin } from 'lucide-react'

export function CTABanner() {
  return (
    <section className="bg-gradient-to-br from-[#0c1f3d] to-[#0F3460] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Ready to drop off?
            </h3>
            <p className="mt-2 text-white/70 max-w-lg">
              Walk in anytime or call ahead — your reference code is generated at intake. You can track your order live from this page.
            </p>
            <div className="mt-6 flex flex-wrap gap-5">
              <a href="tel:" className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition-colors">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                Call us
              </a>
              <a href="https://wa.me/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition-colors">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                WhatsApp
              </a>
              <a href="/location" className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition-colors">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                Find us
              </a>
            </div>
          </div>

          <div className="shrink-0 rounded-2xl bg-white/5 border border-white/10 p-6 text-center min-w-[220px]">
            <p className="text-4xl font-extrabold text-[#4ECDC4]">0</p>
            <p className="text-sm text-white/60 mt-1">Items ever lost</p>
            <div className="mt-4 h-px bg-white/10" />
            <p className="mt-4 text-4xl font-extrabold text-white">4.9★</p>
            <p className="text-sm text-white/60 mt-1">Average rating</p>
          </div>
        </div>
      </div>
    </section>
  )
}
