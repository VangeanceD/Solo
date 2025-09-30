"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  Star,
  CalendarCheck,
  ListChecks,
  UserCog,
  LayoutGrid,
  Gift,
  Settings,
  Activity,
  LogOut,
  ChevronRight,
} from "lucide-react"
import type { Player } from "@/lib/player"

interface MobileMenuProps {
  isOpen: boolean
  activePage: string
  onNavigate: (page: string) => void
  onClose: () => void
  player: Player
  onLogout: () => void
}

const menuItems = [
  { id: "profile", icon: Home, label: "Home", color: "text-blue-400" },
  { id: "quests", icon: Star, label: "Quests", color: "text-yellow-400" },
  { id: "daily-quests", icon: CalendarCheck, label: "Daily Missions", color: "text-green-400" },
  { id: "schedule", icon: CalendarCheck, label: "Schedule", color: "text-purple-400" },
  { id: "todo", icon: ListChecks, label: "To-Do List", color: "text-pink-400" },
  { id: "customize-profile", icon: UserCog, label: "Customize", color: "text-orange-400" },
  { id: "inventory", icon: LayoutGrid, label: "Inventory", color: "text-cyan-400" },
  { id: "rewards", icon: Gift, label: "Rewards", color: "text-red-400" },
  { id: "activity", icon: Activity, label: "Activity", color: "text-indigo-400" },
  { id: "settings", icon: Settings, label: "Settings", color: "text-gray-400" },
]

export function MobileMenu({ isOpen, activePage, onNavigate, onClose, player, onLogout }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 z-40"
            onClick={onClose}
          />

          {/* Menu Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-black/95 backdrop-blur-xl border-r border-primary/30 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-primary/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/50 animate-pulse-glow">
                  <img
                    src={player.avatar || "/placeholder.svg?height=64&width=64"}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary font-michroma">{player.name}</h2>
                  <p className="text-sm text-white/70 font-electrolize">{player.title}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-primary/10 p-2 rounded-sm border border-primary/20 text-center">
                  <div className="text-lg font-bold text-primary font-orbitron">{player.level}</div>
                  <div className="text-xs text-white/60 font-michroma">Level</div>
                </div>
                <div className="bg-primary/10 p-2 rounded-sm border border-primary/20 text-center">
                  <div className="text-lg font-bold text-primary font-orbitron">{player.xp}</div>
                  <div className="text-xs text-white/60 font-michroma">XP</div>
                </div>
                <div className="bg-primary/10 p-2 rounded-sm border border-primary/20 text-center">
                  <div className="text-lg font-bold text-primary font-orbitron">
                    {player.quests.filter((q) => q.completed).length}
                  </div>
                  <div className="text-xs text-white/60 font-michroma">Quests</div>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="p-4 space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon
                const isActive = activePage === item.id

                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      onNavigate(item.id)
                      onClose()
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-sm transition-all ${
                      isActive
                        ? "bg-primary/20 border border-primary/50 shadow-[0_0_15px_rgba(0,168,255,0.3)]"
                        : "bg-black/40 border border-primary/10 hover:border-primary/30 hover:bg-primary/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive ? "text-primary" : item.color}`} />
                      <span className={`font-michroma text-sm ${isActive ? "text-primary" : "text-white/70"}`}>
                        {item.label}
                      </span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-primary" />}
                  </motion.button>
                )
              })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-primary/20">
              <button
                onClick={() => {
                  onLogout()
                  onClose()
                }}
                className="w-full flex items-center justify-center gap-3 p-4 bg-red-900/20 border border-red-500/30 text-red-400 hover:bg-red-900/30 rounded-sm transition-colors font-michroma"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
