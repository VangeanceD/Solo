"use client"

import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Star, CalendarCheck, ListChecks, UserCog, Gift, Settings, Activity, LogOut } from "lucide-react"
import type { Player } from "@/lib/player"

interface MobileMenuProps {
  isOpen: boolean
  activePage: string
  onNavigate: (page: string) => void
  onClose: () => void
  player: Player
  onLogout: () => void
}

export function MobileMenu({ isOpen, activePage, onNavigate, onClose, player, onLogout }: MobileMenuProps) {
  const menuItems = [
    { id: "profile", icon: Home, label: "Profile" },
    { id: "quests", icon: Star, label: "Quests" },
    { id: "daily-quests", icon: CalendarCheck, label: "Daily Missions" },
    { id: "schedule", icon: CalendarCheck, label: "Schedule" },
    { id: "todo", icon: ListChecks, label: "To-Do" },
    { id: "customize-profile", icon: UserCog, label: "Customize Profile" },
    { id: "rewards", icon: Gift, label: "Rewards" },
    { id: "activity", icon: Activity, label: "Activity" },
    { id: "settings", icon: Settings, label: "Settings" },
  ]

  const handleNavigate = (page: string) => {
    onNavigate(page)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-black/95 border-r border-primary/30 z-50 overflow-y-auto"
          >
            <div className="p-4 border-b border-primary/20">
              <h2 className="text-xl font-bold text-primary font-audiowide">MENU</h2>
            </div>

            <nav className="p-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = activePage === item.id

                return (
                  <Button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    variant="ghost"
                    className={`w-full justify-start mb-1 rounded-none border-b border-primary/10 ${
                      isActive ? "bg-primary/10 text-primary" : "text-white/70 hover:text-white hover:bg-primary/5"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-electrolize">{item.label}</span>
                  </Button>
                )
              })}
            </nav>

            <div className="p-4 border-t border-primary/20 mt-4">
              <Button
                onClick={onLogout}
                variant="ghost"
                className="w-full justify-start text-white/70 hover:text-white hover:bg-primary/10"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span className="font-electrolize">Logout</span>
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
