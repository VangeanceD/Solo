"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { SideNavigation } from "@/components/side-navigation"
import { MobileHeader } from "@/components/mobile-header"
import { MobileMenu } from "@/components/mobile-menu"
import { BottomNavigation } from "@/components/bottom-navigation"
import { QuestsPage } from "@/components/pages/quests-page"
import { DailyQuestsPage } from "@/components/pages/daily-quests-page"
import { ProfilePage } from "@/components/pages/profile-page"
import { InventoryPage } from "@/components/pages/inventory-page"
import { RewardsPage } from "@/components/pages/rewards-page"
import { SettingsPage } from "@/components/pages/settings-page"
import { SchedulePage } from "@/components/pages/schedule-page"
import { TodoPage } from "@/components/pages/todo-page"
import { WorkoutPage } from "@/components/pages/workout-page"
import { WorkoutAccountabilityPage } from "@/components/pages/workout-accountability-page"
import { ActivitySummaryPage } from "@/components/pages/activity-summary-page"
import type { Player } from "@/lib/player"
import { useIsMobile } from "@/hooks/use-mobile"
import { PunishmentModal } from "@/components/punishment-modal"

interface GameLayoutProps {
  player: Player
  setPlayer: React.Dispatch<React.SetStateAction<Player | null>>
}

export function GameLayout({ player, setPlayer }: GameLayoutProps) {
  const [activePage, setActivePage] = useState("quests")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showPunishment, setShowPunishment] = useState(false)
  const isMobile = useIsMobile()

  // Check for missed daily quests on mount and daily
  useEffect(() => {
    const checkMissedQuests = () => {
      const today = new Date().toDateString()
      const lastCheck = localStorage.getItem("lastDailyCheck")

      if (lastCheck !== today) {
        const missedQuests = player.dailyQuests.filter((quest) => !quest.completed && quest.urgent)

        if (missedQuests.length > 0) {
          setShowPunishment(true)
        }

        localStorage.setItem("lastDailyCheck", today)
      }
    }

    checkMissedQuests()
    const interval = setInterval(checkMissedQuests, 1000 * 60 * 60) // Check every hour

    return () => clearInterval(interval)
  }, [player.dailyQuests])

  const handlePunishmentComplete = (missedCount: number) => {
    setShowPunishment(false)
    // XP loss is handled in the PunishmentModal component
  }

  const renderPage = () => {
    switch (activePage) {
      case "quests":
        return <QuestsPage player={player} setPlayer={setPlayer} />
      case "daily":
        return <DailyQuestsPage player={player} setPlayer={setPlayer} />
      case "profile":
        return <ProfilePage player={player} setPlayer={setPlayer} />
      case "inventory":
        return <InventoryPage player={player} setPlayer={setPlayer} />
      case "rewards":
        return <RewardsPage player={player} setPlayer={setPlayer} />
      case "settings":
        return <SettingsPage player={player} setPlayer={setPlayer} />
      case "schedule":
        return <SchedulePage player={player} setPlayer={setPlayer} />
      case "todo":
        return <TodoPage player={player} setPlayer={setPlayer} />
      case "workout":
        return <WorkoutPage player={player} setPlayer={setPlayer} />
      case "workout-accountability":
        return <WorkoutAccountabilityPage player={player} setPlayer={setPlayer} />
      case "activity-summary":
        return <ActivitySummaryPage player={player} />
      default:
        return <QuestsPage player={player} setPlayer={setPlayer} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? (
        <>
          <MobileHeader player={player} onMenuClick={() => setMobileMenuOpen(true)} />
          <main className="pb-20 pt-16">{renderPage()}</main>
          <BottomNavigation activePage={activePage} onPageChange={setActivePage} />
          <MobileMenu
            open={mobileMenuOpen}
            onOpenChange={setMobileMenuOpen}
            activePage={activePage}
            onPageChange={(page) => {
              setActivePage(page)
              setMobileMenuOpen(false)
            }}
          />
        </>
      ) : (
        <div className="flex min-h-screen">
          <SideNavigation player={player} activePage={activePage} onPageChange={setActivePage} />
          <main className="flex-1 ml-64">{renderPage()}</main>
        </div>
      )}

      {showPunishment && (
        <PunishmentModal
          player={player}
          setPlayer={setPlayer}
          missedQuests={player.dailyQuests.filter((q) => !q.completed && q.urgent)}
          onComplete={handlePunishmentComplete}
        />
      )}
    </div>
  )
}
