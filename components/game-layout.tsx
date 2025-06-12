"use client"

import { useState, useEffect } from "react"
import { SideNavigation } from "@/components/side-navigation"
import { BackgroundEffects } from "@/components/background-effects"
import { QuestTimer } from "@/components/quest-timer"
import { QuestCompleteOverlay } from "@/components/quest-complete-overlay"
import { PunishmentModal } from "@/components/punishment-modal"
import { QuestsPage } from "@/components/pages/quests-page"
import { DailyQuestsPage } from "@/components/pages/daily-quests-page"
import { CreateQuestPage } from "@/components/pages/create-quest-page"
import { CreateDailyMissionsPage } from "@/components/pages/create-daily-missions-page"
import { SchedulePage } from "@/components/pages/schedule-page"
import { TodoPage } from "@/components/pages/todo-page"
import { WorkoutAccountabilityPage } from "@/components/pages/workout-accountability-page"
import { ProfilePage } from "@/components/pages/profile-page"
import { ProfileCustomizationPage } from "@/components/pages/profile-customization"
import { InventoryPage } from "@/components/pages/inventory-page"
import { RewardsPage } from "@/components/pages/rewards-page"
import { SettingsPage } from "@/components/pages/settings-page"
import { HeaderInfo } from "@/components/header-info"
import { useNotification } from "@/components/notification-provider"
import type { Player, Quest, DailyQuest } from "@/lib/player"

interface GameLayoutProps {
  player: Player
  setPlayer: (player: Player) => void
  onLogout: () => void
}

export function GameLayout({ player, setPlayer, onLogout }: GameLayoutProps) {
  const [activePage, setActivePage] = useState("profile")
  const [questTimerKey, setQuestTimerKey] = useState(0)
  const [activeQuest, setActiveQuest] = useState<Quest | DailyQuest | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [showQuestComplete, setShowQuestComplete] = useState(false)
  const [completedQuest, setCompletedQuest] = useState<Quest | DailyQuest | null>(null)
  const [statIncreases, setStatIncreases] = useState<Record<string, number>>({})
  const [showPunishment, setShowPunishment] = useState(false)
  const [punishmentMessage, setPunishmentMessage] = useState("")
  const { addNotification } = useNotification()

  // Reset quest timer when changing pages
  useEffect(() => {
    setQuestTimerKey((prev) => prev + 1)
  }, [activePage])

  const handleStartQuest = (quest: Quest | DailyQuest) => {
    try {
      // Validate quest object
      if (!quest || !quest.id || !quest.title) {
        addNotification("Invalid quest data", "error")
        return
      }

      // Check if there's already an active quest
      if (activeQuest) {
        addNotification("You already have an active quest. Complete it first!", "warning")
        return
      }

      setActiveQuest(quest)
      setTimeRemaining(quest.timeLimit * 60) // Convert minutes to seconds
      addNotification(`Started: ${quest.title}`, "info")
    } catch (error) {
      console.error("Error starting quest:", error)
      addNotification("Error starting quest", "error")
    }
  }

  const handleCompleteQuest = () => {
    if (!activeQuest) return

    try {
      // Store the completed quest before resetting active quest
      setCompletedQuest(activeQuest)

      // Calculate stat increases if it's a regular quest
      if ("statIncreases" in activeQuest && activeQuest.statIncreases) {
        setStatIncreases(activeQuest.statIncreases)
      } else {
        setStatIncreases({})
      }

      setShowQuestComplete(true)
      setActiveQuest(null)
      setTimeRemaining(null)
    } catch (error) {
      console.error("Error completing quest:", error)
      addNotification("Error completing quest", "error")
    }
  }

  const handleCancelQuest = () => {
    if (!activeQuest) return

    try {
      if ("penalty" in activeQuest) {
        // It's a daily quest with penalty
        setPunishmentMessage(
          `You failed to complete "${activeQuest.title}" in time. You lose ${activeQuest.penalty} XP.`,
        )
        setShowPunishment(true)

        // Apply penalty
        setPlayer({
          ...player,
          xp: Math.max(0, player.xp - activeQuest.penalty),
        })
      } else {
        addNotification(`Quest "${activeQuest.title}" was cancelled.`, "error")
      }

      setActiveQuest(null)
      setTimeRemaining(null)
    } catch (error) {
      console.error("Error cancelling quest:", error)
      addNotification("Error cancelling quest", "error")
    }
  }

  const handleQuestCompleteClose = () => {
    setShowQuestComplete(false)
    setCompletedQuest(null)
  }

  const handlePunishmentClose = () => {
    setShowPunishment(false)
  }

  const renderActivePage = () => {
    try {
      switch (activePage) {
        case "profile":
          return <ProfilePage player={player} />
        case "quests":
          return (
            <QuestsPage
              player={player}
              activeQuest={activeQuest}
              onStartQuest={handleStartQuest}
              onCompleteQuest={handleCompleteQuest}
              onCancelQuest={handleCancelQuest}
            />
          )
        case "daily-quests":
          return (
            <DailyQuestsPage
              player={player}
              activeQuest={activeQuest}
              onStartQuest={handleStartQuest}
              setPlayer={setPlayer}
            />
          )
        case "create-quest":
          return <CreateQuestPage player={player} setPlayer={setPlayer} />
        case "create-daily-missions":
          return <CreateDailyMissionsPage player={player} setPlayer={setPlayer} />
        case "schedule":
          return <SchedulePage player={player} setPlayer={setPlayer} />
        case "todo":
          return <TodoPage player={player} setPlayer={setPlayer} />
        case "workout-accountability":
          return <WorkoutAccountabilityPage player={player} setPlayer={setPlayer} />
        case "customize-profile":
          return <ProfileCustomizationPage player={player} setPlayer={setPlayer} />
        case "inventory":
          return <InventoryPage player={player} />
        case "rewards":
          return <RewardsPage player={player} setPlayer={setPlayer} />
        case "settings":
          return <SettingsPage player={player} setPlayer={setPlayer} onLogout={onLogout} />
        default:
          return <ProfilePage player={player} />
      }
    } catch (error) {
      console.error("Error rendering page:", error)
      return (
        <div className="text-center py-8">
          <div className="text-red-500 font-michroma mb-4">Error loading page</div>
          <button
            onClick={() => setActivePage("profile")}
            className="bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 border border-primary/30"
          >
            Return to Profile
          </button>
        </div>
      )
    }
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <BackgroundEffects />

      <div className="relative z-10 flex h-screen">
        <SideNavigation activePage={activePage} onNavigate={setActivePage} player={player} onLogout={onLogout} />

        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent">
          <div className="container mx-auto p-4 pb-24">
            <HeaderInfo player={player} />

            {activeQuest && (
              <QuestTimer
                key={questTimerKey}
                quest={activeQuest}
                timeRemaining={timeRemaining}
                setTimeRemaining={setTimeRemaining}
                onComplete={handleCompleteQuest}
                onFailure={handleCancelQuest}
                player={player}
                setPlayer={setPlayer}
              />
            )}

            {renderActivePage()}
          </div>
        </main>
      </div>

      <QuestCompleteOverlay
        show={showQuestComplete}
        onClose={handleQuestCompleteClose}
        quest={completedQuest}
        statIncreases={statIncreases}
      />

      <PunishmentModal
        show={showPunishment}
        onClose={handlePunishmentClose}
        message={punishmentMessage}
        player={player}
        setPlayer={setPlayer}
      />
    </div>
  )
}
