"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Player } from "@/lib/player"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNotification } from "@/components/notification-provider"
import { motion } from "framer-motion"
import Image from "next/image"
import { Upload, Star, Check } from "lucide-react"

interface ProfileCustomizationProps {
  player: Player
  setPlayer: (player: Player) => void
}

// Anime profile options with character names, series, and XP cost
const animeProfiles = [
  {
    id: "naruto",
    name: "Naruto",
    series: "Naruto",
    image: "/images/naruto.png",
    cost: 2000,
    quote: "Believe it! I'm going to be Hokage someday!",
  },
  {
    id: "luffy",
    name: "Luffy",
    series: "One Piece",
    image: "/images/luffy.png",
    cost: 2000,
    quote: "I'm gonna be King of the Pirates!",
  },
  {
    id: "zoro",
    name: "Zoro",
    series: "One Piece",
    image: "/images/zoro.png",
    cost: 2500,
    quote: "I'm going to be the world's greatest swordsman!",
  },
  {
    id: "goku",
    name: "Goku",
    series: "Dragon Ball",
    image: "/images/goku.png",
    cost: 3000,
    quote: "I am the hope of the universe. I am the answer to all living things that cry out for peace.",
  },
  {
    id: "aizen",
    name: "Aizen",
    series: "Bleach",
    image: "/images/aizen.png",
    cost: 3500,
    quote: "All things in the universe are mine to use as I see fit.",
  },
  {
    id: "madara",
    name: "Madara",
    series: "Naruto",
    image: "/images/madara.png",
    cost: 4000,
    quote: "Wake up to reality! Nothing ever goes as planned in this world.",
  },
  {
    id: "allmight",
    name: "All Might",
    series: "My Hero Academia",
    image: "/images/allmight.png",
    cost: 3000,
    quote: "Go beyond! Plus Ultra!",
  },
  {
    id: "jotaro",
    name: "Jotaro",
    series: "JoJo's Bizarre Adventure",
    image: "/images/jotaro.png",
    cost: 3500,
    quote: "Yare yare daze...",
  },
  {
    id: "gojo",
    name: "Gojo",
    series: "Jujutsu Kaisen",
    image: "/images/gojo.png",
    cost: 4000,
    quote: "Throughout Heaven and Earth, I alone am the honored one.",
  },
  {
    id: "sukuna",
    name: "Sukuna",
    series: "Jujutsu Kaisen",
    image: "/images/sukuna.png",
    cost: 4500,
    quote: "Know your place, fool.",
  },
  {
    id: "toji",
    name: "Toji Fushiguro",
    series: "Jujutsu Kaisen",
    image: "/images/toji.png",
    cost: 5000,
    quote: "I'm just a monkey with no cursed energy.",
  },
]

// Anime-inspired titles with XP costs
const animeTitles = [
  { id: "hokage", name: "Hokage", cost: 2000 },
  { id: "shinigami", name: "Shinigami", cost: 2500 },
  { id: "pirate-king", name: "Pirate King", cost: 3000 },
  { id: "hero", name: "Pro Hero", cost: 2000 },
  { id: "stand-user", name: "Stand User", cost: 2500 },
  { id: "alchemist", name: "State Alchemist", cost: 2000 },
  { id: "titan", name: "Titan Slayer", cost: 3000 },
  { id: "hunter", name: "Hunter", cost: 2000 },
  { id: "saiyan", name: "Saiyan Warrior", cost: 3500 },
  { id: "soul-reaper", name: "Soul Reaper", cost: 2500 },
  { id: "sorcerer", name: "Jujutsu Sorcerer", cost: 3000 },
  { id: "demon-slayer", name: "Demon Slayer", cost: 3000 },
  { id: "shinobi", name: "Elite Shinobi", cost: 2500 },
  { id: "god-level", name: "God Level Threat", cost: 10000 },
]

export function ProfileCustomizationPage({ player, setPlayer }: ProfileCustomizationProps) {
  const [selectedTab, setSelectedTab] = useState("avatars")
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showNotification } = useNotification()

  // Function to handle image loading errors
  const handleImageError = (avatarId: string) => {
    setImageErrors((prev) => ({ ...prev, [avatarId]: true }))
  }

  // Function to get fallback image URL
  const getImageUrl = (avatar: { id: string; image: string }) => {
    if (imageErrors[avatar.id]) {
      // Fallback to a placeholder if the image fails to load
      return `/placeholder.svg?height=80&width=80&text=${avatar.name}`
    }
    return avatar.image
  }

  // Check if images exist on component mount
  useEffect(() => {
    // Preload images to check if they exist
    animeProfiles.forEach((avatar) => {
      const img = new Image()
      img.src = avatar.image
      img.onerror = () => handleImageError(avatar.id)
    })
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showNotification({
        title: "FILE TOO LARGE",
        message: "Image must be less than 2MB",
        type: "error",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const applyAvatar = (avatarId: string) => {
    const avatar = animeProfiles.find((a) => a.id === avatarId)
    if (!avatar) return

    if (player.xp < avatar.cost) {
      showNotification({
        title: "INSUFFICIENT XP",
        message: `You need ${avatar.cost} XP to unlock this avatar`,
        type: "error",
      })
      return
    }

    showNotification({
      title: "CONFIRM PURCHASE",
      message: `Do you want to spend ${avatar.cost} XP to unlock the ${avatar.name} avatar?`,
      confirmText: "Purchase",
      cancelText: "Cancel",
      onConfirm: () => {
        const updatedPlayer = { ...player }
        updatedPlayer.xp -= avatar.cost
        updatedPlayer.profilePicture = imageErrors[avatarId]
          ? `/placeholder.svg?height=128&width=128&text=${avatar.name}`
          : avatar.image

        // Add a special quote as a title if they don't have it yet
        if (!updatedPlayer.titles.includes(avatar.quote)) {
          updatedPlayer.titles.push(avatar.quote)
        }

        setPlayer(updatedPlayer)

        showNotification({
          title: "AVATAR UNLOCKED",
          message: `You have unlocked the ${avatar.name} avatar and a special title!`,
          type: "success",
        })
      },
    })
  }

  const applyCustomAvatar = () => {
    if (!uploadedImage) return

    const xpCost = 5000 // Increased custom avatar cost

    if (player.xp < xpCost) {
      showNotification({
        title: "INSUFFICIENT XP",
        message: `You need ${xpCost} XP to set a custom avatar`,
        type: "error",
      })
      return
    }

    showNotification({
      title: "CONFIRM PURCHASE",
      message: `Do you want to spend ${xpCost} XP to set your custom avatar?`,
      confirmText: "Purchase",
      cancelText: "Cancel",
      onConfirm: () => {
        const updatedPlayer = { ...player }
        updatedPlayer.xp -= xpCost
        updatedPlayer.profilePicture = uploadedImage

        setPlayer(updatedPlayer)

        showNotification({
          title: "AVATAR UPDATED",
          message: "Your custom avatar has been set!",
          type: "success",
        })
      },
    })
  }

  const applyTitle = (titleId: string) => {
    const title = animeTitles.find((t) => t.id === titleId)
    if (!title) return

    // Check if player already has this title
    const hasTitle = player.titles.includes(title.name)

    if (!hasTitle && player.xp < title.cost) {
      showNotification({
        title: "INSUFFICIENT XP",
        message: `You need ${title.cost} XP to unlock this title`,
        type: "error",
      })
      return
    }

    if (!hasTitle) {
      // Purchase new title
      showNotification({
        title: "CONFIRM PURCHASE",
        message: `Do you want to spend ${title.cost} XP to unlock the "${title.name}" title?`,
        confirmText: "Purchase",
        cancelText: "Cancel",
        onConfirm: () => {
          const updatedPlayer = { ...player }
          updatedPlayer.xp -= title.cost
          updatedPlayer.titles.push(title.name)
          updatedPlayer.selectedTitle = title.name

          setPlayer(updatedPlayer)

          showNotification({
            title: "TITLE UNLOCKED",
            message: `You have unlocked and equipped the "${title.name}" title!`,
            type: "success",
          })
        },
      })
    } else {
      // Just equip the title
      const updatedPlayer = { ...player }
      updatedPlayer.selectedTitle = title.name
      setPlayer(updatedPlayer)

      showNotification({
        title: "TITLE EQUIPPED",
        message: `You have equipped the "${title.name}" title!`,
        type: "success",
      })
    }
  }

  const applyQuoteTitle = (quote: string) => {
    // Check if player has this quote title
    const hasTitle = player.titles.includes(quote)

    if (!hasTitle) {
      showNotification({
        title: "TITLE LOCKED",
        message: "You need to purchase the corresponding avatar to unlock this title",
        type: "error",
      })
      return
    }

    // Equip the title
    const updatedPlayer = { ...player }
    updatedPlayer.selectedTitle = quote
    setPlayer(updatedPlayer)

    showNotification({
      title: "TITLE EQUIPPED",
      message: "You have equipped the quote title!",
      type: "success",
    })
  }

  // Function to create default avatar images
  const createDefaultAvatar = (name: string) => {
    return `/placeholder.svg?height=80&width=80&text=${name}`
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className="bg-black/80 backdrop-blur-lg p-6 rounded-none border border-primary/30 shadow-[0_0_15px_rgba(0,168,255,0.3)] cyberpunk-border holographic-ui">
        <div className="holographic-header">Profile Customization</div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary glow-text solo-text font-audiowide">Customize Your Hunter</h2>
          <div className="flex items-center space-x-2 bg-primary/10 px-3 py-1 rounded-none">
            <Star className="text-primary w-5 h-5" />
            <span className="text-primary font-bold font-orbitron">{player.xp} XP</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <div className="bg-black/60 p-4 rounded-none border border-primary/30 mb-4">
              <h3 className="text-lg font-bold text-primary mb-3 font-michroma">Current Profile</h3>
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mb-4 animate-pulse-glow overflow-hidden border-2 border-primary">
                  {player.profilePicture ? (
                    <Image
                      src={player.profilePicture || "/placeholder.svg"}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover rounded-full"
                      onError={() => {
                        // If profile picture fails to load, use first letter of name
                        const updatedPlayer = { ...player }
                        updatedPlayer.profilePicture = `/placeholder.svg?height=128&width=128&text=${player.name.charAt(0).toUpperCase()}`
                        setPlayer(updatedPlayer)
                      }}
                    />
                  ) : (
                    <span className="text-5xl font-bold text-primary solo-text font-michroma">
                      {player.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-bold text-white font-michroma">{player.name}</h4>
                  {player.selectedTitle && (
                    <span className="text-sm bg-primary/20 px-2 py-1 text-primary/80 font-electrolize mt-1 inline-block">
                      {player.selectedTitle}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <Tabs defaultValue="avatars" className="w-full" onValueChange={setSelectedTab}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger
                  value="avatars"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  Anime Avatars
                </TabsTrigger>
                <TabsTrigger
                  value="custom"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  Custom Avatar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="avatars" className="mt-0">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2">
                  {animeProfiles.map((avatar) => (
                    <div
                      key={avatar.id}
                      className={`bg-black/60 p-3 rounded-none border transition-colors cursor-pointer ${
                        selectedAvatar === avatar.id
                          ? "border-primary animate-border-glow"
                          : "border-primary/30 hover:border-primary/60"
                      }`}
                      onClick={() => setSelectedAvatar(avatar.id)}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full overflow-hidden mb-2 border border-primary/50">
                          <Image
                            src={getImageUrl(avatar) || "/placeholder.svg"}
                            alt={avatar.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover rounded-full"
                            onError={() => handleImageError(avatar.id)}
                          />
                        </div>
                        <h4 className="text-primary font-michroma text-center">{avatar.name}</h4>
                        <p className="text-primary/60 text-xs font-electrolize text-center">{avatar.series}</p>
                        <div className="flex items-center mt-2 text-primary/80 font-orbitron text-sm">
                          <Star className="w-4 h-4 mr-1" />
                          {avatar.cost} XP
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedAvatar && (
                  <div className="mt-4 bg-black/60 p-4 rounded-none border border-primary/30">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary">
                        <Image
                          src={getImageUrl(animeProfiles.find((a) => a.id === selectedAvatar) || animeProfiles[0])}
                          alt="Selected Avatar"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover rounded-full"
                          onError={() => selectedAvatar && handleImageError(selectedAvatar)}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-primary font-michroma">
                          {animeProfiles.find((a) => a.id === selectedAvatar)?.name}
                        </h4>
                        <p className="text-primary/60 font-electrolize italic mb-2">
                          "{animeProfiles.find((a) => a.id === selectedAvatar)?.quote}"
                        </p>
                        <p className="text-primary/80 text-sm font-electrolize">
                          From {animeProfiles.find((a) => a.id === selectedAvatar)?.series}
                        </p>
                        <Button
                          onClick={() => selectedAvatar && applyAvatar(selectedAvatar)}
                          className="mt-3 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary font-michroma"
                        >
                          APPLY ({animeProfiles.find((a) => a.id === selectedAvatar)?.cost} XP)
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="custom" className="mt-0">
                <div className="bg-black/60 p-4 rounded-none border border-primary/30">
                  <h3 className="text-lg font-bold text-primary mb-3 font-michroma">Upload Custom Avatar</h3>
                  <p className="text-primary/60 font-electrolize mb-4">
                    Upload your own image to use as your avatar. Cost: 5000 XP.
                  </p>

                  <div className="flex flex-col items-center">
                    <div
                      className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-4 border-2 border-dashed border-primary/50 cursor-pointer hover:bg-primary/20 transition-colors overflow-hidden"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {uploadedImage ? (
                        <Image
                          src={uploadedImage || "/placeholder.svg"}
                          alt="Uploaded"
                          width={128}
                          height={128}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <Upload className="w-10 h-10 text-primary/50" />
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="mb-4 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary font-michroma"
                    >
                      SELECT IMAGE
                    </Button>

                    {uploadedImage && (
                      <Button
                        onClick={applyCustomAvatar}
                        className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary font-michroma"
                      >
                        APPLY CUSTOM AVATAR (5000 XP)
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Card>

      <Card className="bg-black/80 backdrop-blur-lg p-6 rounded-none border border-primary/30 shadow-[0_0_15px_rgba(0,168,255,0.3)] cyberpunk-border holographic-ui">
        <div className="holographic-header">Titles</div>
        <div className="space-y-4">
          <div className="bg-black/60 p-4 rounded-none border border-primary/30">
            <h3 className="text-lg font-bold text-primary mb-3 font-michroma">Anime Titles</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2">
              {animeTitles.map((title) => {
                const hasTitle = player.titles.includes(title.name)
                const isSelected = player.selectedTitle === title.name

                return (
                  <div
                    key={title.id}
                    className={`p-2 rounded-none border cursor-pointer ${
                      isSelected
                        ? "border-primary animate-border-glow bg-primary/20"
                        : hasTitle
                          ? "border-primary/50 hover:border-primary/80"
                          : "border-primary/30 hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedTitle(title.id)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-electrolize text-primary/90">{title.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-primary" />}
                      {!hasTitle && <span className="text-primary/70 text-xs font-orbitron">{title.cost} XP</span>}
                    </div>
                  </div>
                )
              })}
            </div>

            {selectedTitle && (
              <Button
                onClick={() => applyTitle(selectedTitle)}
                className="mt-4 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary font-michroma"
              >
                {player.titles.includes(animeTitles.find((t) => t.id === selectedTitle)?.name || "")
                  ? "EQUIP TITLE"
                  : `UNLOCK TITLE (${animeTitles.find((t) => t.id === selectedTitle)?.cost} XP)`}
              </Button>
            )}
          </div>

          <div className="bg-black/60 p-4 rounded-none border border-primary/30">
            <h3 className="text-lg font-bold text-primary mb-3 font-michroma">Anime Quotes</h3>
            <p className="text-primary/60 font-electrolize mb-3">
              Special titles unlocked by purchasing anime avatars:
            </p>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {player.titles
                .filter((title) => title.length > 10) // Simple way to filter for quotes
                .map((quote, index) => {
                  const isSelected = player.selectedTitle === quote

                  return (
                    <div
                      key={index}
                      className={`p-2 rounded-none border cursor-pointer ${
                        isSelected
                          ? "border-primary animate-border-glow bg-primary/20"
                          : "border-primary/50 hover:border-primary/80"
                      }`}
                      onClick={() => applyQuoteTitle(quote)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-electrolize text-primary/90 italic">"{quote}"</span>
                        {isSelected && <Check className="w-4 h-4 text-primary" />}
                      </div>
                    </div>
                  )
                })}

              {player.titles.filter((title) => title.length > 10).length === 0 && (
                <p className="text-primary/50 font-electrolize text-center py-2">
                  No quote titles unlocked yet. Purchase anime avatars to unlock quotes!
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
