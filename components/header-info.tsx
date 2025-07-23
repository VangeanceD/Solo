"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings, Menu } from "lucide-react"
import { SyncStatusComponent } from "./sync-status"
import { SyncSetupModal } from "./sync-setup-modal"
import { usePlayerSync } from "@/hooks/use-player-sync"
import type { Player } from "@/lib/player"

interface HeaderInfoProps {
  player: Player
  onUpdatePlayer: (updates: Partial<Player>) => void
  onToggleSidebar?: () => void
  onOpenSettings?: () => void
}

export function HeaderInfo({ player, onUpdatePlayer, onToggleSidebar, onOpenSettings }: HeaderInfoProps) {
  const [showSyncSetup, setShowSyncSetup] = useState(false)
  const { syncStatus, setupSync, syncToCloud, loadFromCloud, isConfigured } = usePlayerSync()

  const handleSync = async () => {
    await syncToCloud(player)
  }

  const handleSetupSync = (url: string, key: string) => {
    setupSync(url, key)
  }

  const getRankColor = (rank: string) => {
    const colors = {
      SSS: "rank-sss",
      SS: "rank-ss",
      S: "rank-s",
      A: "rank-a",
      B: "rank-b",
      C: "rank-c",
      D: "rank-d",
      E: "rank-e",
      F: "rank-f",
    }
    return colors[rank as keyof typeof colors] || "rank-badge"
  }

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-primary/20 bg-black/50">
        <div className="flex items-center gap-4">
          {onToggleSidebar && (
            <Button variant="ghost" size="sm" onClick={onToggleSidebar} className="lg:hidden">
              <Menu className="w-4 h-4" />
            </Button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 flex items-center justify-center border border-primary/30">
              <span className="text-sm font-bold font-orbitron">{player.name.charAt(0).toUpperCase()}</span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-orbitron font-bold text-primary">{player.name}</span>
                <Badge className={`${getRankColor(player.rank)} text-xs font-bold`}>{player.rank}</Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>Level {player.level}</span>
                <span>•</span>
                <span>{player.xp} XP</span>
                <span>•</span>
                <span>{player.coins} Coins</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SyncStatusComponent
            status={syncStatus}
            onSync={handleSync}
            onSetup={() => setShowSyncSetup(true)}
            isConfigured={isConfigured}
          />

          {onOpenSettings && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenSettings}
              className="text-muted-foreground hover:text-primary"
            >
              <Settings className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <SyncSetupModal isOpen={showSyncSetup} onClose={() => setShowSyncSetup(false)} onSetup={handleSetupSync} />
    </>
  )
}
