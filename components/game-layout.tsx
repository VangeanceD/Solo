"use client"

import { useState, useEffect } from "react"
import { SideNavigation } from "@/components/side-navigation"
import { BackgroundEffects } from "@/components/background-effects"
import { QuestTimer } from "@/components/quest-timer"
import { NotificationProvider } from "@/components/notification-provider"
import { LevelUpProvider } from "@/components/level-up-provider"
import { QuestCompleteOverlay } from "@/components/quest-complete-overlay"
import { PunishmentModal } from "@/components/punishment-modal"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { defaultPlayer } from "@/lib/player"
import { QuestsPage } from "@/components/pages/quests-page"
import { DailyQuestsPage } from "@/components/pages/daily-quests-page"
import { CreateQuestPage } from "@/components/pages/create-quest-page"
import { ProfilePage } from "@/components/pages/profile-page"
import { ProfileCustomizationPage } from "@/components/pages/profile-customization"
import { InventoryPage } from "@/components/pages/inventory-page"
import { RewardsPage } from "@/components/pages/rewards-page"
import { SettingsPage } from "@/components/pages/settings-page"
import { WorkoutPage } from "@/components/pages/workout-page"
import { HeaderInfo } from "@/components/header-info"

export function GameLayout() {
  const [player, setPlayer] = useLocalStorage("player", defaultPlayer)
  const [activePage, setActivePage] = useState("quests")
  const [questTimerKey, setQuestTimerKey] = useState(0)

  // Reset quest timer when changing pages
  useEffect(() => {
    setQuestTimerKey((prev) => prev + 1)
  }, [activePage])

  return (
    <NotificationProvider>
      <LevelUpProvider player={player} setPlayer={setPlayer}>
        <div className="relative min-h-screen bg-black text-white overflow-hidden">
          <BackgroundEffects />

          <div className="relative z-10 flex h-screen">
            <SideNavigation activePage={activePage} setActivePage={setActivePage} player={player} />

            <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent">
              <div className="container mx-auto p-4 pb-24">
                <HeaderInfo player={player} />

                <QuestTimer key={questTimerKey} />

                {activePage === "quests" && <QuestsPage player={player} setPlayer={setPlayer} />}

                {activePage === "daily-quests" && <DailyQuestsPage player={player} setPlayer={setPlayer} />}

                {activePage === "create-quest" && <CreateQuestPage player={player} setPlayer={setPlayer} />}

                {activePage === "profile" && <ProfilePage player={player} setPlayer={setPlayer} />}

                {activePage === "profile-customization" && (
                  <ProfileCustomizationPage player={player} setPlayer={setPlayer} />
                )}

                {activePage === "inventory" && <InventoryPage player={player} setPlayer={setPlayer} />}

                {activePage === "rewards" && <RewardsPage player={player} setPlayer={setPlayer} />}

                {activePage === "settings" && <SettingsPage player={player} setPlayer={setPlayer} />}

                {activePage === "workout" && <WorkoutPage player={player} setPlayer={setPlayer} />}
              </div>
            </main>
          </div>

          <QuestCompleteOverlay />
          <PunishmentModal player={player} setPlayer={setPlayer} />
        </div>
      </LevelUpProvider>
    </NotificationProvider>
  )
}
