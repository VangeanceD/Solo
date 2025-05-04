"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Gift, Check, Plus } from "lucide-react"
import { useNotification } from "@/components/notification-provider"
import type { Player, Reward } from "@/lib/player"

interface RewardsPageProps {
  player: Player
  setPlayer: (player: Player) => void
}

export function RewardsPage({ player, setPlayer }: RewardsPageProps) {
  const { addNotification } = useNotification()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newReward, setNewReward] = useState({
    title: "",
    description: "",
    cost: 50,
  })

  const handleRewardClaim = (rewardId: string) => {
    const reward = player.rewards.find((r) => r.id === rewardId)
    if (!reward) return

    if (player.xp < reward.cost) {
      addNotification(`Not enough XP. You need ${reward.cost} XP to claim this reward.`, "error")
      return
    }

    const updatedRewards = player.rewards.map((r) => (r.id === rewardId ? { ...r, used: true } : r))

    setPlayer({
      ...player,
      xp: player.xp - reward.cost,
      rewards: updatedRewards,
    })

    addNotification(`You've claimed "${reward.title}"!`, "success")
  }

  const handleCreateReward = () => {
    if (!newReward.title.trim()) {
      addNotification("Please enter a reward title", "error")
      return
    }

    if (!newReward.description.trim()) {
      addNotification("Please enter a reward description", "error")
      return
    }

    const newRewardItem: Reward = {
      id: Math.random().toString(36).substring(2, 15),
      title: newReward.title,
      description: newReward.description,
      cost: newReward.cost,
      used: false,
    }

    setPlayer({
      ...player,
      rewards: [...player.rewards, newRewardItem],
    })

    addNotification("Reward created successfully!", "success")
    setNewReward({ title: "", description: "", cost: 50 })
    setShowCreateForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary font-audiowide glow-text">REWARDS</h1>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary"
        >
          {showCreateForm ? (
            "CANCEL"
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              CREATE REWARD
            </>
          )}
        </Button>
      </div>

      {showCreateForm && (
        <div className="bg-black/60 backdrop-blur-md border border-primary/30 p-6 animate-border-glow cyberpunk-border holographic-ui mb-6">
          <div className="holographic-header">Create New Reward</div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-white/70 font-michroma">
                Reward Title
              </Label>
              <Input
                id="title"
                value={newReward.title}
                onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
                className="bg-black/60 border-primary/30 text-white font-electrolize"
                placeholder="Enter reward title"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-white/70 font-michroma">
                Reward Description
              </Label>
              <Textarea
                id="description"
                value={newReward.description}
                onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                className="bg-black/60 border-primary/30 text-white font-electrolize min-h-[100px]"
                placeholder="Enter reward description"
              />
            </div>

            <div>
              <Label htmlFor="cost" className="text-white/70 font-michroma">
                XP Cost: {newReward.cost} XP
              </Label>
              <Slider
                id="cost"
                value={[newReward.cost]}
                min={10}
                max={500}
                step={10}
                onValueChange={(value) => setNewReward({ ...newReward, cost: value[0] })}
                className="my-2"
              />
            </div>

            <Button
              onClick={handleCreateReward}
              className="w-full py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary mt-4"
            >
              CREATE REWARD
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {player.rewards.length > 0 ? (
          player.rewards.map((reward) => (
            <Card
              key={reward.id}
              className={`bg-black/60 backdrop-blur-md border ${
                reward.used ? "border-green-500/30 bg-green-900/10" : "border-primary/30 hover:border-primary/60"
              } transition-all duration-300`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Gift className="w-5 h-5 text-primary/70" />
                      <h3 className="text-lg font-semibold text-primary ml-2 font-michroma">{reward.title}</h3>
                    </div>
                    <p className="text-white/70 mb-3 text-sm font-electrolize">{reward.description}</p>
                    <div className="text-primary/70 text-xs font-orbitron">Cost: {reward.cost} XP</div>
                  </div>
                  <Button
                    onClick={() => !reward.used && handleRewardClaim(reward.id)}
                    disabled={reward.used}
                    className={`ml-4 px-3 py-1 ${
                      reward.used
                        ? "bg-green-900/20 text-green-500 border border-green-500/30"
                        : "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
                    } rounded-none text-xs font-michroma`}
                  >
                    {reward.used ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        CLAIMED
                      </>
                    ) : (
                      "CLAIM"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8 bg-black/40 border border-primary/20">
            <Gift className="w-12 h-12 text-primary/30 mx-auto mb-2" />
            <p className="text-white/50 font-electrolize">No rewards available. Create your first reward!</p>
          </div>
        )}
      </div>
    </div>
  )
}
