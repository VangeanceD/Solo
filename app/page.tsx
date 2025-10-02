"use client"

import { useState, useEffect } from "react"
import { IntroAnimation } from "@/components/intro-animation"
import { IntroScreen } from "@/components/intro-screen"
import { GameLayout } from "@/components/game-layout"
import { VariantSelector } from "@/components/ui-variants/variant-selector"
import { AuthScreen } from "@/components/auth/auth-screen"
import { type Player, createDefaultPlayer, migratePlayerData } from "@/lib/player"
import { supabase } from "@/lib/supabase"
import { NotificationProvider } from "@/components/notification-provider"
import { LevelUpProvider } from "@/components/level-up-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { ThemeProviderEnhanced, useThemeEnhanced } from "@/components/theme-provider-enhanced"
import type { User } from "@supabase/supabase-js"

function AppContent() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [introCompleted, setIntroCompleted] = useState(false)
  const [player, setPlayer] = useState<Player | null>(null)
  const [showIntro, setShowIntro] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const { setTheme } = useThemeEnhanced()

  // Check authentication status
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load player data when user is authenticated
  useEffect(() => {
    if (!user) {
      setIsLoading(false)
      return
    }

    const loadPlayerData = async () => {
      try {
        // Try to load from Supabase first
        const { data, error } = await supabase.from("players").select("*").eq("user_id", user.id).single()

        if (data) {
          const migratedPlayer = migratePlayerData(data.player_data)
          setPlayer(migratedPlayer)
        } else {
          // Check localStorage for migration
          const localData = localStorage.getItem("player")
          if (localData) {
            const parsedPlayer = JSON.parse(localData)
            const migratedPlayer = migratePlayerData(parsedPlayer)

            // Save to Supabase
            await supabase.from("players").insert({
              user_id: user.id,
              player_data: migratedPlayer,
            })

            setPlayer(migratedPlayer)
            localStorage.removeItem("player") // Clean up
          }
        }

        const skipIntro = localStorage.getItem("skipIntro")
        if (skipIntro) {
          setIntroCompleted(true)
          setShowIntro(false)
        }
      } catch (error) {
        console.error("Error loading player data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPlayerData()
  }, [user])

  // Save player data to Supabase whenever it changes
  useEffect(() => {
    if (!user || !player) return

    const savePlayerData = async () => {
      try {
        await supabase.from("players").upsert({
          user_id: user.id,
          player_data: player,
          updated_at: new Date().toISOString(),
        })
      } catch (error) {
        console.error("Error saving player data:", error)
      }
    }

    // Debounce saves
    const timer = setTimeout(savePlayerData, 1000)
    return () => clearTimeout(timer)
  }, [player, user])

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
      const username = user?.user_metadata?.username || user?.email?.split("@")[0] || name
      const newPlayer = createDefaultPlayer(username)
      setPlayer(newPlayer)
    } catch (error) {
      console.error("Error creating player:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setPlayer(null)
      setIntroCompleted(false)
      setShowIntro(true)
      localStorage.removeItem("skipIntro")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  const handleThemeSelect = (variant: any) => {
    setTheme(variant.id)
  }

  // Show loading while checking auth
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-primary font-audiowide text-xl">Loading...</div>
      </div>
    )
  }

  // Show auth screen if not logged in
  if (!user) {
    return <AuthScreen />
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
        <GameLayout player={player} setPlayer={setPlayer} onLogout={handleLogout} />
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
