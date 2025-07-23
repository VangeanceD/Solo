import type React from "react"
import type { Metadata } from "next"
import { Inter, Orbitron, Rajdhani } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
  weight: ["400", "700", "900"],
})

const rajdhani = Rajdhani({
  subsets: ["latin"],
  variable: "--font-rajdhani",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Arise Hunter Protocol - RPG Life Gamification",
  description:
    "Transform your life into an epic RPG adventure. Complete quests, level up, and become the hero of your own story.",
  keywords: ["RPG", "gamification", "productivity", "self-improvement", "life goals"],
  authors: [{ name: "Arise Hunter Protocol" }],
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable} ${rajdhani.variable}`}>
      <body className="font-inter antialiased bg-black text-white overflow-x-hidden">{children}</body>
    </html>
  )
}
