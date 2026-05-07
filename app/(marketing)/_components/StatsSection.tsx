"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { achievementStats } from "@/data/achievement-stats"

export default function StatsSection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            <p className="hud-label mb-3">[ 02 / TELEMETRY ]</p>
            <h2 className="font-display text-display-md font-light leading-tight">
              <span className="text-foam-grad">SIGNALS FROM</span>{" "}
              <span className="text-cyan-grad font-medium">PRODUCTION</span>
            </h2>
          </div>
          <div className="flex items-center gap-3 mono-tag">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan opacity-70 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
            </span>
            <span>STREAM · 24H ROLLING</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {achievementStats.map((stat, index) => {
            const IconComponent = stat.icon
            const isClickable = stat.href && stat.href.trim() !== ""

            const content = (
              <div className="relative h-full glass rounded-2xl p-6 panel-edge overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-glow-cyan">
                {/* corner index */}
                <div className="absolute top-4 right-4 font-mono text-[10px] text-ash tracking-[0.3em]">
                  // {String(index + 1).padStart(2, "0")}
                </div>
                {/* icon chip */}
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-cyan/15 to-violet/15 ring-1 ring-cyan/20 text-cyan mb-6">
                  {IconComponent ? <IconComponent className="w-5 h-5" /> : null}
                </div>

                {/* big number */}
                <div className="font-display text-6xl sm:text-7xl text-foam-grad leading-none tracking-tight">
                  {stat.number}
                </div>

                {/* label */}
                <div className="mt-3 font-mono text-[11px] tracking-[0.28em] text-ash uppercase">
                  {stat.description}
                </div>

                {/* footer trace */}
                <div className="mt-6 pt-4 border-t border-cyan/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-mint shadow-glow-cyan" />
                    <span className="font-mono text-[10px] tracking-[0.24em] text-ash uppercase">
                      VERIFIED
                    </span>
                  </div>
                  {isClickable && (
                    <span className="flex items-center gap-1 font-mono text-[10px] tracking-[0.24em] text-cyan uppercase">
                      EXPLORE
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  )}
                </div>

                {/* faint chip background */}
                <div
                  aria-hidden
                  className="absolute -bottom-12 -right-12 w-44 h-44 rounded-full opacity-30 blur-2xl"
                  style={{
                    background:
                      index % 2 === 0
                        ? "radial-gradient(circle, rgba(91,233,255,0.5), transparent 70%)"
                        : "radial-gradient(circle, rgba(124,92,255,0.5), transparent 70%)",
                  }}
                />
              </div>
            )

            if (isClickable) {
              return (
                <Link
                  key={index}
                  href={stat.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  {content}
                </Link>
              )
            }
            return (
              <div key={index} className="group">
                {content}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
