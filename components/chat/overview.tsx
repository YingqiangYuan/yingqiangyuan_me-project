"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles, Cpu, Database, ShieldCheck } from "lucide-react";
import { CDN_ASSETS, METADATA } from "@/lib/constants";

const CAPABILITIES = [
  { icon: Cpu, label: "MODEL OPS" },
  { icon: Database, label: "DATA + RAG" },
  { icon: ShieldCheck, label: "PROD READY" },
];

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-8 w-full"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ delay: 0.15, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="relative panel-edge glass-strong rounded-2xl overflow-hidden">
        {/* HUD strip */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-cyan/10 bg-substrate/50">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-signal/80" />
            <span className="h-2 w-2 rounded-full bg-amber/80" />
            <span className="h-2 w-2 rounded-full bg-mint/80" />
          </div>
          <div className="flex items-center gap-2 mono-tag text-[10px]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan opacity-70 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan" />
            </span>
            <span>NEURAL.CORE / READY</span>
          </div>
          <span className="font-mono text-[10px] tracking-[0.28em] text-ash uppercase hidden sm:inline">
            SESSION 001
          </span>
        </div>

        <div className="px-6 sm:px-10 py-12 flex flex-col items-center text-center">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-cyan/20 blur-2xl" />
            <div className="relative h-24 w-24 rounded-full p-[2px] bg-gradient-to-br from-cyan via-violet to-signal">
              <div className="h-full w-full rounded-full overflow-hidden bg-substrate ring-1 ring-cyan/30">
                <Image
                  src={CDN_ASSETS.PROFILE_PHOTO}
                  alt="John Doe"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover saturate-[0.85]"
                />
              </div>
            </div>
          </div>

          <p className="mt-6 hud-label">[ AI TWIN · BRIEFING ]</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-light leading-tight">
            <span className="text-foam-grad">HI, I&apos;M YINGQIANG&apos;S</span>{" "}
            <span className="text-cyan-grad font-medium">{METADATA.AI_ASSISTANT_NAME}</span>
          </h2>

          <p className="mt-4 text-ash max-w-md leading-relaxed">
            Trained on Yingqiang&apos;s full body of work. Ask me about his
            <span className="text-foam"> projects</span>, the
            <span className="text-cyan"> AI &amp; data systems</span> he&apos;s
            shipped, or anything in between.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            {CAPABILITIES.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-cyan/15"
              >
                <Icon className="w-3 h-3 text-cyan" />
                <span className="font-mono text-[10px] tracking-[0.28em] text-ash uppercase">
                  {label}
                </span>
              </span>
            ))}
          </div>

          <div className="mt-8 inline-flex items-center gap-2 mono-tag">
            <Sparkles className="w-3 h-3 text-cyan" />
            <span>type below or pick a suggestion · enter to transmit</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
