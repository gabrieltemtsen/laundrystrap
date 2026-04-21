import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { Hero } from '@/components/marketing/Hero'
import { TrustStrip } from '@/components/marketing/TrustStrip'
import { HowItWorks } from '@/components/marketing/HowItWorks'
import { ServicesGrid } from '@/components/marketing/ServicesGrid'
import { Testimonials } from '@/components/marketing/Testimonials'
import { CoverageSection } from '@/components/marketing/CoverageSection'
import { CTABanner } from '@/components/marketing/CTABanner'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <ServicesGrid />
        <Testimonials />
        <CoverageSection />
        <CTABanner />
      </main>
      <Footer />
    </>
  )
}
