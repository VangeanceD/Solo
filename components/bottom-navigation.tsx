"use client"

import { Home, Star, CalendarCheck, ListChecks, Menu } from "lucide-react"
import { motion } from "framer-motion"

interface BottomNavigationProps {
  activePage: string
  onNavigate: (page: string) => void
  onMenuOpen: () => void
}

export function BottomNavigation({ activePage, onNavigate, onMenuOpen }: BottomNavigationProps) {
  const navItems = [
    { id: "profile", icon: Home, label: "Home" },
    { id: "quests", icon: Star, label: "Quests" },
    { id: "daily-quests", icon: CalendarCheck, label: "Daily" },
    { id: "todo", icon: ListChecks, label: "Tasks" },
    { id: "menu", icon: Menu, label: "Menu" },
  ]

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-black/95 backdrop-blur-lg border-t border-primary/30 shadow-[0_-4px_12px_rgba(0,168,255,0.2)]"
    >
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = activePage === item.id
          const Icon = item.icon

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === "menu") {
                  onMenuOpen()
                } else {
                  onNavigate(item.id)
                }
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                isActive ? "text-primary" : "text-white/50"
              }`}
            >
              <div className={`relative ${isActive ? "animate-pulse-glow" : ""}`}>
                <Icon className={`w-6 h-6 ${isActive ? "scale-110" : ""} transition-transform`} />
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
              <span className={`text-xs mt-1 font-michroma ${isActive ? "font-semibold" : ""}`}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </motion.nav>
  )
}
