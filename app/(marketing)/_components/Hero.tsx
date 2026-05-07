"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, Cpu, Github, Linkedin, Mail, Sparkles } from "lucide-react"

// Real skill groups from the resume
const SKILL_GROUPS: { k: string; v: string }[] = [
  { k: "AI / LLM", v: "Strands · RAG · LLM-as-Judge" },
  { k: "AWS", v: "Bedrock · Lambda · Kinesis · S3" },
  { k: "DATA", v: "Spark · Delta Lake · Polars · dbt" },
  { k: "STREAMING", v: "Kafka · Kinesis · Step Functions" },
  { k: "BACKEND", v: "FastAPI · Flask · Spring Boot" },
  { k: "LANG", v: "Python · Java · TypeScript · SQL" },
  { k: "DB", v: "Snowflake · Redshift · Postgres" },
  { k: "DEVOPS", v: "Docker · GitHub Actions" },
]

// Deterministic seeded value: today's date → uniform sample in [2M, 20M].
// FNV-1a hash + xorshift mix, coerced to unsigned 32-bit at every step
// (JS bitwise ops are signed, so `>>> 0` is required before division).
function tokenUsageForToday(): { value: number } {
  const d = new Date()
  const seed = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  let h = 2166136261 >>> 0
  for (let i = 0; i < seed.length; i++) {
    h = (h ^ seed.charCodeAt(i)) >>> 0
    h = Math.imul(h, 16777619) >>> 0
  }
  h = (h ^ (h >>> 13)) >>> 0
  h = Math.imul(h, 1274126177) >>> 0
  h = (h ^ (h >>> 16)) >>> 0
  const norm = h / 0x1_0000_0000 // 0..1, uniform
  const value = Math.round(2_000_000 + norm * 18_000_000)
  return { value }
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) {
    const v = n / 1_000_000
    return `${v.toFixed(v >= 10 ? 1 : 2)}M`
  }
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const [tokens, setTokens] = useState<{ value: number } | null>(null)

  useEffect(() => {
    setMounted(true)
    setTokens(tokenUsageForToday())
  }, [])

  const tokenLabel = tokens ? formatCompact(tokens.value) : "—"
  const dailyPct = tokens ? Math.round(((tokens.value - 2_000_000) / 18_000_000) * 100) : 0

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Top eyebrow */}
        <div
          className={`flex items-center gap-3 mb-10 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
        >
          <div className="flex items-center gap-2 mono-tag">
            <Cpu className="w-3 h-3 text-cyan" />
            <span>OPEN TO RELOCATION · SANTA CLARA, CA</span>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left - editorial wordmark + headline */}
          <div
            className={`lg:col-span-7 transition-all duration-700 delay-100 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
            }`}
          >
            <p className="hud-label mb-6">[ 01 / IDENTITY ]</p>
            <h1 className="font-display text-display-lg font-light leading-[0.92] tracking-[-0.04em]">
              <span className="block text-foam-grad">YINGQIANG</span>
              <span className="block text-cyan-grad font-medium">YUAN</span>
            </h1>

            <div className="mt-6 flex items-center gap-4">
              <div className="h-px flex-1 max-w-[6rem] bg-gradient-to-r from-cyan to-transparent" />
              <span className="font-mono text-[11px] tracking-[0.36em] text-cyan uppercase">
                AI DEVELOPER · DATA ENGINEER
              </span>
            </div>

            <p className="mt-8 text-lg sm:text-xl text-ash max-w-xl leading-relaxed">
              Building <span className="text-foam">LLM-powered systems</span> that
              solve real business problems — from{" "}
              <span className="text-cyan">agentic applications</span> and{" "}
              <span className="text-cyan">retrieval-augmented generation</span>{" "}
              to <span className="text-violet">LLM evaluation infrastructure</span> on AWS.
            </p>

            {/* Hero CTA — Talk to AI Twin (highlighted) */}
            <Link
              href="/chat"
              className="group relative mt-10 block overflow-hidden rounded-2xl shadow-[0_30px_80px_-30px_rgba(91,233,255,0.45)] transition-shadow hover:shadow-[0_30px_100px_-25px_rgba(91,233,255,0.7)]"
            >
              {/* outer halo */}
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(91,233,255,0.9) 0%, rgba(124,92,255,0.9) 50%, rgba(255,79,184,0.85) 100%)",
                  WebkitMask:
                    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  padding: "1.5px",
                  borderRadius: "1rem",
                }}
              />
              {/* shimmer */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
              />
              <div className="relative flex items-center gap-5 rounded-2xl bg-gradient-to-br from-cyan/15 via-violet/10 to-signal/10 backdrop-blur-xl px-6 py-5 transition-all group-hover:from-cyan/25 group-hover:via-violet/15 group-hover:to-signal/15">
                {/* Icon */}
                <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan to-violet shadow-glow-cyan">
                  <Sparkles className="h-5 w-5 text-ink" />
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-mint opacity-80 animate-ping" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mint" />
                  </span>
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] tracking-[0.32em] text-cyan uppercase">
                      ◇ AI TWIN
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.32em] text-mint uppercase">
                      LIVE
                    </span>
                  </div>
                  <h3 className="mt-1 font-display text-xl sm:text-2xl text-foam tracking-tight leading-tight">
                    TALK TO MY <span className="text-cyan-grad font-medium">AI TWIN</span>
                  </h3>
                  <p className="mt-1 text-sm text-ash leading-snug">
                    Explore my experience, projects, and discover what makes me different.
                  </p>
                </div>

                <ArrowUpRight className="hidden sm:block h-6 w-6 text-foam transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </Link>

            {/* secondary channels */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href="mailto:yingqiang.yuan@gmail.com"
                className="chip-button-ghost"
              >
                <Mail className="w-3.5 h-3.5" />
                EMAIL
              </a>
              <a
                href="https://github.com/YingqiangYuan"
                target="_blank"
                rel="noopener noreferrer"
                className="chip-button-ghost"
              >
                <Github className="w-3.5 h-3.5" />
                GITHUB
              </a>
              <a
                href="https://www.linkedin.com/in/yingqiang-yuan"
                target="_blank"
                rel="noopener noreferrer"
                className="chip-button-ghost"
              >
                <Linkedin className="w-3.5 h-3.5" />
                LINKEDIN
              </a>
            </div>
          </div>

          {/* Right - portrait + token usage card */}
          <div
            className={`lg:col-span-5 transition-all duration-700 delay-200 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
            }`}
          >
            <div className="relative group flex flex-col gap-4">
              {/* corner brackets */}
              <div className="absolute -inset-3 pointer-events-none opacity-60">
                <div className="absolute top-0 left-0 w-5 h-5 border-l border-t border-cyan/60" />
                <div className="absolute top-0 right-0 w-5 h-5 border-r border-t border-cyan/60" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-l border-b border-cyan/60" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-r border-b border-cyan/60" />
              </div>

              {/* Portrait card */}
              <div className="relative glass-strong rounded-2xl overflow-hidden p-5 panel-edge">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-signal/80" />
                    <span className="h-2 w-2 rounded-full bg-amber/80" />
                    <span className="h-2 w-2 rounded-full bg-mint/80" />
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.3em] text-ash uppercase">
                    NODE://YINGQIANG-01
                  </span>
                </div>

                <div className="relative rounded-xl overflow-hidden border border-cyan/15">
                  <div className="absolute inset-0 bg-grid-fine opacity-25 pointer-events-none z-10" />
                  <Image
                    src="/images/profile.png"
                    alt="Yingqiang Yuan"
                    width={640}
                    height={640}
                    className="relative w-full h-72 sm:h-80 object-cover"
                    priority
                  />
                  {/* subtle bottom gradient for legibility */}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-substrate/85 to-transparent z-10" />
                  {/* HUD overlay */}
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-2 py-1 rounded-md bg-ink/60 backdrop-blur border border-cyan/30">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75 animate-ping" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan" />
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.3em] text-cyan uppercase">
                      AGENT · ACTIVE
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 z-20 font-mono text-[9px] text-ash tracking-[0.3em] uppercase">
                    SCU · MS CS · 2025
                  </div>
                </div>
              </div>

              {/* Token Usage card */}
              <div className="relative glass-strong rounded-2xl p-5 panel-edge">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="hud-label">TOKEN USAGE / 24H</span>
                  </div>
                  <span className="flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-mint opacity-75 animate-ping" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-mint" />
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.3em] text-mint uppercase">
                      LIVE
                    </span>
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-3">
                  <span className="font-display text-5xl sm:text-6xl font-light tracking-tight text-foam-grad tabular-nums">
                    {tokenLabel}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.24em] text-cyan uppercase">
                    tokens
                  </span>
                </div>

                {/* progress bar */}
                <div className="mt-4 h-1.5 rounded-full bg-substrate overflow-hidden border border-cyan/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan via-violet to-signal transition-all duration-700"
                    style={{ width: `${Math.max(6, dailyPct)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resume skill ticker */}
        <div className="mt-16 relative overflow-hidden border-y border-cyan/10 py-3">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent z-10 pointer-events-none" />
          <div className="flex gap-12 whitespace-nowrap animate-ticker font-mono text-[11px] tracking-[0.32em] uppercase">
            {Array.from({ length: 2 }).map((_, dup) => (
              <div key={dup} className="flex gap-12 shrink-0 pr-12">
                {SKILL_GROUPS.map((tag) => (
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
