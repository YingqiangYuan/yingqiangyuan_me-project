"use client"

import { Mail, Github, Linkedin, ArrowUpRight, MessageSquareCode } from "lucide-react"
import Link from "next/link"

const CHANNELS = [
  {
    label: "EMAIL",
    handle: "yingqiang.yuan@gmail.com",
    icon: Mail,
    href: "mailto:yingqiang.yuan@gmail.com",
    accent: "from-cyan/40 to-cyan/10 text-cyan",
    primary: true,
  },
  {
    label: "LINKEDIN",
    handle: "/in/yingqiang-yuan",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/yingqiang-yuan",
    accent: "from-violet/40 to-violet/10 text-violet",
    primary: false,
  },
  {
    label: "GITHUB",
    handle: "@yingqiang-yuan",
    icon: Github,
    href: "https://github.com/YingqiangYuan",
    accent: "from-foam/30 to-foam/5 text-foam",
    primary: false,
  },
]

export default function ContactSection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Header column */}
          <div className="lg:col-span-5">
            <p className="hud-label mb-3">[ 03 / GET IN TOUCH ]</p>
            <h2 className="font-display text-display-md font-light leading-tight">
              <span className="text-foam-grad">LET&apos;S</span>{" "}
              <span className="text-cyan-grad font-medium">BUILD TOGETHER</span>
            </h2>
            <p className="mt-6 text-ash text-lg leading-relaxed max-w-md">
              I&apos;m a recent <span className="text-foam">MS CS graduate</span>{" "}
              actively looking for{" "}
              <span className="text-cyan">new-grad / full-time roles</span> in
              AI engineering or data engineering. Three internships in,
              shipping production systems on AWS, and ready to bring that
              energy to your team.
            </p>
            <p className="mt-3 mono-tag">
              ✦ OPEN TO RELOCATION · BASED IN SANTA CLARA, CA
            </p>

            <Link
              href="/chat"
              className="mt-8 inline-flex items-center gap-2 chip-button group"
            >
              <MessageSquareCode className="w-3.5 h-3.5" />
              ASK MY AI TWIN FIRST
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Channels column */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CHANNELS.map((c) => {
              const Icon = c.icon
              return (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group relative glass rounded-2xl p-5 panel-edge transition-all hover:-translate-y-1 hover:shadow-glow-cyan"
                >
                  <div
                    className={`inline-flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br ring-1 ring-cyan/20 ${c.accent}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="mt-6 hud-label">{c.label}</div>
                  <div className="mt-1 font-mono text-sm text-foam break-all">
                    {c.handle}
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    {c.primary ? (
                      <span className="font-mono text-[10px] tracking-[0.28em] text-cyan uppercase">
                        ◇ PRIMARY CHANNEL
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] tracking-[0.28em] text-ash uppercase">
                        SECONDARY
                      </span>
                    )}
                    <ArrowUpRight className="w-4 h-4 text-ash group-hover:text-cyan transition-colors" />
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
