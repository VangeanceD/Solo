"use client"

import { useEffect, useState } from "react"
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
import { useLevelUp } from "@/components/level-up-provider"
import { ActivitySummaryPage } from "@/components/pages/activity-summary-page"
import type { Player, Quest, DailyQuest } from "@/lib/player"
import { computeSkipPenalty } from "@/lib/xp"

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
  const { showLevelUp } = useLevelUp()

  // Reset quest timer when changing pages
  useEffect(() => {
    setQuestTimerKey((prev) => prev + 1)
  }, [activePage])

  const handleStartQuest = (quest: Quest | DailyQuest) => {
    try {
      if (!quest || !quest.id || !quest.title) {
        addNotification("Invalid quest data", "error")
        return
      }
      if (activeQuest) {
        addNotification("You already have an active quest. Complete it first!", "warning")
        return
      }
      setActiveQuest(quest)
      setTimeRemaining(quest.timeLimit * 60)
      addNotification(`Started: ${quest.title}`, "info")
    } catch (error) {
      console.error("Error starting quest:", error)
      addNotification("Error starting quest", "error")
    }
  }

  const handleCompleteQuest = () => {
    if (!activeQuest) return

    try {
      // Use functional setState to ensure we work with the latest state
      setPlayer((prevPlayer) => {
        const oldLevel = prevPlayer.level
        const oldXP = prevPlayer.xp

        // Calculate new XP
        const newXP = oldXP + activeQuest.xp
        console.log("Completing quest:", {
          oldXP,
          questXP: activeQuest.xp,
          newXP,
        })

        // Calculate new level
        const newLevel = Math.floor(newXP / 100) + 1

        // Update quests/daily quests
        let updatedQuests = prevPlayer.quests
        if ("statIncreases" in activeQuest) {
          updatedQuests = prevPlayer.quests.map((q) => (q.id === activeQuest.id ? { ...q, completed: true } : q))
        }

        let updatedDailyQuests = prevPlayer.dailyQuests
        if ("penalty" in activeQuest) {
          updatedDailyQuests = prevPlayer.dailyQuests.map((q) =>
            q.id === activeQuest.id ? { ...q, completed: true } : q,
          )
        }

        // Apply stat increases
        const newStats = { ...prevPlayer.stats }
        const statIncreases: Record<string, number> = {}

        if ("statIncreases" in activeQuest && activeQuest.statIncreases) {
          Object.entries(activeQuest.statIncreases).forEach(([stat, increase]) => {
            if (stat in newStats && increase) {
              newStats[stat as keyof typeof newStats] += increase
              statIncreases[stat] = increase
            }
          })
        }

        // Show level up notification
        if (newLevel > oldLevel && Object.keys(statIncreases).length > 0) {
          setTimeout(() => showLevelUp(newLevel, statIncreases), 500)
        }

        // Create activity log entry
        const activityEntry = {
          id: Math.random().toString(36).slice(2),
          date: new Date().toISOString(),
          type: ("penalty" in activeQuest ? "daily-completed" : "quest-completed") as any,
          refId: activeQuest.id,
          title: activeQuest.title,
          xpChange: activeQuest.xp,
        }

        // Return updated player
        return {
          ...prevPlayer,
          quests: updatedQuests,
          dailyQuests: updatedDailyQuests,
          xp: newXP,
          level: newLevel,
          xpToNextLevel: newLevel * 100,
          stats: newStats,
          lifetimeXp: (prevPlayer.lifetimeXp || 0) + activeQuest.xp,
          activityLog: [...(prevPlayer.activityLog || []), activityEntry],
        }
      })

      // Set UI state
      setCompletedQuest(activeQuest)
      if ("statIncreases" in activeQuest && activeQuest.statIncreases) {
        setStatIncreases(activeQuest.statIncreases)
      } else {
        setStatIncreases({})
      }

      setShowQuestComplete(true)
      addNotification(`Quest completed! +${activeQuest.xp} XP`, "success")

      // Clear active quest
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
      const penalty = computeSkipPenalty(activeQuest.xp)
      const type = "penalty" in activeQuest ? "daily-skipped" : "quest-skipped"

      setPunishmentMessage(`You skipped "${activeQuest.title}". Penalty: -${penalty} XP.`)
      setShowPunishment(true)

      // Use functional setState
      setPlayer((prevPlayer) => {
        console.log("Cancelling quest:", {
          oldXP: prevPlayer.xp,
          penalty,
          newXP: Math.max(0, prevPlayer.xp - penalty),
        })

        return {
          ...prevPlayer,
          xp: Math.max(0, prevPlayer.xp - penalty),
          activityLog: [
            ...(prevPlayer.activityLog || []),
            {
              id: Math.random().toString(36).slice(2),
              date: new Date().toISOString(),
              type: type as any,
              refId: activeQuest.id,
              title: activeQuest.title,
              xpChange: -penalty,
            },
          ],
        }
      })

      addNotification(`Penalty applied: -${penalty} XP`, "error")
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

  const safePlayer: Player = {
    ...player,
    schedule: player.schedule || [],
    todoList: player.todoList || [],
    workoutMisses: player.workoutMisses || [],
    settings: {
      ...player.settings,
      workoutPenalty: player.settings?.workoutPenalty || 25,
    },
    activityLog: player.activityLog || [],
    lifetimeXp: typeof player.lifetimeXp === "number" ? player.lifetimeXp : 0,
  }

  const renderActivePage = () => {
    switch (activePage) {
      case "profile":
        return <ProfilePage player={safePlayer} />
      case "quests":
        return (
          <QuestsPage
            player={safePlayer}
            activeQuest={activeQuest}
            onStartQuest={handleStartQuest}
            onCompleteQuest={handleCompleteQuest}
            onCancelQuest={handleCancelQuest}
          />
        )
      case "daily-quests":
        return (
          <DailyQuestsPage
            player={safePlayer}
            activeQuest={activeQuest}
            onStartQuest={handleStartQuest}
            setPlayer={setPlayer}
          />
        )
      case "create-quest":
        return <CreateQuestPage player={safePlayer} setPlayer={setPlayer} />
      case "create-daily-missions":
        return <CreateDailyMissionsPage player={safePlayer} setPlayer={setPlayer} />
      case "schedule":
        return <SchedulePage player={safePlayer} setPlayer={setPlayer} />
      case "todo":
        return <TodoPage player={safePlayer} setPlayer={setPlayer} />
      case "workout-accountability":
        return <WorkoutAccountabilityPage player={safePlayer} setPlayer={setPlayer} />
      case "customize-profile":
        return <ProfileCustomizationPage player={safePlayer} setPlayer={setPlayer} />
      case "inventory":
        return <InventoryPage player={safePlayer} />
      case "rewards":
        return <RewardsPage player={safePlayer} setPlayer={setPlayer} />
      case "settings":
        return <SettingsPage player={safePlayer} setPlayer={setPlayer} onLogout={onLogout} />
      case "activity":
        return <ActivitySummaryPage player={safePlayer} />
      default:
        return <ProfilePage player={safePlayer} />
    }
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <BackgroundEffects />

      <div className="relative z-10 flex h-screen">
        <SideNavigation activePage={activePage} onNavigate={setActivePage} player={player} onLogout={onLogout} />

        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent">
          <div className="container mx-auto p-3 sm:p-4 pb-20 sm:pb-24 max-w-7xl">
            <div className="pt-12 md:pt-0">
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
