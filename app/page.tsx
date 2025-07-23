"use client"

import { useState, useEffect } from "react"
import { IntroScreen } from "@/components/intro-screen"
import { GameLayout } from "@/components/game-layout"
import { ErrorBoundary } from "@/components/error-boundary"
import { NotificationProvider } from "@/components/notification-provider"
import { LevelUpProvider } from "@/components/level-up-provider"
import { BackgroundEffects } from "@/components/background-effects"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { createDefaultPlayer, type Player } from "@/lib/player"
import { usePlayerSync } from "@/hooks/use-player-sync"

export default function Home() {
  const [player, setPlayer] = useLocalStorage<Player>("player", createDefaultPlayer())
  const [showIntro, setShowIntro] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const { syncToCloud, loadFromCloud, manualSync, syncStatus, isConfigured } = usePlayerSync()

  // Initialize app and check for cloud data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if this is the first time opening the app
        const hasSeenIntro = localStorage.getItem("hasSeenIntro")

        if (!hasSeenIntro && !player.name) {
          setShowIntro(true)
          setIsLoading(false)
          return
        }

        // Try to load from cloud if configured
        if (isConfigured) {
          const cloudData = await loadFromCloud()
          if (cloudData && cloudData.lastUpdated) {
            // Compare timestamps to see which is newer
            const localTime = new Date(player.lastUpdated || 0).getTime()
            const cloudTime = new Date(cloudData.lastUpdated).getTime()

            if (cloudTime > localTime) {
              setPlayer(cloudData)
            }
          }
        }
      } catch (error) {
        console.error("Failed to initialize app:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, []) // Empty dependency array to run only once

  // Auto-sync when player data changes (but not on initial load)
  useEffect(() => {
    if (!isLoading && player.name && player.lastUpdated) {
      syncToCloud(player)
    }
  }, [player, syncToCloud, isLoading])

  const handleIntroComplete = (playerName: string) => {
    const newPlayer = createDefaultPlayer(playerName)
    setPlayer(newPlayer)
    setShowIntro(false)
    localStorage.setItem("hasSeenIntro", "true")
  }

  const handleUpdatePlayer = (updates: Partial<Player>) => {
    setPlayer((prev) => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString(),
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="loading-spinner mx-auto"></div>
          <p className="text-primary font-orbitron">Initializing Hunter Protocol...</p>
        </div>
      </div>
    )
  }

  if (showIntro) {
    return (
      <ErrorBoundary>
        <BackgroundEffects />
        <IntroScreen onComplete={handleIntroComplete} />
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <NotificationProvider>
        <LevelUpProvider>
          <BackgroundEffects />
          <GameLayout
            player={player}
            onUpdatePlayer={handleUpdatePlayer}
            syncStatus={syncStatus}
            onManualSync={() => manualSync(player)}
            isSupabaseConfigured={isConfigured}
          />
        </LevelUpProvider>
      </NotificationProvider>
    </ErrorBoundary>
  )
}
