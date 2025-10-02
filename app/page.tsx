"use client"

import { useState, useEffect } from "react"
import { IntroAnimation } from "@/components/intro-animation"
import { IntroScreen } from "@/components/intro-screen"
import { GameLayout } from "@/components/game-layout"
import { VariantSelector } from "@/components/ui-variants/variant-selector"
import { type Player, createDefaultPlayer, migratePlayerData } from "@/lib/player"
import { NotificationProvider } from "@/components/notification-provider"
import { LevelUpProvider } from "@/components/level-up-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { ThemeProviderEnhanced, useThemeEnhanced } from "@/components/theme-provider-enhanced"

function AppContent() {
  const [introCompleted, setIntroCompleted] = useState(false)
  const [player, setPlayer] = useState<Player | null>(null)
  const [showIntro, setShowIntro] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const { setTheme } = useThemeEnhanced()

  // Load player data from localStorage
  useEffect(() => {
    try {
      const skipIntro = localStorage.getItem("skipIntro")
      if (skipIntro) {
        setIntroCompleted(true)
        setShowIntro(false)
      }

      const savedPlayer = localStorage.getItem("player")
      if (savedPlayer) {
        const parsedPlayer = JSON.parse(savedPlayer)
        const migratedPlayer = migratePlayerData(parsedPlayer)
        setPlayer(migratedPlayer)
      }
    } catch (error) {
      console.error("Error loading player data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save player data to localStorage whenever it changes
  useEffect(() => {
    if (player) {
      try {
        localStorage.setItem("player", JSON.stringify(player))
      } catch (error) {
        console.error("Error saving player data:", error)
      }
    }
  }, [player])

  const handleIntroComplete = () => {
    setIntroCompleted(true)
    try {
      localStorage.setItem("skipIntro", "true")
    } catch (error) {
      console.error("Error setting localStorage:", error)
    }
  }

  const handlePlayerCreation = (name: string) => {
    try {
      const newPlayer = createDefaultPlayer(name)
      setPlayer(newPlayer)
    } catch (error) {
      console.error("Error creating player:", error)
    }
  }

  const handleThemeSelect = (variant: any) => {
    setTheme(variant.id)
  }

  // Show loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-primary font-audiowide text-xl">Loading...</div>
      </div>
    )
  }

  // Show intro animation
  if (showIntro && !introCompleted) {
    return <IntroAnimation onComplete={handleIntroComplete} />
  }

  // Show character creation
  if (!player) {
    return <IntroScreen onPlayerCreated={handlePlayerCreation} />
  }

  // Show main game
  return (
    <NotificationProvider>
      <LevelUpProvider>
        <GameLayout player={player} setPlayer={setPlayer} />
        <VariantSelector onSelect={handleThemeSelect} />
      </LevelUpProvider>
    </NotificationProvider>
  )
}

export default function Page() {
  return (
    <ErrorBoundary>
      <ThemeProviderEnhanced>
        <AppContent />
      </ThemeProviderEnhanced>
    </ErrorBoundary>
  )
}
