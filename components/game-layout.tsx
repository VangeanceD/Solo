"use client"

import { useEffect, useState } from "react"
import { SideNavigation } from "@/components/side-navigation"
import { BottomNavigation } from "@/components/bottom-navigation"
import { MobileHeader } from "@/components/mobile-header"
import { MobileMenu } from "@/components/mobile-menu"
import { BackgroundEffects } from "@/components/background-effects"
import { QuestTimer } from "@/components/quest-timer"
import { QuestCompleteOverlay } from "@/components/quest-complete-overlay"
import { PunishmentModal } from "@/components/punishment-modal"
import { QuestsPage } from "@/components/pages/quests-page"
import { DailyQuestsPage } from "@/components/pages/daily-quests-page"
import { SchedulePage } from "@/components/pages/schedule-page"
import { TodoPage } from "@/components/pages/todo-page"
import { WorkoutAccountabilityPage } from "@/components/pages/workout-accountability-page"
import { ProfilePage } from "@/components/pages/profile-page"
import { ProfileCustomizationPage } from "@/components/pages/profile-customization"
import { RewardsPage } from "@/components/pages/rewards-page"
import { SettingsPage } from "@/components/pages/settings-page"
import { HeaderInfo } from "@/components/header-info"
import { useNotification } from "@/components/notification-provider"
import { useLevelUp } from "@/components/level-up-provider"
import { ActivitySummaryPage } from "@/components/pages/activity-summary-page"
import { useIsMobile } from "@/hooks/use-mobile"
import type { Player, Quest, DailyQuest } from "@/lib/player"
import { computeSkipPenalty } from "@/lib/xp"

interface GameLayoutProps {
  player: Player
  setPlayer: (player: Player) => void
  onLogout: () => void
}

export function GameLayout({ player, setPlayer, onLogout }: GameLayoutProps) {
  const isMobile = useIsMobile()
  const [activePage, setActivePage] = useState("profile")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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

  // Listen for player updates from modals
  useEffect(() => {
    const handlePlayerUpdate = (event: CustomEvent) => {
      setPlayer(event.detail)
    }
    window.addEventListener("playerUpdate" as any, handlePlayerUpdate)
    return () => window.removeEventListener("playerUpdate" as any, handlePlayerUpdate)
  }, [setPlayer])

  // Reset quest timer when changing pages
  useEffect(() => {
    setQuestTimerKey((prev) => prev + 1)
  }, [activePage])

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileMenuOpen(false)
    }
  }, [isMobile])

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
      setPlayer((prevPlayer) => {
        const oldLevel = prevPlayer.level
        const oldXP = prevPlayer.xp

        const newXP = oldXP + activeQuest.xp
        const newLevel = Math.floor(newXP / 100) + 1

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

        if (newLevel > oldLevel && Object.keys(statIncreases).length > 0) {
          setTimeout(() => showLevelUp(newLevel, statIncreases), 500)
        }

        const activityEntry = {
          id: Math.random().toString(36).slice(2),
          date: new Date().toISOString(),
          type: ("penalty" in activeQuest ? "daily-completed" : "quest-completed") as any,
          refId: activeQuest.id,
          title: activeQuest.title,
          xpChange: activeQuest.xp,
        }

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

      setCompletedQuest(activeQuest)
      if ("statIncreases" in activeQuest && activeQuest.statIncreases) {
        setStatIncreases(activeQuest.statIncreases)
      } else {
        setStatIncreases({})
      }

      setShowQuestComplete(true)
      addNotification(`Quest completed! +${activeQuest.xp} XP`, "success")

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

      setPlayer((prevPlayer) => ({
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
      }))

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

  const handleNavigate = (page: string) => {
    setActivePage(page)
    if (typeof window !== "undefined") {
      window.location.hash = page
      localStorage.setItem("activePage", page)
    }
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
      case "schedule":
        return <SchedulePage player={safePlayer} setPlayer={setPlayer} />
      case "todo":
        return <TodoPage player={safePlayer} setPlayer={setPlayer} />
      case "workout-accountability":
        return <WorkoutAccountabilityPage player={safePlayer} setPlayer={setPlayer} />
      case "customize-profile":
        return <ProfileCustomizationPage player={safePlayer} setPlayer={setPlayer} />
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

      {/* Mobile Layout */}
      {isMobile ? (
        <>
          <MobileHeader
            player={player}
            onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            isMenuOpen={isMobileMenuOpen}
          />

          <MobileMenu
            isOpen={isMobileMenuOpen}
            activePage={activePage}
            onNavigate={handleNavigate}
            onClose={() => setIsMobileMenuOpen(false)}
            player={player}
            onLogout={onLogout}
          />

          <main className="relative z-10 pt-16 pb-24">
            <div className="p-4">
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

          <BottomNavigation activePage={activePage} onNavigate={handleNavigate} />
        </>
      ) : (
        // Desktop Layout
        <div className="relative z-10 flex h-screen">
          <SideNavigation activePage={activePage} onNavigate={handleNavigate} player={player} onLogout={onLogout} />

          <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent">
            <div className="container mx-auto p-4 max-w-7xl">
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
      )}

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
