"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNotification } from "@/components/notification-provider"
import type { Player } from "@/lib/player"
import { computeAvatarCost } from "@/lib/xp"

interface ProfileCustomizationPageProps {
  player: Player
  setPlayer: (player: Player) => void
}

type AvatarOption = { id: string; src: string; name: string; baseCost?: number }

export function ProfileCustomizationPage({ player, setPlayer }: ProfileCustomizationPageProps) {
  const { addNotification } = useNotification()
  const [customTitle, setCustomTitle] = useState("")

  const avatars: AvatarOption[] = [
    { id: "default", src: "/avatars/default.png", name: "Default", baseCost: 0 },
    {
      id: "naruto",
      src: "/naruto-anime-avatar.jpg",
      name: "Naruto Uzumaki",
      baseCost: 600,
    },
    {
      id: "luffy",
      src: "/luffy-anime-avatar.jpg",
      name: "Monkey D. Luffy",
      baseCost: 600,
    },
    {
      id: "zoro",
      src: "/zoro-anime-avatar.jpg",
      name: "Roronoa Zoro",
      baseCost: 700,
    },
    {
      id: "goku",
      src: "/goku-anime-avatar.jpg",
      name: "Son Goku",
      baseCost: 800,
    },
    {
      id: "aizen",
      src: "/aizen-anime-avatar.jpg",
      name: "Sosuke Aizen",
      baseCost: 1000,
    },
    {
      id: "madara",
      src: "/madara-anime-avatar.jpg",
      name: "Madara Uchiha",
      baseCost: 1000,
    },
    {
      id: "allmight",
      src: "/all-might-anime-avatar.jpg",
      name: "All Might",
      baseCost: 800,
    },
    {
      id: "jotaro",
      src: "/jotaro-anime-avatar.jpg",
      name: "Jotaro Kujo",
      baseCost: 900,
    },
    {
      id: "gojo",
      src: "/gojo-anime-avatar.jpg",
      name: "Satoru Gojo",
      baseCost: 1200,
    },
    {
      id: "toji",
      src: "/toji-anime-avatar.jpg",
      name: "Toji Fushiguro",
      baseCost: 1300,
    },
  ]

  const titles = [
    { id: "novice", name: "Novice", cost: 0 },
    { id: "rookie", name: "Rookie Warrior", cost: 400 },
    { id: "genin", name: "Genin", cost: 800 },
    { id: "chunin", name: "Chunin", cost: 1400 },
    { id: "jonin", name: "Jonin", cost: 2200 },
    { id: "anbu", name: "ANBU Black Ops", cost: 3500 },
    { id: "hokage", name: "Hokage", cost: 6000 },
    { id: "pirate", name: "Pirate", cost: 1000 },
    { id: "yonko", name: "Yonko", cost: 7000 },
    { id: "pirateking", name: "Pirate King", cost: 12000 },
    { id: "supersaiyan", name: "Super Saiyan", cost: 8000 },
    { id: "shadowmonarch", name: "Shadow Monarch", cost: 15000 },
  ]

  const handleAvatarChange = (option: AvatarOption) => {
    const cost = computeAvatarCost(player.lifetimeXp, option.baseCost)
    if (cost > 0 && player.xp < cost) {
      addNotification(`Not enough XP. You need ${cost} XP to unlock ${option.name}.`, "error")
      return
    }

    const updatedPlayer: Player = {
      ...player,
      avatar: option.src,
      xp: cost > 0 ? player.xp - cost : player.xp,
      activityLog: [
        ...(player.activityLog || []),
        {
          id: cryptoRandomId(),
          date: new Date().toISOString(),
          type: "avatar-change",
          title: `Changed avatar to ${option.name}`,
          xpChange: -cost,
          notes: "Proportional cost based on lifetime XP",
        },
      ],
    }

    setPlayer(updatedPlayer)
    addNotification(`Avatar changed to ${option.name}! (-${cost} XP)`, "success")
  }

  const handleTitleChange = (title: string, cost: number) => {
    if (cost > 0 && player.xp < cost) {
      addNotification(`Not enough XP. You need ${cost} XP to unlock this title.`, "error")
      return
    }

    const updatedPlayer: Player = {
      ...player,
      title,
      xp: cost > 0 ? player.xp - cost : player.xp,
      activityLog: [
        ...(player.activityLog || []),
        {
          id: cryptoRandomId(),
          date: new Date().toISOString(),
          type: "title-change",
          title: `Changed title to ${title}`,
          xpChange: -cost,
        },
      ],
    }

    setPlayer(updatedPlayer)
    addNotification("Title changed successfully!", "success")
  }

  const handleCustomTitleChange = () => {
    if (!customTitle.trim()) {
      addNotification("Please enter a custom title", "error")
      return
    }

    // Proportional price for custom title: 3% of lifetime XP, min 2,500, max 25,000
    const proportional = Math.round((player.lifetimeXp || 0) * 0.03)
    const cost = Math.max(2500, Math.min(25000, proportional))
    if (player.xp < cost) {
      addNotification(`Not enough XP. You need ${cost} XP to create a custom title.`, "error")
      return
    }

    const updatedPlayer: Player = {
      ...player,
      title: customTitle.trim(),
      xp: player.xp - cost,
      activityLog: [
        ...(player.activityLog || []),
        {
          id: cryptoRandomId(),
          date: new Date().toISOString(),
          type: "title-change",
          title: `Custom title: ${customTitle.trim()}`,
          xpChange: -cost,
        },
      ],
    }

    setPlayer(updatedPlayer)
    addNotification(`Custom title created! (-${cost} XP)`, "success")
    setCustomTitle("")
  }

  const sortedTitles = [...titles].sort((a, b) => a.cost - b.cost)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary font-audiowide glow-text">CUSTOMIZE PROFILE</h1>

      <div className="bg-black/60 backdrop-blur-md border border-primary/30 p-4 animate-border-glow cyberpunk-border holographic-ui mb-4">
        <div className="holographic-header">Current XP</div>
        <div className="text-2xl font-bold text-primary font-orbitron">{player.xp.toLocaleString()} XP</div>
        <div className="text-xs text-white/50 mt-1 font-electrolize">
          Lifetime XP: <span className="text-primary/80">{(player.lifetimeXp || 0).toLocaleString()}</span>
        </div>
      </div>

      <Tabs defaultValue="avatar" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6 bg-black/60 border border-primary/30">
          <TabsTrigger
            value="avatar"
            className="font-michroma data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            AVATAR
          </TabsTrigger>
          <TabsTrigger
            value="title"
            className="font-michroma data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            TITLE
          </TabsTrigger>
        </TabsList>

        <TabsContent value="avatar" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {avatars.map((option) => {
              const cost = computeAvatarCost(player.lifetimeXp, option.baseCost)
              const isCurrent = player.avatar === option.src
              return (
                <Card
                  key={option.id}
                  className={`bg-black/60 backdrop-blur-md border ${
                    isCurrent ? "border-primary animate-border-glow" : "border-primary/30 hover:border-primary/60"
                  } transition-all duration-300 cursor-pointer quest-card`}
                  onClick={() => handleAvatarChange(option)}
                >
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/50 mb-3 animate-pulse-glow">
                      <img
                        src={option.src || "/placeholder.svg?height=80&width=80&query=anime+avatar"}
                        alt={option.name}
                        className="w-full h-full object-cover"
                        style={{ objectPosition: "center" }}
                      />
                    </div>
                    <div className="text-primary font-michroma text-xs text-center mb-1">{option.name}</div>
                    <div className={`text-xs font-orbitron ${player.xp < cost ? "text-red-400" : "text-white/70"}`}>
                      {cost > 0 ? `${cost.toLocaleString()} XP` : "Free"}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="title" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sortedTitles.map((title) => (
              <Card
                key={title.id}
                className={`bg-black/60 backdrop-blur-md border ${
                  player.title === title.name
                    ? "border-primary animate-border-glow"
                    : title.cost > 7000
                      ? "border-yellow-500/30 hover:border-yellow-500/60"
                      : title.cost > 3000
                        ? "border-purple-500/30 hover:border-purple-500/60"
                        : "border-primary/30 hover:border-primary/60"
                } transition-all duration-300 cursor-pointer quest-card`}
                onClick={() => handleTitleChange(title.name, title.cost)}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div
                      className={`font-michroma text-sm ${
                        title.cost > 7000 ? "text-yellow-400" : title.cost > 3000 ? "text-purple-400" : "text-primary"
                      }`}
                    >
                      {title.name}
                    </div>
                    <div className="text-white/70 font-orbitron text-xs">
                      {title.cost > 0 ? `${title.cost.toLocaleString()} XP` : "Free"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-black/60 backdrop-blur-md border border-yellow-500/50 p-6 animate-border-glow cyberpunk-border holographic-ui">
            <div className="holographic-header text-yellow-400">Pro Custom Title (proportional)</div>
            <p className="text-yellow-400/70 text-sm mb-4 font-electrolize">
              Price scales with your lifetime XP (3% of lifetime XP, min 2,500).
            </p>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor="custom-title" className="sr-only">
                  Custom Title
                </Label>
                <Input
                  id="custom-title"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="bg-black/60 border-yellow-500/30 text-yellow-400 placeholder:text-yellow-400/50 font-electrolize"
                  placeholder="Enter your legendary title"
                  maxLength={30}
                />
              </div>
              <Button
                onClick={handleCustomTitleChange}
                className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-none border border-yellow-500/30 transition-colors tracking-wider btn-primary"
              >
                CREATE
              </Button>
            </div>
            <div className="text-yellow-400/60 text-xs mt-2 font-orbitron">{customTitle.length}/30 characters</div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function cryptoRandomId() {
  // Safe enough for UI ids
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
}
