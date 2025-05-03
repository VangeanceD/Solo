"use client"

import { useEffect, useRef } from "react"

export function BackgroundEffects() {
  const particlesRef = useRef<HTMLDivElement>(null)
  const runesRef = useRef<HTMLDivElement>(null)
  const circuitRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    createParticles()
    createRunes()
    createCircuitLines()
    createGrid()
  }, [])

  const createParticles = () => {
    if (!particlesRef.current) return

    const container = particlesRef.current
    const particleCount = 40

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
    const runeCount = 30

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

      // Animation
      rune.style.animation = `float ${Math.random() * 15 + 20}s linear infinite`
      rune.style.opacity = "0"

      // Fade in animation
      setTimeout(() => {
        rune.style.transition = "opacity 2s ease-in-out"
        rune.style.opacity = `${Math.random() * 0.3 + 0.1}`
      }, Math.random() * 3000)

      container.appendChild(rune)
    }
  }

  const createCircuitLines = () => {
    if (!circuitRef.current) return

    const container = circuitRef.current
    const lineCount = 40

    for (let i = 0; i < lineCount; i++) {
      const line = document.createElement("div")
      line.className = "absolute bg-primary/30 shadow-primary/50"

      // Random position
      const startX = Math.random() * 100
      const startY = Math.random() * 100

      // Random size
      const width = Math.random() * 150 + 50
      const height = 1

      // Random rotation
      const rotation = Math.random() * 360

      line.style.left = `${startX}%`
      line.style.top = `${startY}%`
      line.style.width = `${width}px`
      line.style.height = `${height}px`
      line.style.transform = `rotate(${rotation}deg)`

      // Animation
      line.style.opacity = "0"

      // Fade in animation with delay
      setTimeout(() => {
        line.style.transition = "opacity 1.5s ease-in-out"
        line.style.opacity = `${Math.random() * 0.3 + 0.1}`
      }, Math.random() * 2000)

      container.appendChild(line)
    }
  }

  const createGrid = () => {
    if (!gridRef.current) return

    const container = gridRef.current
    const gridSize = 20
    const cellSize = 50

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const gridPoint = document.createElement("div")
        gridPoint.className = "absolute w-1 h-1 bg-primary/20 rounded-full"

        gridPoint.style.left = `${x * cellSize}px`
        gridPoint.style.top = `${y * cellSize}px`

        // Pulse animation with random delay
        gridPoint.style.animation = `pulse 3s ease-in-out ${Math.random() * 3}s infinite`

        container.appendChild(gridPoint)
      }
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,168,255,0.15),transparent_100%)]"></div>

      {/* Animated borders */}
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

      {/* Animated grid */}
      <div ref={gridRef} className="grid-container absolute inset-0 pointer-events-none z-0"></div>

      {/* Particles */}
      <div ref={particlesRef} className="particles absolute inset-0 pointer-events-none z-0"></div>

      {/* Runes */}
      <div ref={runesRef} className="rune-container absolute inset-0 pointer-events-none z-0"></div>

      {/* Circuit lines */}
      <div ref={circuitRef} className="circuit-container absolute inset-0 pointer-events-none z-0"></div>

      {/* Scan effect */}
      <div className="absolute inset-0 pointer-events-none z-0 animate-scan-effect"></div>

      {/* Radial glow at center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,168,255,0.1),transparent_70%)] animate-pulse-slow pointer-events-none"></div>
    </div>
  )
}
