import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Zainab A.',
    role: 'Working professional',
    quote:
      'The photo verification is a game-changer. I finally feel confident dropping off expensive clothes.',
  },
  {
    name: 'Chidi O.',
    role: 'Dad of 2',
    quote:
      'No more mix-ups. I can track my order and pickup is always smooth — everything is checked.',
  },
  {
    name: 'Mariam S.',
    role: 'Airbnb host',
    quote:
      'Fast turnaround and clear itemized billing. Perfect for bulk weekly laundry.',
  },
]

export function Testimonials() {
  return (
    <section className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center">
          <p className="text-sm font-semibold text-[color:var(--color-primary)]">Social proof</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            Loved by customers who value peace of mind.
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            The trust layer is the product. Everything else is just laundry.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl bg-white border border-gray-100 p-7">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-700">“{t.quote}”</p>
              <div className="mt-6">
                <p className="text-sm font-bold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
