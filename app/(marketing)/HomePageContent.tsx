"use client"

import Hero from "./_components/Hero"
import StatsSection from "./_components/StatsSection"
import ContactSection from "./_components/ContactSection"

export default function HomePageContent() {
  return (
    <main className="relative min-h-screen text-foam font-body">
      <div className="relative">
        <Hero />
        <StatsSection />
        <ContactSection />

        <footer className="relative py-10 px-4 sm:px-6 lg:px-8 mt-8">
          <div className="max-w-7xl mx-auto">
            <div className="border-t border-cyan/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="hud-label">© {new Date().getFullYear()} YINGQIANG YUAN</span>
                <span className="h-3 w-px bg-cyan/20" />
                <span className="font-mono text-[10px] tracking-[0.32em] text-ash uppercase">
                  ALL SIGNALS RESERVED
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-mint opacity-60 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
                </span>
                <span className="font-mono text-[10px] tracking-[0.32em] text-ash uppercase">
                  SYSTEM ONLINE · LATENCY 12MS
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
