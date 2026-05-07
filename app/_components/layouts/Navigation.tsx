"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { NavItem, NavigationProps } from "@/types"

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Chat", href: "/chat" },
]

export default function Navigation({ items = DEFAULT_NAV_ITEMS }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 minimal-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan opacity-70 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan shadow-glow-cyan" />
            </span>
            <div className="leading-tight">
              <div className="font-display text-sm sm:text-base font-medium text-foam tracking-tight">
                Yingqiang<span className="text-cyan"> </span>Yuan
              </div>
              <div className="font-mono text-[9px] tracking-[0.32em] text-ash uppercase hidden sm:block">
                AI DEVELOPER · DATA ENGINEER
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            {items.map((item) => {
              const active = isActive(item.href)
              const isChat = item.href === "/chat"

              if (isChat) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="chip-button group"
                  >
                    <span className="relative flex h-1.5 w-1.5 items-center justify-center">
                      <span className="absolute inset-0 rounded-full bg-cyan animate-pulse-dot" />
                    </span>
                    INITIATE CHAT
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 font-mono text-[11px] tracking-[0.22em] uppercase transition-colors ${
                    active ? "text-cyan" : "text-ash hover:text-foam"
                  }`}
                >
                  {active && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan mr-2 align-middle shadow-glow-cyan" />
                  )}
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-foam hover:text-cyan transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-cyan/10">
            <div className="py-4 space-y-1">
              {items.map((item) => {
                const active = isActive(item.href)
                const isChat = item.href === "/chat"
                if (isChat) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block chip-button text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      INITIATE CHAT
                    </Link>
                  )
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block py-3 px-4 font-mono text-xs uppercase tracking-[0.22em] transition-colors ${
                      active ? "text-cyan" : "text-ash hover:text-foam"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
