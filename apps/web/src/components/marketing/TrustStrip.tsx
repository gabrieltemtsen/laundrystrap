import { Camera, QrCode, Route } from 'lucide-react'

const items = [
  {
    icon: Camera,
    title: 'Photographed at drop-off',
    desc: 'Every item is captured clearly so there’s no “he said / she said”.',
  },
  {
    icon: QrCode,
    title: 'Tagged & tracked',
    desc: 'Unique QR tags on each garment — scanned through every stage.',
  },
  {
    icon: Route,
    title: 'Verified at pickup',
    desc: 'Pickup checklist matches photos and scans — you confirm with confidence.',
  },
]

export function TrustStrip() {
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((i) => (
            <div
              key={i.title}
              className="rounded-2xl border border-gray-100 p-6 hover:border-gray-200 transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-[color:var(--color-primary)]/10 flex items-center justify-center mb-4">
                <i.icon className="w-5 h-5 text-[color:var(--color-primary)]" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">{i.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{i.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
