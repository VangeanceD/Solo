"use client"

import { Home, Star, CalendarCheck, ListChecks, Trophy } from "lucide-react"
import { motion } from "framer-motion"

interface BottomNavigationProps {
  activePage: string
  onNavigate: (page: string) => void
}

export function BottomNavigation({ activePage, onNavigate }: BottomNavigationProps) {
  const navItems = [
    { id: "profile", icon: Home, label: "Home" },
    { id: "quests", icon: Star, label: "Quests" },
    { id: "daily-quests", icon: CalendarCheck, label: "Daily" },
    { id: "todo", icon: ListChecks, label: "Tasks" },
    { id: "rewards", icon: Trophy, label: "Rewards" },
  ]

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-black/95 backdrop-blur-lg border-t border-primary/30 shadow-[0_-4px_12px_rgba(0,168,255,0.2)] safe-area-inset-bottom"
    >
      <div className="flex justify-around items-center h-20 px-2">
        {navItems.map((item) => {
          const isActive = activePage === item.id
          const Icon = item.icon

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 relative ${
                isActive ? "text-primary" : "text-white/50"
              }`}
            >
              <div className={`relative ${isActive ? "scale-110" : ""} transition-transform`}>
                <Icon className={`w-6 h-6 ${isActive ? "animate-pulse-glow" : ""}`} />
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(0,168,255,0.6)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
              <span className={`text-xs mt-1.5 font-michroma ${isActive ? "font-semibold" : ""}`}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </motion.nav>
  )
}
