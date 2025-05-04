import type React from "react"
import type { Metadata } from "next"
import { Rajdhani, Orbitron, Inter } from 'next/font/google'
import localFont from "next/font/local"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

// Define fonts using next/font
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" })

const rajdhani = Rajdhani({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rajdhani",
})

const orbitron = Orbitron({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-orbitron",
})

// For fonts not available in Google Fonts, we can use local fonts or fallbacks
const audiowide = localFont({
  src: "../public/fonts/fallback-fonts.woff2", // This is a fallback, we'll use system fonts
  variable: "--font-audiowide",
})

export const metadata: Metadata = {
  title: "ARISE: Hunter Protocol",
  description: "A real-life RPG system for self-improvement",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${rajdhani.variable} ${orbitron.variable} ${audiowide.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
