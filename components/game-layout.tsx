"use client"

import { useState, useEffect } from "react"
import type { Player, Quest, DailyQuest } from "@/lib/player"
import { SideNavigation } from "@/components/side-navigation"
import { HeaderInfo } from "@/components/header-info"
import { ProfilePage } from "@/components/pages/profile-page"
import { DailyQuestsPage } from "@/components/pages/daily-quests-page"
import { QuestsPage } from "@/components/pages/quests-page"
import { RewardsPage } from "@/components/pages/rewards-page"
import { InventoryPage } from "@/components/pages/inventory-page"
import { CreateQuestPage } from "@/components/pages/create-quest-page"
import { SettingsPage } from "@/components/pages/settings-page"
import { QuestTimer } from "@/components/quest-timer"
import { useNotification } from "@/components/notification-provider"
import { useLevelUp } from "@/components/level-up-provider"
import { QuestCompleteOverlay } from "@/components/quest-complete-overlay"
import { PunishmentModal } from "@/components/punishment-modal"
import { BackgroundEffects } from "@/components/background-effects"

interface GameLayoutProps {
  player: Player
  setPlayer: (player: Player) => void
  onLogout: () => void
}

export function GameLayout({ player, setPlayer, onLogout }: GameLayoutProps) {
  const [activePage, setActivePage] = useState<string>("profile")
  const [activeQuest, setActiveQuest] = useState<(Quest | DailyQuest) | null>(null)
  const [questStartTime, setQuestStartTime] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [showQuestComplete, setShowQuestComplete] = useState(false)
  const [completedQuest, setCompletedQuest] = useState<Quest | DailyQuest | null>(null)
  const [statIncreases, setStatIncreases] = useState<Record<string, number>>({})
  const [showPunishment, setShowPunishment] = useState(false)
  const [punishmentMessage, setPunishmentMessage] = useState("")

  const { showNotification } = useNotification()
  const { showLevelUp } = useLevelUp()

  useEffect(() => {
    // Check for daily quests
    checkDailyQuests()

    // Start daily quest timer
    const dailyQuestTimer = setInterval(() => {
      checkDailyQuests()
    }, 60000) // Check every minute

    return () => clearInterval(dailyQuestTimer)
  }, [player])

  const checkDailyQuests = () => {
    const now = new Date()

    // Check if we need to reset daily quests
    if (player.nextDailyReset && now.getTime() > player.nextDailyReset) {
      // Apply penalties for incomplete quests
      const updatedPlayer = { ...player }

      updatedPlayer.dailyQuests.forEach((quest) => {
        if (!quest.completed) {
          // Apply XP penalty
          updatedPlayer.xp = Math.max(0, updatedPlayer.xp - quest.penalty)

          // Show notification
          showNotification({
            title: "MISSION FAILED",
            message: `You failed to complete the daily mission: ${quest.title}. You lost ${quest.penalty} XP.`,
          })
        }
      })

      // Reset daily quests
      resetDailyQuests(updatedPlayer)

      // Update player data
      setPlayer(updatedPlayer)
    }

    // Check for urgent quests
    const urgentQuests = player.dailyQuests.filter((quest) => {
      const expireDate = new Date(quest.expires)
      const timeLeft = expireDate.getTime() - now.getTime()
      return !quest.completed && timeLeft < 3 * 60 * 60 * 1000 && !quest.urgent
    })

    if (urgentQuests.length > 0) {
      // Mark quests as urgent
      const updatedPlayer = { ...player }

      urgentQuests.forEach((quest) => {
        const questIndex = updatedPlayer.dailyQuests.findIndex((q) => q.id === quest.id)
        if (questIndex !== -1) {
          updatedPlayer.dailyQuests[questIndex].urgent = true
        }
      })

      // Show urgent notification
      const urgentQuest = urgentQuests[0]
      const expireDate = new Date(urgentQuest.expires)
      const timeLeft = expireDate.getTime() - now.getTime()
      const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60))
      const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

      showNotification({
        title: "URGENT MISSION",
        message: `Your daily quest "${urgentQuest.title}" will expire in ${hoursLeft}h ${minutesLeft}m. Failure to complete will result in XP penalty.`,
        type: "warning",
      })

      // Update player data
      setPlayer(updatedPlayer)
    }
  }

  const resetDailyQuests = (playerData: Player) => {
    // Set next reset time
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setHours(24, 0, 0, 0)

    playerData.lastDailyReset = now.getTime()
    playerData.nextDailyReset = tomorrow.getTime()

    // Reset daily quests
    playerData.dailyQuests.forEach((quest, index) => {
      playerData.dailyQuests[index] = {
        ...quest,
        completed: false,
        expires: tomorrow.getTime(),
        urgent: false,
      }
    })
  }

  const handleNavigate = (page: string) => {
    // If there's an active quest, confirm before navigating away
    if (activeQuest && page !== "quests" && page !== "daily-quests") {
      showNotification({
        title: "ACTIVE QUEST WARNING",
        message: "You have an active quest in progress. Navigating away will cancel it. Continue?",
        type: "warning",
        confirmText: "Continue",
        onConfirm: () => {
          cancelActiveQuest()
          setActivePage(page)
        },
      })
      return
    }

    setActivePage(page)
  }

  const startQuest = (quest: Quest | DailyQuest, isDaily = false) => {
    setActiveQuest(quest)
    setQuestStartTime(Date.now())
    setTimeRemaining(quest.timeLimit * 60) // Convert minutes to seconds

    // Show notification
    showNotification({
      title: "QUEST STARTED",
      message: `You have started the ${isDaily ? "mission" : "quest"}: ${quest.title}. Complete it within ${quest.timeLimit} minutes to earn rewards!`,
      type: "info",
    })
  }

  const cancelActiveQuest = () => {
    setActiveQuest(null)
    setQuestStartTime(null)
    setTimeRemaining(null)
  }

  const completeQuest = () => {
    if (!activeQuest) return

    // Calculate time spent
    const timeSpent = Math.floor((Date.now() - (questStartTime || 0)) / 1000 / 60)

    const updatedPlayer = { ...player }
    const isDaily = "penalty" in activeQuest

    if (isDaily) {
      // Mark daily quest as completed
      const questIndex = updatedPlayer.dailyQuests.findIndex((q) => q.id === activeQuest.id)
      if (questIndex !== -1) {
        updatedPlayer.dailyQuests[questIndex].completed = true
      }
    } else {
      // Mark quest as completed
      const questIndex = updatedPlayer.quests.findIndex((q) => q.id === activeQuest.id)
      if (questIndex !== -1) {
        updatedPlayer.quests[questIndex].completed = true
      }
    }

    // Add to completed quests
    if (!updatedPlayer.completedQuests) {
      updatedPlayer.completedQuests = []
    }

    updatedPlayer.completedQuests.unshift({
      ...activeQuest,
      completedAt: Date.now(),
      timeSpent,
    })

    // Increase stats
    const increases: Record<string, number> = {}
    if (activeQuest.stats && activeQuest.stats.length > 0) {
      activeQuest.stats.forEach((stat) => {
        if (updatedPlayer.stats[stat] !== undefined) {
          updatedPlayer.stats[stat] += 1
          increases[stat] = updatedPlayer.stats[stat]
        }
      })
    }

    // Add XP
    const oldLevel = updatedPlayer.level
    addXP(updatedPlayer, activeQuest.xp)

    // Check if player leveled up
    if (updatedPlayer.level > oldLevel) {
      showLevelUp(updatedPlayer.level)
    }

    // Save completed quest and stat increases for overlay
    setCompletedQuest(activeQuest)
    setStatIncreases(increases)

    // Show completion overlay
    setShowQuestComplete(true)

    // Reset active quest
    setActiveQuest(null)
    setQuestStartTime(null)
    setTimeRemaining(null)

    // Update player data
    setPlayer(updatedPlayer)
  }

  const handleQuestFailure = () => {
    if (!activeQuest) return

    // Apply punishment
    const xpReduction = Math.min(player.xp, activeQuest.xp)
    const punishment = activeQuest.punishment || "You failed to complete the quest in time!"

    // Show punishment modal
    setPunishmentMessage(`${punishment} You lost ${xpReduction} XP.`)
    setShowPunishment(true)

    // Update player data
    const updatedPlayer = { ...player }
    updatedPlayer.xp = Math.max(0, updatedPlayer.xp - xpReduction)
    setPlayer(updatedPlayer)

    // Reset active quest
    setActiveQuest(null)
    setQuestStartTime(null)
    setTimeRemaining(null)
  }

  const addXP = (playerData: Player, amount: number) => {
    playerData.xp += amount

    // Check for level up
    const newLevel = Math.floor(playerData.xp / playerData.xpToNextLevel) + 1
    if (newLevel > playerData.level) {
      playerData.level = newLevel
    }
  }

  return (
    <div className="min-h-screen bg-black flex">
      <BackgroundEffects />

      <SideNavigation activePage={activePage} onNavigate={handleNavigate} player={player} onLogout={onLogout} />

      <div className="flex-1 p-4 md:p-8 overflow-y-auto relative z-10">
        <HeaderInfo player={player} />

        {activeQuest && (
          <QuestTimer
            quest={activeQuest}
            timeRemaining={timeRemaining}
            setTimeRemaining={setTimeRemaining}
            onComplete={completeQuest}
            onFailure={handleQuestFailure}
          />
        )}

        {activePage === "profile" && <ProfilePage player={player} />}
        {activePage === "daily-quests" && (
          <DailyQuestsPage
            player={player}
            activeQuest={activeQuest}
            onStartQuest={(quest) => startQuest(quest, true)}
            setPlayer={setPlayer}
          />
        )}
        {activePage === "quests" && (
          <QuestsPage
            player={player}
            activeQuest={activeQuest}
            onStartQuest={startQuest}
            onCompleteQuest={completeQuest}
            onCancelQuest={cancelActiveQuest}
          />
        )}
        {activePage === "rewards" && <RewardsPage player={player} setPlayer={setPlayer} />}
        {activePage === "inventory" && <InventoryPage player={player} />}
        {activePage === "create-quest" && <CreateQuestPage player={player} setPlayer={setPlayer} />}
        {activePage === "settings" && <SettingsPage player={player} setPlayer={setPlayer} />}
      </div>

      <QuestCompleteOverlay
        show={showQuestComplete}
        onClose={() => setShowQuestComplete(false)}
        quest={completedQuest}
        statIncreases={statIncreases}
      />

      <PunishmentModal show={showPunishment} onClose={() => setShowPunishment(false)} message={punishmentMessage} />
    </div>
  )
}
