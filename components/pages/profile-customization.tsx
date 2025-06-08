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
    // Beginner Titles
    { id: "novice", name: "Novice", cost: 0 },
    { id: "rookie", name: "Rookie Warrior", cost: 500 },

    // Naruto Inspired
    { id: "genin", name: "Genin", cost: 1000 },
    { id: "chunin", name: "Chunin", cost: 2000 },
    { id: "jonin", name: "Jonin", cost: 3500 },
    { id: "anbu", name: "ANBU Black Ops", cost: 5000 },
    { id: "hokage", name: "Hokage", cost: 8000 },
    { id: "sage", name: "Sage of Six Paths", cost: 12000 },

    // One Piece Inspired
    { id: "pirate", name: "Pirate", cost: 1500 },
    { id: "supernova", name: "Supernova", cost: 4000 },
    { id: "warlord", name: "Warlord of the Sea", cost: 7000 },
    { id: "yonko", name: "Yonko", cost: 10000 },
    { id: "pirateking", name: "Pirate King", cost: 15000 },

    // Dragon Ball Inspired
    { id: "earthling", name: "Earthling Warrior", cost: 1200 },
    { id: "saiyan", name: "Saiyan Elite", cost: 3000 },
    { id: "supersaiyan", name: "Super Saiyan", cost: 6000 },
    { id: "godki", name: "God of Destruction", cost: 12000 },
    { id: "ultrainstinct", name: "Ultra Instinct Master", cost: 18000 },

    // Bleach Inspired
    { id: "shinigami", name: "Shinigami", cost: 2500 },
    { id: "lieutenant", name: "Lieutenant", cost: 4500 },
    { id: "captain", name: "Captain", cost: 7500 },
    { id: "espada", name: "Espada", cost: 9000 },
    { id: "transcendent", name: "Transcendent Being", cost: 14000 },

    // JoJo Inspired
    { id: "standuser", name: "Stand User", cost: 2000 },
    { id: "crusader", name: "Stardust Crusader", cost: 5500 },
    { id: "gangstar", name: "Gang-Star", cost: 8500 },

    // My Hero Academia Inspired
    { id: "student", name: "U.A. Student", cost: 1800 },
    { id: "hero", name: "Pro Hero", cost: 4200 },
    { id: "tophero", name: "Top 10 Hero", cost: 8000 },
    { id: "symbolofpeace", name: "Symbol of Peace", cost: 16000 },

    // Attack on Titan Inspired
    { id: "cadet", name: "Survey Corps Cadet", cost: 2200 },
    { id: "soldier", name: "Survey Corps Soldier", cost: 4800 },
    { id: "titanslayer", name: "Titan Slayer", cost: 9500 },
    { id: "humanity", name: "Hope of Humanity", cost: 13000 },

    // Jujutsu Kaisen Inspired
    { id: "sorcerer", name: "Jujutsu Sorcerer", cost: 2800 },
    { id: "grade1", name: "Grade 1 Sorcerer", cost: 6500 },
    { id: "special", name: "Special Grade", cost: 11000 },
    { id: "strongest", name: "The Strongest", cost: 17000 },

    // Solo Leveling Inspired
    { id: "erank", name: "E-Rank Hunter", cost: 800 },
    { id: "drank", name: "D-Rank Hunter", cost: 1600 },
    { id: "crank", name: "C-Rank Hunter", cost: 2400 },
    { id: "brank", name: "B-Rank Hunter", cost: 3200 },
    { id: "arank", name: "A-Rank Hunter", cost: 4800 },
    { id: "srank", name: "S-Rank Hunter", cost: 7200 },
    { id: "nationalrank", name: "National Level Hunter", cost: 10500 },
    { id: "shadowmonarch", name: "Shadow Monarch", cost: 20000 },

    // Demon Slayer Inspired
    { id: "slayer", name: "Demon Slayer", cost: 3200 },
    { id: "hashira", name: "Hashira", cost: 8800 },
    { id: "breathmaster", name: "Breath Master", cost: 12500 },

    // Overlord Inspired
    { id: "adventurer", name: "Adventurer", cost: 1400 },
    { id: "mithril", name: "Mithril Rank", cost: 3800 },
    { id: "adamantite", name: "Adamantite Rank", cost: 7800 },
    { id: "overlord", name: "Supreme Overlord", cost: 15500 },

    // Ultimate Titles
    { id: "legendary", name: "Legendary Warrior", cost: 22000 },
    { id: "mythical", name: "Mythical Being", cost: 25000 },
    { id: "omnipotent", name: "Omnipotent", cost: 30000 },
    { id: "godslayer", name: "God Slayer", cost: 35000 },
    { id: "absolute", name: "Absolute Existence", cost: 50000 },
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

    const cost = 100000 // Most expensive option
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

  // Sort titles by cost for better organization
  const sortedTitles = [...titles].sort((a, b) => a.cost - b.cost)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary font-audiowide glow-text">CUSTOMIZE PROFILE</h1>

      <div className="bg-black/60 backdrop-blur-md border border-primary/30 p-4 animate-border-glow cyberpunk-border holographic-ui mb-4">
        <div className="holographic-header">Current XP</div>
        <div className="text-2xl font-bold text-primary font-orbitron">{player.xp.toLocaleString()} XP</div>
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
                    {avatar.cost > 0 ? `${avatar.cost.toLocaleString()} XP` : "Free"}
                  </div>
                </CardContent>
              </Card>
            ))}
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
                    : title.cost > 10000
                      ? "border-yellow-500/30 hover:border-yellow-500/60"
                      : title.cost > 5000
                        ? "border-purple-500/30 hover:border-purple-500/60"
                        : "border-primary/30 hover:border-primary/60"
                } transition-all duration-300 cursor-pointer quest-card`}
                onClick={() => handleTitleChange(title.name, title.cost)}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div
                      className={`font-michroma text-sm ${
                        title.cost > 10000 ? "text-yellow-400" : title.cost > 5000 ? "text-purple-400" : "text-primary"
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
            <div className="holographic-header text-yellow-400">Ultimate Custom Title (100,000 XP)</div>
            <p className="text-yellow-400/70 text-sm mb-4 font-electrolize">
              Create your own legendary title - the most exclusive option available!
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
