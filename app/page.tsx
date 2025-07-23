"use client"

import { useState, useEffect } from "react"
import { IntroAnimation } from "@/components/intro-animation"
import { IntroScreen } from "@/components/intro-screen"
import { GameLayout } from "@/components/game-layout"
import { SyncSetupModal } from "@/components/sync-setup-modal"
import { type Player, createDefaultPlayer, migratePlayerData } from "@/lib/player"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { usePlayerSync } from "@/hooks/use-player-sync"
import { NotificationProvider, useNotification } from "@/components/notification-provider"
import { LevelUpProvider } from "@/components/level-up-provider"
import { ErrorBoundary } from "@/components/error-boundary"

function AppContent() {
  const [introCompleted, setIntroCompleted] = useState(false)
  const [player, setPlayer] = useLocalStorage<Player | null>("player", null)
  const [showIntro, setShowIntro] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [showSyncSetup, setShowSyncSetup] = useState(false)
  const { syncToCloud, syncFromCloud, updateConfiguration, isSyncing, isConfigured } = usePlayerSync()
  const { addNotification } = useNotification()

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if we should skip intro animation
        const skipIntro = localStorage.getItem("skipIntro")
        if (skipIntro) {
          setIntroCompleted(true)
          setShowIntro(false)
        }

        // Check for existing player data and migrate if needed
        const existingPlayerData = localStorage.getItem("player")
        if (existingPlayerData) {
          try {
            const parsedPlayer = JSON.parse(existingPlayerData)
            const migratedPlayer = migratePlayerData(parsedPlayer)
            setPlayer(migratedPlayer)

            // Try to sync from cloud if configured
            if (isConfigured) {
              const cloudResult = await syncFromCloud()
              if (cloudResult.success && cloudResult.data) {
                const cloudPlayer = migratePlayerData(cloudResult.data)
                setPlayer(cloudPlayer)
                addNotification("Data synced from cloud!", "success")
              }
            } else {
              // Show sync setup if not skipped and has player data
              const setupSkipped = localStorage.getItem("sync_setup_skipped")
              if (!setupSkipped) {
                setTimeout(() => setShowSyncSetup(true), 1000)
              }
            }
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
    }

    initializeApp()
  }, [syncFromCloud, addNotification, isConfigured])

  // Auto-sync player data when it changes
  useEffect(() => {
    if (player && !isSyncing && isConfigured) {
      // Debounce the sync to avoid too many requests
      const timeoutId = setTimeout(() => {
        syncToCloud(player)
      }, 2000)

      return () => clearTimeout(timeoutId)
    }
  }, [player, syncToCloud, isSyncing, isConfigured])

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

      // Show sync setup for new players if not configured
      const setupSkipped = localStorage.getItem("sync_setup_skipped")
      if (!setupSkipped && !isConfigured) {
        setTimeout(() => setShowSyncSetup(true), 1000)
      }
    } catch (error) {
      console.error("Error creating player:", error)
    }
  }

  const handlePlayerUpdate = (updatedPlayer: Player) => {
    setPlayer(updatedPlayer)
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

  const handleSyncSetupComplete = (setupData: { supabaseUrl: string; supabaseKey: string }) => {
    updateConfiguration()
    addNotification("Cloud sync enabled! Your data will now sync across devices.", "success")

    // Sync current player data to cloud
    if (player) {
      setTimeout(() => {
        syncToCloud(player)
      }, 1000)
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
    <>
      <GameLayout player={player} setPlayer={handlePlayerUpdate} onLogout={handleLogout} />
      <SyncSetupModal
        show={showSyncSetup}
        onClose={() => setShowSyncSetup(false)}
        onSetupComplete={handleSyncSetupComplete}
      />
    </>
  )
}

export default function Page() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <LevelUpProvider>
          <AppContent />
        </LevelUpProvider>
      </NotificationProvider>
    </ErrorBoundary>
  )
}
