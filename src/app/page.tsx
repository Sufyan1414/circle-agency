import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import TechMarquee from '@/components/TechMarquee'
import ServicesGrid from '@/components/ServicesGrid'
import ParallaxShowcase from '@/components/ParallaxShowcase'
import TechVisualizer from '@/components/TechVisualizer'
import CaseStudies from '@/components/CaseStudies'
import ProjectEstimator from '@/components/ProjectEstimator'
import FAQ from '@/components/FAQ'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'
import Scene3DProvider from '@/components/3d/Scene3DProvider'
import { ScrollContextProvider } from '@/hooks/useScrollContext'

export default function Home() {
  return (
    <Scene3DProvider>
      <ScrollContextProvider>
        <Navbar />
        <main className="relative min-h-screen" style={{ background: 'transparent' }}>
          {/* Hero ambient — hyper-blue (transparent so 3D particles show through) */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[800px] pointer-events-none z-0"
            style={{
              background:
                'radial-gradient(ellipse 60% 60% at 65% 20%, rgba(0,82,255,0.08) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10">
            <Hero />
            <TechMarquee />
            <ServicesGrid />
            {/* ── Scroll-driven parallax depth demo section ── */}
            <ParallaxShowcase />
            <TechVisualizer />
            <CaseStudies />
            <ProjectEstimator />
            <FAQ />
            <ContactForm />
          </div>
        </main>
        <Footer />
      </ScrollContextProvider>
    </Scene3DProvider>
  )
}
