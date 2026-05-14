import { Camera, Tag, ShieldCheck } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Camera,
    color: 'bg-indigo-600',
    title: 'Drop off — we photograph everything',
    desc: 'Every garment gets a clear photo at intake. Timestamped, stored, and tied to your order reference.',
  },
  {
    number: '02',
    icon: Tag,
    color: 'bg-purple-600',
    title: 'Each item gets a physical tag',
    desc: 'A unique QR tag is attached to every piece. If it ever moves, we know about it.',
  },
  {
    number: '03',
    icon: ShieldCheck,
    color: 'bg-cyan-600',
    title: 'Track from your phone — no app needed',
    desc: 'Enter your reference code here anytime to see real-time status: washing, drying, ready for pickup.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-zinc-950 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        {/* Heading */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">How it works</p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Built for trust —{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              not vibes.
            </span>
          </h2>
          <p className="mt-4 text-zinc-400 text-lg leading-relaxed">
            The LaundryStrap system creates a full audit trail for every garment, every time.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.number}
                className="group relative rounded-2xl bg-zinc-900 border border-zinc-800 p-8 overflow-hidden hover:border-zinc-700 transition-all hover:-translate-y-1"
              >
                {/* Number watermark */}
                <div className="absolute top-4 right-5 text-7xl font-black text-zinc-800/60 leading-none select-none">
                  {s.number}
                </div>

                <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="font-bold text-lg text-white leading-snug mb-3">{s.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
