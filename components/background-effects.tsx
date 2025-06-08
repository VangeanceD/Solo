"use client"

import { useEffect, useRef } from "react"

export function BackgroundEffects() {
  const particlesRef = useRef<HTMLDivElement>(null)
  const runesRef = useRef<HTMLDivElement>(null)
  const circuitRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    createParticles()
    createRunes()
    createCircuitLines()
  }, [])

  const createParticles = () => {
    if (!particlesRef.current) return

    const container = particlesRef.current
    const particleCount = 30

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.className = "absolute bg-primary/50 rounded-full pointer-events-none"

      // Random size between 1 and 3px
      const size = Math.random() * 2 + 1
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`

      // Random position
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`

      // Random opacity
      particle.style.opacity = `${Math.random() * 0.5 + 0.1}`

      // Animation
      particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`

      container.appendChild(particle)
    }
  }

  const createRunes = () => {
    if (!runesRef.current) return

    const container = runesRef.current
    const runeSymbols = [
      "ᛏ",
      "ᛒ",
      "ᛋ",
      "ᚠ",
      "ᚦ",
      "ᚱ",
      "ᚷ",
      "ᚹ",
      "ᚺ",
      "ᛁ",
      "ᛃ",
      "ᛇ",
      "ᛈ",
      "ᛉ",
      "ᛊ",
      "ᛏ",
      "ᛒ",
      "ᛗ",
      "ᛚ",
      "ᛜ",
      "ᛟ",
      "ᛞ",
    ]
    const runeCount = 20

    for (let i = 0; i < runeCount; i++) {
      const rune = document.createElement("div")
      rune.className = "absolute text-primary/60 text-shadow-sm"

      // Random symbol
      rune.textContent = runeSymbols[Math.floor(Math.random() * runeSymbols.length)]

      // Random position
      rune.style.left = `${Math.random() * 100}%`
      rune.style.top = `${Math.random() * 100}%`

      // Random size
      const size = Math.random() * 1.5 + 1
      rune.style.fontSize = `${size}rem`

      // Random rotation
      rune.style.transform = `rotate(${Math.random() * 360}deg)`

      container.appendChild(rune)
    }
  }

  const createCircuitLines = () => {
    if (!circuitRef.current) return

    const container = circuitRef.current
    const lineCount = 30

    for (let i = 0; i < lineCount; i++) {
      const line = document.createElement("div")
      line.className = "absolute bg-primary/50 shadow-primary/50"

      // Random position
      const startX = Math.random() * 100
      const startY = Math.random() * 100

      // Random size
      const width = Math.random() * 100 + 50
      const height = 1

      // Random rotation
      const rotation = Math.random() * 360

      line.style.left = `${startX}%`
      line.style.top = `${startY}%`
      line.style.width = `${width}px`
      line.style.height = `${height}px`
      line.style.transform = `rotate(${rotation}deg)`

      container.appendChild(line)
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,168,255,0.15),transparent_100%)]"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-float"></div>
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-primary to-transparent animate-float"></div>
      <div
        className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-float"
        style={{ animationDelay: "1.5s" }}
      ></div>
      <div
        className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-primary to-transparent animate-float"
        style={{ animationDelay: "1.5s" }}
      ></div>

      <div ref={particlesRef} className="particles absolute inset-0 pointer-events-none z-0"></div>
      <div ref={runesRef} className="rune-container absolute inset-0 pointer-events-none z-0"></div>
      <div ref={circuitRef} className="circuit-container absolute inset-0 pointer-events-none z-0"></div>
    </div>
  )
}
