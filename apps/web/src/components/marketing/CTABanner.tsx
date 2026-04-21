import Link from 'next/link'
import { Phone, MessageCircle } from 'lucide-react'

export function CTABanner() {
  return (
    <section className="bg-[#0F3460] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Ready to stop laundry stress?
            </h3>
            <p className="mt-2 text-white/70 max-w-2xl">
              Book a pickup, track your items, and verify every garment at pickup — with full transparency.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/80">
              <span className="inline-flex items-center gap-2"><Phone className="w-4 h-4" /> Call us</span>
              <span className="inline-flex items-center gap-2"><MessageCircle className="w-4 h-4" /> WhatsApp</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/schedule-pickup"
              className="inline-flex items-center justify-center bg-[#0B7A75] hover:bg-[#096b66] text-white font-semibold px-7 py-3.5 rounded-xl"
            >
              Schedule Pickup
            </Link>
            <Link
              href="/portal"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl"
            >
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
