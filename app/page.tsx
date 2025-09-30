"use client"

import { useState, useEffect } from "react"
import { IntroAnimation } from "@/components/intro-animation"
import { IntroScreen } from "@/components/intro-screen"
import { GameLayout } from "@/components/game-layout"
import { VariantSelector } from "@/components/ui-variants/variant-selector"
import { type Player, createDefaultPlayer, migratePlayerData } from "@/lib/player"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { NotificationProvider } from "@/components/notification-provider"
import { LevelUpProvider } from "@/components/level-up-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { ThemeProviderEnhanced } from "@/components/theme-provider-enhanced"

export default function Page() {
  const [introCompleted, setIntroCompleted] = useState(false)
  const [player, setPlayer] = useLocalStorage<Player | null>("player", null)
  const [showIntro, setShowIntro] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const skipIntro = localStorage.getItem("skipIntro")
      if (skipIntro) {
        setIntroCompleted(true)
        setShowIntro(false)
      }

      const existingPlayerData = localStorage.getItem("player")
      if (existingPlayerData) {
        try {
          const parsedPlayer = JSON.parse(existingPlayerData)
          const migratedPlayer = migratePlayerData(parsedPlayer)
          setPlayer(migratedPlayer)
        } catch (migrationError) {
          console.error("Error migrating player data:", migrationError)
          localStorage.removeItem("player")
        }
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

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

  const handleLogout = () => {
    try {
      localStorage.removeItem("player")
      localStorage.removeItem("skipIntro")
      setPlayer(null)
      setIntroCompleted(false)
      setShowIntro(true)
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-primary font-audiowide text-xl">Loading...</div>
      </div>
    )
  }

  if (showIntro && !introCompleted) {
    return <IntroAnimation onComplete={handleIntroComplete} />
  }

  if (!player) {
    return <IntroScreen onPlayerCreated={handlePlayerCreation} />
  }

  return (
    <ErrorBoundary>
      <ThemeProviderEnhanced>
        <NotificationProvider>
          <LevelUpProvider>
            <GameLayout player={player} setPlayer={setPlayer} onLogout={handleLogout} />
            <VariantSelector
              onSelect={(variant) => {
                console.log("Selected variant:", variant.name)
              }}
            />
          </LevelUpProvider>
        </NotificationProvider>
      </ThemeProviderEnhanced>
    </ErrorBoundary>
  )
}
