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
    {
      id: "naruto",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-01%20115033-6lClIZcZoLhwCUM8mSy44f0xgJMDMA.png",
      name: "Naruto Uzumaki",
      cost: 1000,
    },
    {
      id: "luffy",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-01%20115311-caMxeuENU2iyGhKc2vQtZRBbggnu9W.png",
      name: "Monkey D. Luffy",
      cost: 1000,
    },
    {
      id: "zoro",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-01%20115145-X17b3RGK4k7UQ9iViYQLkJLUnY4pp5.png",
      name: "Roronoa Zoro",
      cost: 1000,
    },
    {
      id: "goku",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-01%20115353-ugxWsBRw387pv3V7stugQ6B8aP9raP.png",
      name: "Son Goku",
      cost: 1500,
    },
    {
      id: "aizen",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-01%20123202-f206cSlWYcWXXs4GXMOWoNepjklx4s.png",
      name: "Sosuke Aizen",
      cost: 2000,
    },
    {
      id: "madara",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-01%20115452-ZTmvHWsgSEEjmvMoF7K56sYsz6HWTN.png",
      name: "Madara Uchiha",
      cost: 2000,
    },
    {
      id: "allmight",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-01%20115631-D53jZVDDhvZtk3wjRlvf034Pv9Kiqv.png",
      name: "All Might",
      cost: 1500,
    },
    {
      id: "jotaro",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-01%20115720-dxmeetj2yzJPkE7lPN4E4izfdeD19T.png",
      name: "Jotaro Kujo",
      cost: 2000,
    },
    {
      id: "gojo",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-01%20115818-ynZObcME925YPTfLNgx2rKS09fV8Er.png",
      name: "Satoru Gojo",
      cost: 2500,
    },
    {
      id: "toji",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-01%20115854-D1EowuCrRylR0Xt0uzJ7lveF8hRkaP.png",
      name: "Toji Fushiguro",
      cost: 3000,
    },
  ]

  const titles = [
    { id: "novice", name: "Novice Hunter", cost: 0 },
    { id: "apprentice", name: "Apprentice Hunter", cost: 1000 },
    { id: "adept", name: "Skilled Hunter", cost: 2000 },
    { id: "veteran", name: "Elite Hunter", cost: 3000 },
    { id: "master", name: "Master Hunter", cost: 5000 },
    { id: "legendary", name: "Legendary Hunter", cost: 7500 },
    { id: "godlike", name: "God-level Hunter", cost: 10000 },
    { id: "transcendent", name: "Transcendent Being", cost: 15000 },
  ]

  const handleAvatarChange = (avatarSrc: string, cost: number, name: string) => {
    if (cost > 0 && player.xp < cost) {
      addNotification(`Not enough XP. You need ${cost} XP to unlock ${name}.`, "error")
      return
    }

    const updatedPlayer = {
      ...player,
      avatar: avatarSrc,
      xp: cost > 0 ? player.xp - cost : player.xp,
    }

    setPlayer(updatedPlayer)
    addNotification(`Avatar changed to ${name}!`, "success")
  }

  const handleTitleChange = (title: string, cost: number) => {
    if (cost > 0 && player.xp < cost) {
      addNotification(`Not enough XP. You need ${cost} XP to unlock this title.`, "error")
      return
    }

    const updatedPlayer = {
      ...player,
      title,
      xp: cost > 0 ? player.xp - cost : player.xp,
    }

    setPlayer(updatedPlayer)
    addNotification("Title changed successfully!", "success")
  }

  const handleCustomTitleChange = () => {
    if (!customTitle.trim()) {
      addNotification("Please enter a custom title", "error")
      return
    }

    const cost = 5000
    if (player.xp < cost) {
      addNotification(`Not enough XP. You need ${cost} XP to create a custom title.`, "error")
      return
    }

    const updatedPlayer = {
      ...player,
      title: customTitle.trim(),
      xp: player.xp - cost,
    }

    setPlayer(updatedPlayer)
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {avatars.map((avatar) => (
              <Card
                key={avatar.id}
                className={`bg-black/60 backdrop-blur-md border ${
                  player.avatar === avatar.src
                    ? "border-primary animate-border-glow"
                    : "border-primary/30 hover:border-primary/60"
                } transition-all duration-300 cursor-pointer quest-card`}
                onClick={() => handleAvatarChange(avatar.src, avatar.cost, avatar.name)}
              >
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/50 mb-3 animate-pulse-glow">
                    <img
                      src={avatar.src || "/placeholder.svg?height=80&width=80"}
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: "center" }}
                    />
                  </div>
                  <div className="text-primary font-michroma text-xs text-center mb-1">{avatar.name}</div>
                  <div className="text-white/70 font-orbitron text-xs">
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
                } transition-all duration-300 cursor-pointer quest-card`}
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
            <div className="holographic-header">Custom Title (5000 XP)</div>
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
