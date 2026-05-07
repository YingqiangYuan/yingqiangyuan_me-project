import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Bebas_Neue, Source_Sans_3 } from "next/font/google"
import { generateSEOMetadata } from "@/lib/seo/generateMetadata"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas"
})
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  weight: ["300", "400", "500", "600", "700"]
})

// 根布局的默认元数据（会被页面级元数据覆盖）
export const metadata: Metadata = {
  ...generateSEOMetadata({
    title: "John Doe - Solution Architect & Builder",
    description: "Personal portfolio of John Doe, a Data/AI Architect specializing in open source solutions and enterprise architecture.",
    keywords: ["Data Architect", "AI Architect", "Open Source", "Enterprise"],
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable} ${sourceSans.variable}`}>
      <body className={`${sourceSans.className} antialiased`}>{children}</body>
    </html>
  )
}
