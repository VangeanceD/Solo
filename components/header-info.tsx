"use client"

import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { MotivationalQuotes } from "@/components/motivational-quotes"
import { SyncStatus } from "@/components/sync-status"
import { SyncSetupModal } from "@/components/sync-setup-modal"
import { usePlayerSync } from "@/hooks/use-player-sync"
import type { Player } from "@/lib/player"

interface HeaderInfoProps {
  player: Player
  onPlayerUpdate: (player: Player) => void
}

export function HeaderInfo({ player, onPlayerUpdate }: HeaderInfoProps) {
  const [showSyncSetup, setShowSyncSetup] = useState(false)
  const { syncStatus, syncToCloud, isConfigured } = usePlayerSync()
  const xpPercentage = (player.xp / player.xpToNextLevel) * 100

  const handleManualSync = async () => {
    if (isConfigured) {
      await syncToCloud(player)
    } else {
      setShowSyncSetup(true)
    }
  }

  const handleSetupComplete = () => {
    setShowSyncSetup(false)
    // Trigger a sync after setup
    setTimeout(() => {
      syncToCloud(player)
    }, 1000)
  }

  return (
    <>
      <div className="space-y-4 sm:space-y-6 mb-6">
        {/* Player Status Card */}
        <div className="p-3 sm:p-4 bg-black/60 backdrop-blur-md border border-primary/30 animate-border-glow cyberpunk-border holographic-ui">
          <div className="holographic-header">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span className="font-michroma text-sm">Hunter Status</span>
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <span className="text-primary/70 font-orbitron text-xs sm:text-sm">{player.title}</span>
                <SyncStatus
                  isSyncing={syncStatus.isLoading}
                  lastSyncTime={syncStatus.lastSync?.toISOString() || null}
                  syncError={syncStatus.error}
                  isOnline={syncStatus.isOnline}
                  onManualSync={handleManualSync}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            {/* Avatar and Basic Info */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-primary/50 animate-pulse-glow flex-shrink-0">
                <img
                  src={player.avatar || "/placeholder.svg?height=64&width=64"}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: "center" }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-primary mb-1 font-michroma truncate">{player.name}</h2>
                <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                  <div className="bg-primary/20 px-2 py-1 text-primary text-xs sm:text-sm font-orbitron level-badge">
                    LVL {player.level}
                  </div>
                  <div className="text-white/70 text-xs sm:text-sm font-electrolize">
                    {player.xp} / {player.xpToNextLevel} XP
                  </div>
                </div>

                <div className="mb-2">
                  <Progress value={xpPercentage} className="progress-bar h-2">
                    <div className="progress-fill h-full" style={{ width: `${xpPercentage}%` }}></div>
                  </Progress>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 lg:gap-3 lg:flex-1">
              {Object.entries(player.stats).map(([stat, value]) => (
                <div key={stat} className="text-center p-2 bg-primary/10 border border-primary/20">
                  <div className="text-white/70 text-xs uppercase mb-1 font-michroma truncate">{stat}</div>
                  <div className="text-primary text-sm sm:text-lg font-orbitron">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Motivational Quotes */}
        <MotivationalQuotes className="block" />
      </div>

      <SyncSetupModal
        show={showSyncSetup}
        onClose={() => setShowSyncSetup(false)}
        onSetupComplete={handleSetupComplete}
      />
    </>
  )
}
