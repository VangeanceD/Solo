"use client"

import { useState, useEffect } from "react"
import { GameLayout } from "@/components/game-layout"
import { IntroScreen } from "@/components/intro-screen"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { createDefaultPlayer, type Player } from "@/lib/player"
import { usePlayerSync } from "@/hooks/use-player-sync"
import { ErrorBoundary } from "@/components/error-boundary"
import { NotificationProvider } from "@/components/notification-provider"
import { LevelUpProvider } from "@/components/level-up-provider"

export default function Home() {
  const [player, setPlayer] = useLocalStorage<Player>("player", createDefaultPlayer())
  const [showIntro, setShowIntro] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { loadFromCloud, markUnsyncedChanges, isConfigured } = usePlayerSync()

  // Initialize the app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if this is a first-time user
        const hasSeenIntro = localStorage.getItem("hasSeenIntro")

        if (!hasSeenIntro) {
          setShowIntro(true)
          localStorage.setItem("hasSeenIntro", "true")
        }

        // Try to load from cloud if configured
        if (isConfigured) {
          const cloudPlayer = await loadFromCloud()
          if (cloudPlayer) {
            setPlayer(cloudPlayer)
          }
        }
      } catch (error) {
        console.error("Failed to initialize app:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [isConfigured, loadFromCloud, setPlayer])

  const handlePlayerUpdate = (updatedPlayer: Player) => {
    setPlayer(updatedPlayer)
    markUnsyncedChanges()
  }

  const handleIntroComplete = (playerName: string) => {
    const newPlayer = {
      ...createDefaultPlayer(),
      name: playerName,
    }
    setPlayer(newPlayer)
    setShowIntro(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary font-orbitron">Initializing Hunter Protocol...</p>
        </div>
      </div>
    )
  }

  if (showIntro) {
    return <IntroScreen onComplete={handleIntroComplete} />
  }

  return (
    <ErrorBoundary>
      <NotificationProvider>
        <LevelUpProvider>
          <GameLayout player={player} onPlayerUpdate={handlePlayerUpdate} />
        </LevelUpProvider>
      </NotificationProvider>
    </ErrorBoundary>
  )
}
