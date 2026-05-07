"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, Cpu, Github, Linkedin, Sparkles } from "lucide-react"

const TELEMETRY = [
  { label: "MODELS DEPLOYED", value: "12", trend: "+3" },
  { label: "PIPELINES / DAY", value: "1.4K", trend: "+8.2%" },
  { label: "TOKENS THIS WEEK", value: "84.2M", trend: "live" },
  { label: "UPTIME 30D", value: "99.98%", trend: "stable" },
]

export default function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Top eyebrow */}
        <div
          className={`flex items-center gap-3 mb-10 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-mint opacity-70 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
            </span>
            <span className="font-mono text-[10px] tracking-[0.3em] text-ash uppercase">
              CORE.NODE / ONLINE
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 mono-tag">
            <Cpu className="w-3 h-3 text-cyan" />
            <span>v4.7 · OPUS / NEURAL FABRIC</span>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left - editorial wordmark */}
          <div
            className={`lg:col-span-7 transition-all duration-700 delay-100 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
            }`}
          >
            <p className="hud-label mb-6">[ 01 / IDENTITY ]</p>
            <h1 className="font-display text-display-xl font-light leading-[0.92] tracking-[-0.045em]">
              <span className="block text-foam-grad">JOHN</span>
              <span className="block">
                <span className="text-cyan-grad font-medium">DOE</span>
                <span className="ml-3 inline-block align-baseline text-cyan font-mono text-[clamp(1rem,1.6vw,1.4rem)] tracking-[0.32em]">
                  /AI
                </span>
              </span>
            </h1>

            <div className="mt-6 flex items-center gap-4">
              <div className="h-px flex-1 max-w-[6rem] bg-gradient-to-r from-cyan to-transparent" />
              <span className="font-mono text-[11px] tracking-[0.36em] text-cyan uppercase">
                SOLUTION ARCHITECT · BUILDER
              </span>
            </div>

            <p className="mt-8 text-lg sm:text-xl text-ash max-w-xl leading-relaxed">
              Designing intelligent systems where{" "}
              <span className="text-foam">data, models &amp; humans</span> meet.
              Author of <span className="text-cyan">150+ Python libraries</span>,
              shipping production AI at <span className="text-violet">enterprise scale</span>.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link href="/chat" className="chip-button group">
                <Sparkles className="w-3.5 h-3.5" />
                TALK TO MY AI TWIN
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="chip-button-ghost"
              >
                <Github className="w-3.5 h-3.5" />
                GITHUB
              </a>
              <a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="chip-button-ghost"
              >
                <Linkedin className="w-3.5 h-3.5" />
                LINKEDIN
              </a>
            </div>
          </div>

          {/* Right - telemetry / portrait card */}
          <div
            className={`lg:col-span-5 transition-all duration-700 delay-200 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
            }`}
          >
            <div className="relative group">
              {/* corner brackets */}
              <div className="absolute -inset-3 pointer-events-none opacity-60">
                <div className="absolute top-0 left-0 w-5 h-5 border-l border-t border-cyan/60" />
                <div className="absolute top-0 right-0 w-5 h-5 border-r border-t border-cyan/60" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-l border-b border-cyan/60" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-r border-b border-cyan/60" />
              </div>

              <div className="relative glass-strong rounded-2xl overflow-hidden p-5 panel-edge">
                {/* card header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-signal/80" />
                    <span className="h-2 w-2 rounded-full bg-amber/80" />
                    <span className="h-2 w-2 rounded-full bg-mint/80" />
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.3em] text-ash uppercase">
                    NODE://JD-CORE-01
                  </span>
                </div>

                {/* Portrait */}
                <div className="relative rounded-xl overflow-hidden border border-cyan/15">
                  <div className="absolute inset-0 bg-grid-fine opacity-30 pointer-events-none" />
                  <Image
                    src="/images/profile.png"
                    alt="John Doe"
                    width={640}
                    height={640}
                    className="relative w-full h-72 sm:h-80 object-cover saturate-[0.85] contrast-[1.05] mix-blend-luminosity opacity-95"
                  />
                  {/* gradient sweep */}
                  <div className="absolute inset-0 bg-gradient-to-t from-substrate via-substrate/30 to-transparent" />
                  {/* HUD overlay corner */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 rounded-md bg-ink/60 backdrop-blur border border-cyan/30">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75 animate-ping" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan" />
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.3em] text-cyan uppercase">REC · LIVE</span>
                  </div>
                  <div className="absolute bottom-3 right-3 font-mono text-[9px] text-ash tracking-[0.3em] uppercase">
                    LAT 12MS · 4K · 60FPS
                  </div>
                </div>

                {/* telemetry grid */}
                <div className="mt-5 grid grid-cols-2 gap-2">
                  {TELEMETRY.map((t) => (
                    <div
                      key={t.label}
                      className="rounded-lg border border-cyan/10 bg-substrate/60 p-3"
                    >
                      <div className="hud-label">{t.label}</div>
                      <div className="mt-1 flex items-baseline justify-between">
                        <span className="font-display text-2xl text-foam">{t.value}</span>
                        <span className="font-mono text-[10px] text-mint tracking-[0.18em] uppercase">
                          {t.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* spectrum bar */}
                <div className="mt-4 flex items-end gap-[3px] h-10">
                  {Array.from({ length: 38 }).map((_, i) => {
                    const heights = [25, 60, 35, 80, 45, 65, 90, 50, 70, 40, 30, 75, 55, 95, 60, 35, 80, 45]
                    const h = heights[i % heights.length]
                    return (
                      <span
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{
                          height: `${h}%`,
                          background:
                            i % 7 === 0
                              ? "linear-gradient(180deg, #FF4FB8, #7C5CFF)"
                              : "linear-gradient(180deg, #5BE9FF, rgba(91,233,255,0.15))",
                          opacity: 0.55 + (h / 100) * 0.45,
                        }}
                      />
                    )
                  })}
                </div>

                <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-ash uppercase tracking-[0.24em]">
                  <span>SIGNAL · CYAN.PRIMARY</span>
                  <span className="text-cyan">▲ +14.2%</span>
                </div>
              </div>

              {/* offset chip */}
              <div className="hidden sm:flex absolute -bottom-5 -right-5 items-center gap-2 px-3 py-2 rounded-lg glass shadow-glow-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse-dot" />
                <span className="font-mono text-[10px] tracking-[0.28em] text-cyan uppercase">
                  GPU.A100 × 8
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee ticker */}
        <div className="mt-16 relative overflow-hidden border-y border-cyan/10 py-3">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent z-10 pointer-events-none" />
          <div className="flex gap-12 whitespace-nowrap animate-ticker font-mono text-[11px] tracking-[0.32em] uppercase">
            {Array.from({ length: 2 }).map((_, dup) => (
              <div key={dup} className="flex gap-12 shrink-0 pr-12">
                {[
                  { k: "PYTHON", v: "150+ libs" },
                  { k: "AWS", v: "certified" },
                  { k: "LLM OPS", v: "vLLM · Ray" },
                  { k: "DATA", v: "Snowflake · DuckDB" },
                  { k: "RAG", v: "vector + graph" },
                  { k: "AGENTS", v: "tools · routing" },
                  { k: "EDGE", v: "GPU · CUDA" },
                  { k: "OPEN SOURCE", v: "10M+ DL/mo" },
                ].map((tag) => (
                  <span key={tag.k + dup} className="flex items-center gap-2 text-ash">
                    <span className="text-cyan">◇</span>
                    <span className="text-foam">{tag.k}</span>
                    <span className="text-ash">{tag.v}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
