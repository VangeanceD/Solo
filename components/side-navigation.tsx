"use client"

import type { Player } from "@/lib/player"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { User, Calendar, Sword, Gift, Backpack, PlusCircle, Settings, LogOut } from "lucide-react"
import { motion } from "framer-motion"

interface SideNavigationProps {
  activePage: string
  onNavigate: (page: string) => void
  player: Player
  onLogout: () => void
}

export function SideNavigation({ activePage, onNavigate, player, onLogout }: SideNavigationProps) {
  const navItems = [
    { id: "profile", icon: User, label: "Profile" },
    { id: "daily-quests", icon: Calendar, label: "Daily Quests" },
    { id: "quests", icon: Sword, label: "Quests" },
    { id: "rewards", icon: Gift, label: "Rewards" },
    { id: "inventory", icon: Backpack, label: "Inventory" },
    { id: "create-quest", icon: PlusCircle, label: "Create Quest" },
    { id: "settings", icon: Settings, label: "Settings" },
  ]

  return (
    <div className="w-20 bg-black/80 border-r border-primary/30 flex flex-col items-center py-8 space-y-8 relative z-10">
      <motion.div
        className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 animate-pulse-glow relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {player.profilePicture ? (
          <Avatar className="w-14 h-14 border border-primary/30">
            <AvatarImage src={player.profilePicture || "/placeholder.svg"} alt={player.name} />
            <AvatarFallback className="text-2xl font-bold text-primary font-orbitron">
              {player.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <span className="text-2xl font-bold text-primary font-orbitron">{player.name.charAt(0).toUpperCase()}</span>
        )}
        <div className="absolute -bottom-1 -right-1 bg-primary text-black w-6 h-6 rounded-full flex items-center justify-center font-bold font-orbitron text-xs border border-black">
          {player.level}
        </div>
      </motion.div>

      {navItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className={`w-12 h-12 rounded-none transition-all duration-300 ${
              activePage === item.id
                ? "bg-primary/20 text-primary border-l-2 border-primary"
                : "text-primary/70 hover:bg-primary/20 hover:text-primary"
            }`}
            onClick={() => onNavigate(item.id)}
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
          </Button>
        </motion.div>
      ))}

      <div className="flex-grow"></div>

      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: navItems.length * 0.05 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-none text-primary/70 hover:bg-primary/20 hover:text-primary"
          onClick={onLogout}
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  )
}
