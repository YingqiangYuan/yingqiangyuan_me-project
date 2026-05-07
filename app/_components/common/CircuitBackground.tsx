"use client"

export default function CircuitBackground({
  variant = "full",
  showScan = true,
}: {
  variant?: "full" | "subtle"
  showScan?: boolean
}) {
  const opacity = variant === "subtle" ? 0.45 : 1

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink"
      style={{ opacity }}
    >
      {/* Layer 1 — radial color mesh */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60rem 42rem at 8% -8%, rgba(91,233,255,0.18), transparent 60%)," +
            "radial-gradient(48rem 36rem at 100% 6%, rgba(124,92,255,0.18), transparent 60%)," +
            "radial-gradient(40rem 32rem at 50% 110%, rgba(255,79,184,0.10), transparent 65%)",
        }}
      />

      {/* Layer 2 — fine grid */}
      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(125,200,255,0.06) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(125,200,255,0.06) 1px, transparent 1px)",
          backgroundSize: "44px 44px, 44px 44px",
          backgroundPosition: "center center",
          maskImage:
            "radial-gradient(ellipse 90% 80% at 50% 30%, #000 55%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 80% at 50% 30%, #000 55%, transparent 100%)",
        }}
      />

      {/* Layer 3 — PCB chip pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.55] animate-drift"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="pcb"
            width="220"
            height="220"
            patternUnits="userSpaceOnUse"
          >
            {/* horizontal traces */}
            <path
              d="M0 40 H80 L100 60 H220"
              stroke="rgba(91,233,255,0.22)"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M0 120 H60 L80 100 H180 L200 120 H220"
              stroke="rgba(124,92,255,0.18)"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M0 180 H120 L140 200 H220"
              stroke="rgba(91,233,255,0.14)"
              strokeWidth="1"
              fill="none"
            />
            {/* vertical traces */}
            <path
              d="M40 0 V80 L60 100 V220"
              stroke="rgba(124,92,255,0.14)"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M180 0 V60 L160 80 V220"
              stroke="rgba(91,233,255,0.14)"
              strokeWidth="1"
              fill="none"
            />
            {/* solder pads */}
            <circle cx="40" cy="80" r="2" fill="rgba(91,233,255,0.55)" />
            <circle cx="60" cy="100" r="1.5" fill="rgba(124,92,255,0.55)" />
            <circle cx="180" cy="60" r="2" fill="rgba(91,233,255,0.55)" />
            <circle cx="160" cy="80" r="1.5" fill="rgba(255,79,184,0.45)" />
            <circle cx="100" cy="60" r="1.5" fill="rgba(91,233,255,0.4)" />
            <circle cx="200" cy="120" r="1.5" fill="rgba(124,92,255,0.4)" />
            <circle cx="140" cy="200" r="2" fill="rgba(91,233,255,0.35)" />
            {/* tiny chip rectangles */}
            <rect
              x="86"
              y="146"
              width="22"
              height="12"
              fill="none"
              stroke="rgba(91,233,255,0.25)"
            />
            <rect
              x="20"
              y="200"
              width="10"
              height="6"
              fill="none"
              stroke="rgba(124,92,255,0.25)"
            />
          </pattern>
          <radialGradient id="pcbMask" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="70%" stopColor="white" stopOpacity="0.3" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="pcbMaskApply">
            <rect width="100%" height="100%" fill="url(#pcbMask)" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#pcb)"
          mask="url(#pcbMaskApply)"
        />
      </svg>

      {/* Layer 4 — soft floating orbs */}
      <div
        className="absolute -top-32 -left-32 h-[36rem] w-[36rem] rounded-full blur-3xl opacity-50 animate-float-slow"
        style={{
          background:
            "radial-gradient(circle, rgba(91,233,255,0.35) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[40rem] w-[40rem] rounded-full blur-3xl opacity-50 animate-float-slow"
        style={{
          background:
            "radial-gradient(circle, rgba(124,92,255,0.32) 0%, transparent 60%)",
          animationDelay: "2s",
        }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-30 animate-float-slow"
        style={{
          background:
            "radial-gradient(circle, rgba(255,79,184,0.25) 0%, transparent 60%)",
          animationDelay: "4s",
        }}
      />

      {/* Layer 5 — slow scanline */}
      {showScan && (
        <div
          className="absolute inset-x-0 h-px animate-scan"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(91,233,255,0.55), transparent)",
            boxShadow: "0 0 24px rgba(91,233,255,0.55)",
          }}
        />
      )}

      {/* Layer 6 — grain */}
      <div
        className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.6  0 0 0 0 0.7  0 0 0 0 0.9  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Layer 7 — vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  )
}
