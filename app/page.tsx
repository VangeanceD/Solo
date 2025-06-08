"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { IntroAnimation } from "@/components/intro-animation"
import { IntroScreen } from "@/components/intro-screen"
import { GameLayout } from "@/components/game-layout"
import { type Player, createDefaultPlayer } from "@/lib/player"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { NotificationProvider } from "@/components/notification-provider"
import { LevelUpProvider } from "@/components/level-up-provider"

export default function Page() {
  const [introCompleted, setIntroCompleted] = useState(false)
  const [player, setPlayer] = useLocalStorage<Player | null>("player", null)
  const [showIntro, setShowIntro] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if we should skip intro animation
    const skipIntro = localStorage.getItem("skipIntro")
    if (skipIntro) {
      setIntroCompleted(true)
      setShowIntro(false)
    }
  }, [])

  const handleIntroComplete = () => {
    setIntroCompleted(true)
    localStorage.setItem("skipIntro", "true")
  }

  const handlePlayerCreation = (name: string) => {
    const newPlayer = createDefaultPlayer(name)
    setPlayer(newPlayer)
  }

  const handleLogout = () => {
    localStorage.removeItem("skipIntro")
    router.refresh()
  }

  if (showIntro && !introCompleted) {
    return <IntroAnimation onComplete={handleIntroComplete} />
  }

  if (!player) {
    return <IntroScreen onPlayerCreated={handlePlayerCreation} />
  }

  return (
    <NotificationProvider>
      <LevelUpProvider>
        <GameLayout player={player} setPlayer={setPlayer} onLogout={handleLogout} />
      </LevelUpProvider>
    </NotificationProvider>
  )
}
