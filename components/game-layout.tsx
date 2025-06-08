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
import { ProfilePage } from "@/components/pages/profile-page"
import { ProfileCustomizationPage } from "@/components/pages/profile-customization"
import { InventoryPage } from "@/components/pages/inventory-page"
import { RewardsPage } from "@/components/pages/rewards-page"
import { SettingsPage } from "@/components/pages/settings-page"
import { HeaderInfo } from "@/components/header-info"
import type { Player } from "@/lib/player"

interface GameLayoutProps {
  player: Player
  setPlayer: (player: Player) => void
  onLogout: () => void
}

export function GameLayout({ player, setPlayer, onLogout }: GameLayoutProps) {
  const [activePage, setActivePage] = useState("profile")
  const [questTimerKey, setQuestTimerKey] = useState(0)
  const [activeQuest, setActiveQuest] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

  // Reset quest timer when changing pages
  useEffect(() => {
    setQuestTimerKey((prev) => prev + 1)
  }, [activePage])

  const handleStartQuest = (quest: any) => {
    setActiveQuest(quest)
    setTimeRemaining(quest.timeLimit * 60) // Convert minutes to seconds
  }

  const handleCompleteQuest = () => {
    setActiveQuest(null)
    setTimeRemaining(null)
  }

  const handleCancelQuest = () => {
    setActiveQuest(null)
    setTimeRemaining(null)
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

            {activePage === "profile" && <ProfilePage player={player} />}

            {activePage === "quests" && (
              <QuestsPage
                player={player}
                activeQuest={activeQuest}
                onStartQuest={handleStartQuest}
                onCompleteQuest={handleCompleteQuest}
                onCancelQuest={handleCancelQuest}
              />
            )}

            {activePage === "daily-quests" && (
              <DailyQuestsPage
                player={player}
                activeQuest={activeQuest}
                onStartQuest={handleStartQuest}
                setPlayer={setPlayer}
              />
            )}

            {activePage === "create-quest" && <CreateQuestPage player={player} setPlayer={setPlayer} />}

            {activePage === "customize-profile" && <ProfileCustomizationPage player={player} setPlayer={setPlayer} />}

            {activePage === "inventory" && <InventoryPage player={player} />}

            {activePage === "rewards" && <RewardsPage player={player} setPlayer={setPlayer} />}

            {activePage === "settings" && <SettingsPage player={player} setPlayer={setPlayer} />}
          </div>
        </main>
      </div>

      <QuestCompleteOverlay show={false} onClose={() => {}} quest={null} statIncreases={{}} />
      <PunishmentModal show={false} onClose={() => {}} message="" player={player} setPlayer={setPlayer} />
    </div>
  )
}
