"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { achievementStats } from "@/data/achievement-stats"
import { AchievementStat } from "@/types"

const ACCENT_GLOW: Record<NonNullable<AchievementStat["accent"]>, string> = {
  cyan: "radial-gradient(circle, rgba(91,233,255,0.45), transparent 70%)",
  violet: "radial-gradient(circle, rgba(124,92,255,0.45), transparent 70%)",
  mint: "radial-gradient(circle, rgba(156,255,123,0.35), transparent 70%)",
  signal: "radial-gradient(circle, rgba(255,79,184,0.4), transparent 70%)",
  amber: "radial-gradient(circle, rgba(255,179,71,0.35), transparent 70%)",
}

const ACCENT_TEXT: Record<NonNullable<AchievementStat["accent"]>, string> = {
  cyan: "text-cyan",
  violet: "text-violet",
  mint: "text-mint",
  signal: "text-signal",
  amber: "text-amber",
}

export default function StatsSection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            <p className="hud-label mb-3">[ 02 / FEATURED WORK ]</p>
            <h2 className="font-display text-display-md font-light leading-tight">
              <span className="text-foam-grad">SHIPPED IN</span>{" "}
              <span className="text-cyan-grad font-medium">PRODUCTION</span>
            </h2>
          </div>
          <div className="flex items-center gap-3 mono-tag">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan opacity-70 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
            </span>
            <span>{achievementStats.length} PROJECTS · INDEXED</span>
          </div>
        </div>

        {/* 2 rows × 3 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {achievementStats.map((stat, index) => {
            const accent = stat.accent ?? "cyan"
            const isClickable = !!stat.href && stat.href.trim() !== ""
            const hasContent =
              !!stat.title || !!stat.subtitle || (stat.tags && stat.tags.length > 0)

            const card = (
              <div className="relative h-full glass rounded-2xl p-6 panel-edge overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-glow-cyan flex flex-col">
                {/* corner index */}
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-[10px] tracking-[0.3em] uppercase ${ACCENT_TEXT[accent]}`}
                  >
                    / {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.28em] text-ash uppercase">
                    PROJECT
                  </span>
                </div>

                {/* title */}
                <h3 className="mt-6 font-display text-2xl sm:text-3xl text-foam-grad leading-tight tracking-tight min-h-[2.4rem]">
                  {stat.title || (
                    <span className="text-ash/40">— Untitled —</span>
                  )}
                </h3>

                {/* subtitle */}
                <p className="mt-3 text-sm text-ash leading-relaxed min-h-[2.6rem]">
                  {stat.subtitle || (
                    <span className="text-ash/30">
                      Subtitle / one-line description goes here.
                    </span>
                  )}
                </p>

                {/* tags */}
                <div className="mt-5 flex flex-wrap gap-1.5 min-h-[1.75rem]">
                  {stat.tags && stat.tags.length > 0 ? (
                    stat.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded-md border border-cyan/15 bg-substrate/70 font-mono text-[10px] tracking-[0.18em] text-foam uppercase"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="font-mono text-[10px] tracking-[0.24em] text-ash/30 uppercase">
                      // tags
                    </span>
                  )}
                </div>

                {/* footer trace */}
                <div className="mt-auto pt-6 flex items-center justify-between border-t border-cyan/10">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${hasContent ? "bg-mint shadow-glow-cyan" : "bg-slate"}`}
                    />
                    <span className="font-mono text-[10px] tracking-[0.24em] text-ash uppercase">
                      {hasContent ? "READY" : "DRAFT"}
                    </span>
                  </div>
                  {isClickable ? (
                    <span
                      className={`flex items-center gap-1 font-mono text-[10px] tracking-[0.24em] uppercase ${ACCENT_TEXT[accent]}`}
                    >
                      OPEN
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] tracking-[0.24em] text-ash/40 uppercase">
                      —
                    </span>
                  )}
                </div>

                {/* faint accent glow */}
                <div
                  aria-hidden
                  className="absolute -bottom-12 -right-12 w-44 h-44 rounded-full opacity-30 blur-2xl pointer-events-none"
                  style={{ background: ACCENT_GLOW[accent] }}
                />
              </div>
            )

            if (isClickable) {
              return (
                <Link
                  key={index}
                  href={stat.href!}
                  target={stat.href!.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group block"
                >
                  {card}
                </Link>
              )
            }
            return (
              <div key={index} className="group">
                {card}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
