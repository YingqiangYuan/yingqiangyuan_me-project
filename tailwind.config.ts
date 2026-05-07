import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neural Fabric palette
        ink: "#04060B",          // deep substrate
        substrate: "#070B14",    // panel base
        wafer: "#0B1322",        // raised glass
        trace: "#13203A",        // PCB trace
        foam: "#E7EEF7",         // primary text
        ash: "#8597B0",          // muted text
        slate: "#3A4860",        // disabled
        cyan: {
          DEFAULT: "#5BE9FF",
          soft: "#7FF1FF",
          deep: "#0FB3D2",
        },
        violet: {
          DEFAULT: "#7C5CFF",
          soft: "#A48BFF",
          deep: "#4C2FE0",
        },
        mint: "#9CFF7B",
        signal: "#FF4FB8",
        amber: "#FFB347",

        // Compatibility / shadcn
        primary: {
          DEFAULT: "#5BE9FF",
          foreground: "#04060B",
        },
        secondary: {
          DEFAULT: "#0B1322",
          foreground: "#E7EEF7",
        },
        accent: {
          DEFAULT: "#5BE9FF",
          foreground: "#04060B",
          light: "#7FF1FF",
          dark: "#0FB3D2",
        },
        background: {
          DEFAULT: "#04060B",
          dark: "#04060B",
        },
        surface: {
          DEFAULT: "#070B14",
          dark: "#070B14",
        },
        muted: {
          DEFAULT: "#0B1322",
          foreground: "#8597B0",
          dark: "#0B1322",
        },
        border: {
          DEFAULT: "rgba(125,200,255,0.12)",
          dark: "rgba(125,200,255,0.16)",
        },
        "text-primary": "#E7EEF7",
        "text-secondary": "#8597B0",
        highlight: "#5BE9FF",
        "cta-button": "#5BE9FF",
        "regular-button": "#0B1322",
        contrast: "#5BE9FF",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "#FF4F6B",
          foreground: "#04060B",
        },
        popover: {
          DEFAULT: "#070B14",
          foreground: "#E7EEF7",
        },
        card: {
          DEFAULT: "#0B1322",
          foreground: "#E7EEF7",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui"],
        heading: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        inter: ["var(--font-body)", "ui-sans-serif", "system-ui"],
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 11vw, 9rem)", { lineHeight: "0.92", letterSpacing: "-0.045em" }],
        "display-lg": ["clamp(2.5rem, 7vw, 5.5rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(1.75rem, 4vw, 3rem)", { lineHeight: "1", letterSpacing: "-0.02em" }],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-in-left": "slideInLeft 0.7s cubic-bezier(.2,.8,.2,1)",
        "slide-in-right": "slideInRight 0.7s cubic-bezier(.2,.8,.2,1)",
        "pulse-dot": "pulseDot 1.6s ease-in-out infinite",
        "scan": "scan 7s linear infinite",
        "float-slow": "floatSlow 14s ease-in-out infinite",
        "drift": "drift 22s linear infinite",
        "ticker": "ticker 32s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(24px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-32px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(32px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.85)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-12px,0)" },
        },
        drift: {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(-40px,-40px,0)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      borderRadius: {
        lg: "14px",
        md: "10px",
        sm: "6px",
        none: "0px",
      },
      boxShadow: {
        "glass": "0 30px 80px -30px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.05)",
        "glass-strong": "0 40px 120px -30px rgba(91,233,255,0.18), 0 0 0 1px rgba(125,200,255,0.10), inset 0 1px 0 rgba(255,255,255,0.06)",
        "glow-cyan": "0 0 0 1px rgba(91,233,255,0.4), 0 0 32px rgba(91,233,255,0.35)",
        "glow-violet": "0 0 0 1px rgba(124,92,255,0.4), 0 0 32px rgba(124,92,255,0.32)",
        "ring-cyan": "0 0 0 1px rgba(91,233,255,0.55)",
        "bold": "0 30px 80px -30px rgba(0,0,0,0.65)",
        "bold-sm": "0 8px 24px -10px rgba(0,0,0,0.7)",
        "bold-accent": "0 0 0 1px rgba(91,233,255,0.6), 0 0 40px rgba(91,233,255,0.35)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
