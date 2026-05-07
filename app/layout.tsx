import type React from "react"
import type { Metadata, Viewport } from "next"
import { Unbounded, Manrope, JetBrains_Mono } from "next/font/google"
import { generateSEOMetadata } from "@/lib/seo/generateMetadata"
import "./globals.css"

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
})

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  ...generateSEOMetadata({
    title: "YingQiang Yuan - AI Developer & Data Engineer",
    description: "Personal portfolio of YingQiang Yuan, an AI Developer and Data Engineer specializing in LLM-powered systems, agentic applications, RAG, and enterprise data platforms on AWS.",
    keywords: ["AI Developer", "Data Engineer", "LLM", "RAG", "AWS", "Agentic AI"],
    url: "https://yingqiangyuan.me",
  }),
  generator: 'v0.dev',
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: "#04060B",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`dark ${unbounded.variable} ${manrope.variable} ${jetbrains.variable}`}
    >
      <body className="font-body antialiased bg-ink text-foam selection:bg-cyan/30 selection:text-foam">
        {children}
      </body>
    </html>
  )
}
