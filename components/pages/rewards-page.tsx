"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, Star, Plus } from "lucide-react"
import { useNotification } from "@/components/notification-provider"
import { CreateRewardModal } from "@/components/create-reward-modal"
import type { Player } from "@/lib/player"

interface RewardsPageProps {
  player: Player
  setPlayer: (player: Player) => void
}

export function RewardsPage({ player, setPlayer }: RewardsPageProps) {
  const { addNotification } = useNotification()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleClaimReward = (rewardId: string, cost: number) => {
    if (player.xp < cost) {
      addNotification(`Not enough XP. You need ${cost} XP to claim this reward.`, "error")
      return
    }

    const updatedRewards = player.rewards.map((reward) => (reward.id === rewardId ? { ...reward, used: true } : reward))

    const activityEntry = {
      id: Math.random().toString(36).slice(2),
      date: new Date().toISOString(),
      type: "avatar-change" as const,
      title: player.rewards.find((r) => r.id === rewardId)?.title || "Reward Claimed",
      xpChange: -cost,
      notes: "Reward claimed",
    }

    const updatedPlayer = {
      ...player,
      rewards: updatedRewards,
      xp: player.xp - cost,
      activityLog: [...(player.activityLog || []), activityEntry],
    }

    setPlayer(updatedPlayer)
    addNotification("Reward claimed successfully!", "success")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary font-audiowide glow-text">REWARDS</h1>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-michroma"
        >
          <Plus className="w-4 h-4 mr-2" />
          CREATE REWARD
        </Button>
      </div>

      <div className="bg-black/60 backdrop-blur-md border border-primary/30 p-4 animate-border-glow cyberpunk-border holographic-ui mb-4">
        <div className="holographic-header">Available XP</div>
        <div className="text-2xl font-bold text-primary font-orbitron">{player.xp} XP</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {player.rewards.map((reward) => (
          <Card
            key={reward.id}
            className={`bg-black/60 backdrop-blur-md border ${
              reward.used ? "border-green-500/30 bg-green-900/10" : "border-primary/30"
            } quest-card`}
          >
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <Gift className="w-5 h-5 text-primary/70 mr-2" />
                <h3 className="text-lg font-semibold text-primary font-michroma">{reward.title}</h3>
              </div>
              <p className="text-white/70 mb-4 text-sm font-electrolize">{reward.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-primary/70" />
                  <span className="text-primary/70 font-orbitron">{reward.cost} XP</span>
                </div>
                {!reward.used ? (
                  <Button
                    onClick={() => handleClaimReward(reward.id, reward.cost)}
                    size="sm"
                    className="bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 btn-primary"
                  >
                    CLAIM
                  </Button>
                ) : (
                  <span className="text-green-500 font-michroma text-sm">CLAIMED</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {player.rewards.length === 0 && (
        <div className="text-center py-12">
          <Gift className="w-16 h-16 text-primary/30 mx-auto mb-4" />
          <p className="text-white/50 font-electrolize">No rewards yet. Create your first reward!</p>
        </div>
      )}

      <CreateRewardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        player={player}
        setPlayer={setPlayer}
      />
    </div>
  )
}
