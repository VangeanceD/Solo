"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNotification } from "@/components/notification-provider"
import type { Player } from "@/lib/player"

interface ProfileCustomizationPageProps {
  player: Player
  setPlayer: (player: Player) => void
}

export function ProfileCustomizationPage({ player, setPlayer }: ProfileCustomizationPageProps) {
  const { addNotification } = useNotification()
  const [customTitle, setCustomTitle] = useState("")

  const avatars = [
    { id: "default", src: "/avatars/default.png", name: "Default", cost: 0 },
    { id: "naruto", src: "/avatars/naruto.png", name: "Naruto", cost: 1000 },
    { id: "luffy", src: "/avatars/luffy.png", name: "Luffy", cost: 1000 },
    { id: "goku", src: "/avatars/goku.png", name: "Goku", cost: 1000 },
    { id: "aizen", src: "/avatars/aizen.png", name: "Aizen", cost: 1500 },
    { id: "madara", src: "/avatars/madara.png", name: "Madara", cost: 1500 },
    { id: "allmight", src: "/avatars/allmight.png", name: "All Might", cost: 1500 },
    { id: "jotaro", src: "/avatars/jotaro.png", name: "Jotaro", cost: 2000 },
    { id: "gojo", src: "/avatars/gojo.png", name: "Gojo", cost: 2000 },
    { id: "toji", src: "/avatars/toji.png", name: "Toji Fushiguro", cost: 2000 },
  ]

  const titles = [
    { id: "novice", name: "Novice Hunter", cost: 0 },
    { id: "apprentice", name: "Apprentice Hunter", cost: 500 },
    { id: "adept", name: "Adept Hunter", cost: 1000 },
    { id: "veteran", name: "Veteran Hunter", cost: 2000 },
    { id: "elite", name: "Elite Hunter", cost: 3000 },
    { id: "master", name: "Master Hunter", cost: 5000 },
    { id: "legendary", name: "Legendary Hunter", cost: 7500 },
    { id: "godlike", name: "God-level Hunter", cost: 10000 },
  ]

  const handleAvatarChange = (avatarSrc: string, cost: number) => {
    if (player.xp < cost) {
      addNotification(`Not enough XP. You need ${cost} XP to unlock this avatar.`, "error")
      return
    }

    setPlayer({
      ...player,
      avatar: avatarSrc,
      xp: player.xp - (cost > 0 ? cost : 0),
    })

    addNotification("Avatar changed successfully!", "success")
  }

  const handleTitleChange = (title: string, cost: number) => {
    if (player.xp < cost) {
      addNotification(`Not enough XP. You need ${cost} XP to unlock this title.`, "error")
      return
    }

    setPlayer({
      ...player,
      title,
      xp: player.xp - (cost > 0 ? cost : 0),
    })

    addNotification("Title changed successfully!", "success")
  }

  const handleCustomTitleChange = () => {
    if (!customTitle.trim()) {
      addNotification("Please enter a custom title", "error")
      return
    }

    const cost = 2000
    if (player.xp < cost) {
      addNotification(`Not enough XP. You need ${cost} XP to create a custom title.`, "error")
      return
    }

    setPlayer({
      ...player,
      title: customTitle,
      xp: player.xp - cost,
    })

    addNotification("Custom title created successfully!", "success")
    setCustomTitle("")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary font-audiowide glow-text">CUSTOMIZE PROFILE</h1>

      <div className="bg-black/60 backdrop-blur-md border border-primary/30 p-4 animate-border-glow cyberpunk-border holographic-ui mb-4">
        <div className="holographic-header">Current XP</div>
        <div className="text-2xl font-bold text-primary font-orbitron">{player.xp} XP</div>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {avatars.map((avatar) => (
              <Card
                key={avatar.id}
                className={`bg-black/60 backdrop-blur-md border ${
                  player.avatar === avatar.src
                    ? "border-primary animate-border-glow"
                    : "border-primary/30 hover:border-primary/60"
                } transition-all duration-300 cursor-pointer`}
                onClick={() => handleAvatarChange(avatar.src, avatar.cost)}
              >
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden border border-primary/30 mb-2">
                    <img
                      src={avatar.src || "/placeholder.svg?height=80&width=80"}
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-primary font-michroma text-sm text-center">{avatar.name}</div>
                  <div className="text-white/70 font-orbitron text-xs mt-1">
                    {avatar.cost > 0 ? `${avatar.cost} XP` : "Free"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="title" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {titles.map((title) => (
              <Card
                key={title.id}
                className={`bg-black/60 backdrop-blur-md border ${
                  player.title === title.name
                    ? "border-primary animate-border-glow"
                    : "border-primary/30 hover:border-primary/60"
                } transition-all duration-300 cursor-pointer`}
                onClick={() => handleTitleChange(title.name, title.cost)}
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="text-primary font-michroma">{title.name}</div>
                  <div className="text-white/70 font-orbitron text-sm">
                    {title.cost > 0 ? `${title.cost} XP` : "Free"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-black/60 backdrop-blur-md border border-primary/30 p-6 animate-border-glow cyberpunk-border holographic-ui">
            <div className="holographic-header">Custom Title (2000 XP)</div>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor="custom-title" className="sr-only">
                  Custom Title
                </Label>
                <Input
                  id="custom-title"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="bg-black/60 border-primary/30 text-white font-electrolize"
                  placeholder="Enter custom title"
                />
              </div>
              <Button
                onClick={handleCustomTitleChange}
                className="bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary"
              >
                CREATE
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
