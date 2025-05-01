"use client"

import type React from "react"

import type { Player, Reward } from "@/lib/player"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Trash2, Plus } from "lucide-react"
import { useNotification } from "@/components/notification-provider"
import { motion } from "framer-motion"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RewardsPageProps {
  player: Player
  setPlayer: (player: Player) => void
}

export function RewardsPage({ player, setPlayer }: RewardsPageProps) {
  const { showNotification } = useNotification()
  const [showRewardAnimation, setShowRewardAnimation] = useState(false)
  const [claimedReward, setClaimedReward] = useState<Reward | null>(null)
  const [showCreateReward, setShowCreateReward] = useState(false)
  const [newReward, setNewReward] = useState<{
    title: string
    description: string
    cost: string
    icon: string
  }>({
    title: "",
    description: "",
    cost: "100",
    icon: "star",
  })

  const claimReward = (rewardId: string) => {
    const reward = player.rewards.find((r) => r.id === rewardId)
    if (!reward) return

    // Check if player has enough XP
    if (player.xp < reward.cost) {
      showNotification({
        title: "INSUFFICIENT XP",
        message: "You do not have enough XP to claim this reward.",
      })
      return
    }

    // Deduct XP
    const updatedPlayer = { ...player }
    updatedPlayer.xp -= reward.cost

    // Add to claimed rewards
    if (!updatedPlayer.claimedRewards) {
      updatedPlayer.claimedRewards = []
    }

    updatedPlayer.claimedRewards.unshift({
      ...reward,
      claimedAt: Date.now(),
    })

    // Save player data
    setPlayer(updatedPlayer)

    // Show animation
    setClaimedReward(reward)
    setShowRewardAnimation(true)
  }

  const deleteReward = (rewardId: string) => {
    showNotification({
      title: "DELETE REWARD",
      message: "Are you sure you want to delete this reward?",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: () => {
        const updatedPlayer = { ...player }
        updatedPlayer.rewards = updatedPlayer.rewards.filter((r) => r.id !== rewardId)
        setPlayer(updatedPlayer)
      },
    })
  }

  const handleCreateReward = () => {
    if (!newReward.title || !newReward.description) {
      showNotification({
        title: "MISSING INFORMATION",
        message: "Please fill in all fields to create a reward.",
        type: "warning",
      })
      return
    }

    const cost = Number.parseInt(newReward.cost)
    if (isNaN(cost) || cost <= 0) {
      showNotification({
        title: "INVALID COST",
        message: "Please enter a valid XP cost greater than 0.",
        type: "warning",
      })
      return
    }

    const updatedPlayer = { ...player }
    const newRewardObj: Reward = {
      id: `custom-${Date.now()}`,
      title: newReward.title,
      description: newReward.description,
      cost: cost,
      icon: newReward.icon,
      custom: true,
    }

    updatedPlayer.rewards.push(newRewardObj)
    setPlayer(updatedPlayer)

    // Reset form
    setNewReward({
      title: "",
      description: "",
      cost: "100",
      icon: "star",
    })
    setShowCreateReward(false)

    showNotification({
      title: "REWARD CREATED",
      message: "Your custom reward has been created successfully!",
      type: "success",
    })
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary glow-text solo-text font-audiowide">Rewards</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-primary/10 px-3 py-1 rounded-none">
            <Star className="text-primary w-5 h-5" />
            <span className="text-primary font-bold font-orbitron">{player.xp} XP</span>
          </div>
          <Button
            onClick={() => setShowCreateReward(!showCreateReward)}
            className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider flex items-center space-x-2 btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>NEW REWARD</span>
          </Button>
        </div>
      </div>

      {/* Create Reward Form */}
      {showCreateReward && (
        <Card className="bg-black/80 backdrop-blur-lg p-6 rounded-none border border-primary/30 shadow-[0_0_15px_rgba(0,168,255,0.3)] cyberpunk-border holographic-ui">
          <div className="holographic-header">Create New Reward</div>
          <div className="space-y-4">
            <div>
              <Label className="text-primary/80 block mb-2 font-michroma">Reward Title</Label>
              <Input
                type="text"
                value={newReward.title}
                onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
                className="w-full px-3 py-2 bg-black/60 text-primary border border-primary/30 rounded-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-electrolize"
                placeholder="Enter reward title"
              />
            </div>

            <div>
              <Label className="text-primary/80 block mb-2 font-michroma">Description</Label>
              <Textarea
                value={newReward.description}
                onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                className="w-full px-3 py-2 bg-black/60 text-primary border border-primary/30 rounded-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-24 font-electrolize"
                placeholder="Enter reward description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-primary/80 block mb-2 font-michroma">XP Cost</Label>
                <Input
                  type="number"
                  value={newReward.cost}
                  onChange={(e) => setNewReward({ ...newReward, cost: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 text-primary border border-primary/30 rounded-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-orbitron"
                  min="1"
                />
              </div>

              <div>
                <Label className="text-primary/80 block mb-2 font-michroma">Icon</Label>
                <Select value={newReward.icon} onValueChange={(value) => setNewReward({ ...newReward, icon: value })}>
                  <SelectTrigger className="w-full px-3 py-2 bg-black/60 text-primary border border-primary/30 rounded-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-electrolize">
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border border-primary/30 text-primary font-electrolize">
                    <SelectItem value="star">Star</SelectItem>
                    <SelectItem value="gift">Gift</SelectItem>
                    <SelectItem value="pizza">Food</SelectItem>
                    <SelectItem value="gamepad-2">Gaming</SelectItem>
                    <SelectItem value="dumbbell">Exercise</SelectItem>
                    <SelectItem value="book">Book</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="tv">Entertainment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleCreateReward}
                className="flex-1 py-3 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary font-michroma"
              >
                CREATE REWARD
              </Button>
              <Button
                onClick={() => setShowCreateReward(false)}
                className="py-3 px-4 bg-black/60 hover:bg-black/80 text-primary/70 hover:text-primary rounded-none border border-primary/30 transition-colors font-michroma"
              >
                CANCEL
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Customized Rewards */}
      <Card className="bg-black/80 backdrop-blur-lg p-6 rounded-none border border-primary/30 shadow-[0_0_15px_rgba(0,168,255,0.3)] cyberpunk-border holographic-ui">
        <div className="holographic-header">Available Rewards</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {player.rewards.map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-black/60 p-4 rounded-none border border-primary/30 quest-card holographic-ui"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-none bg-primary/10 flex items-center justify-center">
                    <LucideIcon name={reward.icon} className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary font-michroma">{reward.title}</h3>
                </div>
                <span className="text-primary/70 font-orbitron">{reward.cost} XP</span>
              </div>
              <p className="text-primary/60 mt-2 font-electrolize">{reward.description}</p>
              <div className="flex space-x-2 mt-4">
                <Button
                  onClick={() => claimReward(reward.id)}
                  className={`flex-1 py-2 rounded-none border transition-colors tracking-wider ${
                    player.xp >= reward.cost
                      ? "bg-primary/20 hover:bg-primary/30 text-primary border-primary/30 btn-primary"
                      : "bg-gray-800/50 text-gray-500 border-gray-700 cursor-not-allowed"
                  }`}
                  disabled={player.xp < reward.cost}
                >
                  {player.xp >= reward.cost ? "CLAIM REWARD" : "INSUFFICIENT XP"}
                </Button>
                {reward.custom && (
                  <Button
                    onClick={() => deleteReward(reward.id)}
                    className="py-2 px-3 bg-black/60 hover:bg-red-900/30 text-primary/70 hover:text-red-400 rounded-none border border-primary/30 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      <Card className="bg-black/80 backdrop-blur-lg p-6 rounded-none border border-primary/30 shadow-[0_0_15px_rgba(0,168,255,0.3)] cyberpunk-border holographic-ui">
        <div className="holographic-header">Claimed Rewards</div>
        {player.claimedRewards && player.claimedRewards.length > 0 ? (
          <div className="space-y-3">
            {player.claimedRewards.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-black/60 p-3 rounded-none border border-primary/30 flex justify-between items-center quest-card"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-none bg-primary/10 flex items-center justify-center">
                    <LucideIcon name={reward.icon} className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-primary font-michroma">{reward.title}</h4>
                    <p className="text-primary/60 text-sm font-electrolize">
                      {new Date(reward.claimedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-primary/70 font-orbitron">-{reward.cost} XP</div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-primary/60 font-electrolize">No rewards claimed yet. Use your XP to claim rewards!</p>
        )}
      </Card>

      {/* Reward Claimed Animation */}
      {showRewardAnimation && claimedReward && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowRewardAnimation(false)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="holographic-ui max-w-md w-full mx-4 relative overflow-hidden p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="animate-rotate absolute -z-10 inset-0 opacity-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,168,255,0.3),transparent_70%)]"></div>
            </div>

            <h2 className="text-3xl font-bold text-primary glow-text solo-text font-audiowide text-center mb-4">
              Reward Claimed!
            </h2>

            <div className="w-16 h-16 mx-auto mb-4 rounded-none bg-primary/20 flex items-center justify-center animate-pulse-glow">
              <LucideIcon name={claimedReward.icon} className="w-8 h-8 text-primary" />
            </div>

            <div className="text-2xl font-bold mb-2 font-michroma text-center text-primary">{claimedReward.title}</div>

            <div className="text-primary/70 mb-6 font-electrolize text-center">{claimedReward.description}</div>

            <div className="flex justify-center">
              <Button
                onClick={() => setShowRewardAnimation(false)}
                className="px-6 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary font-michroma"
              >
                CONTINUE
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

// Helper component to render Lucide icons by name
function LucideIcon({ name, className }: { name: string; className?: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    pizza: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M15 11h.01" />
        <path d="M11 15h.01" />
        <path d="M16 16h.01" />
        <path d="m2 16 20 6-6-20A20 20 0 0 0 2 16" />
        <path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4" />
      </svg>
    ),
    "gamepad-2": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <line x1="6" x2="10" y1="11" y2="11" />
        <line x1="8" x2="8" y1="9" y2="13" />
        <line x1="15" x2="15.01" y1="12" y2="12" />
        <line x1="18" x2="18.01" y1="10" y2="10" />
        <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.544-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.152A4 4 0 0 0 17.32 5z" />
      </svg>
    ),
    star: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    gift: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
    dumbbell: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="m6.5 6.5 11 11" />
        <path d="m21 21-1-1" />
        <path d="m3 3 1 1" />
        <path d="m18 22 4-4" />
        <path d="m2 6 4-4" />
        <path d="m3 10 7-7" />
        <path d="m14 21 7-7" />
      </svg>
    ),
    book: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    music: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
    tv: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
        <polyline points="17 2 12 7 7 2" />
      </svg>
    ),
  }

  return <>{iconMap[name] || <Star className={className} />}</>
}
