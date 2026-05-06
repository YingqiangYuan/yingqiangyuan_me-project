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
        // Option B: Bold Black & White + Vibrant Accent
        primary: {
          DEFAULT: "#000000",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#18181B",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#3B82F6", // Electric blue
          foreground: "#FFFFFF",
          light: "#60A5FA",
          dark: "#2563EB",
        },
        background: {
          DEFAULT: "#FFFFFF",
          dark: "#000000",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#0A0A0A",
        },
        muted: {
          DEFAULT: "#F4F4F5",
          foreground: "#71717A",
          dark: "#18181B",
        },
        border: {
          DEFAULT: "#000000",
          dark: "#FFFFFF",
        },
        // Legacy colors for compatibility
        "text-primary": "#000000",
        "text-secondary": "#52525B",
        highlight: "#3B82F6",
        "cta-button": "#3B82F6",
        "regular-button": "#000000",
        contrast: "#3B82F6",
        // shadcn/ui compatibility
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        display: ["var(--font-bebas)", "sans-serif"],
        body: ["var(--font-source-sans)", "sans-serif"],
        heading: ["var(--font-bebas)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(4rem, 15vw, 12rem)", { lineHeight: "0.9", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(3rem, 10vw, 8rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(2rem, 6vw, 4rem)", { lineHeight: "1", letterSpacing: "-0.01em" }],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-left": "slideInLeft 0.6s ease-out",
        "slide-in-right": "slideInRight 0.6s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-30px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(30px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        none: "0px",
      },
      boxShadow: {
        "bold": "8px 8px 0px #000000",
        "bold-sm": "4px 4px 0px #000000",
        "bold-accent": "8px 8px 0px #3B82F6",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
