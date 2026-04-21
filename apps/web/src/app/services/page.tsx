import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">Services & Pricing</h1>
        <p className="mt-3 text-gray-600 max-w-2xl">
          Transparent, itemized pricing. (We’ll wire this to the tenant pricing catalogue in Supabase.)
        </p>
        <div className="mt-10 rounded-2xl border border-gray-100 p-8 bg-gray-50">
          <p className="text-sm text-gray-700">Coming next: full pricing table + subscription/bulk anchors.</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
