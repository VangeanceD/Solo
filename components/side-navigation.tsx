"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Home, Calendar, Plus, User, Palette, Package, Gift, Settings, LogOut, Menu, X } from "lucide-react"
import type { Player } from "@/lib/player"

interface SideNavigationProps {
  activePage: string
  onNavigate: (page: string) => void
  player: Player
  onLogout: () => void
}

export function SideNavigation({ activePage, onNavigate, player, onLogout }: SideNavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navItems = [
    { id: "quests", label: "Quests", icon: <Home className="w-5 h-5" /> },
    { id: "daily-quests", label: "Daily Missions", icon: <Calendar className="w-5 h-5" /> },
    { id: "create-quest", label: "Create Quest", icon: <Plus className="w-5 h-5" /> },
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    { id: "customize-profile", label: "Customize", icon: <Palette className="w-5 h-5" /> },
    { id: "inventory", label: "Inventory", icon: <Package className="w-5 h-5" /> },
    { id: "rewards", label: "Rewards", icon: <Gift className="w-5 h-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ]

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-30 p-2 bg-black/50 backdrop-blur-md border border-primary/30 text-primary"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/70 z-20" onClick={() => setIsMobileOpen(false)}></div>
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? "80px" : "240px",
          x: isMobileOpen ? 0 : window.innerWidth < 768 ? -240 : 0,
        }}
        transition={{ duration: 0.3 }}
        className={`fixed md:relative top-0 left-0 h-full z-20 bg-black/80 backdrop-blur-lg border-r border-primary/20 flex flex-col`}
      >
        <div className="p-4 border-b border-primary/20 flex items-center justify-between">
          {!isCollapsed && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xl font-bold text-primary font-audiowide glow-text"
            >
              ARISE
            </motion.h1>
          )}
          <button onClick={toggleCollapse} className="hidden md:block text-primary/70 hover:text-primary">
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent">
          <nav className="p-2 space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id)
                  if (window.innerWidth < 768) {
                    setIsMobileOpen(false)
                  }
                }}
                variant="ghost"
                className={`w-full justify-start py-2 px-3 rounded-none transition-colors ${
                  activePage === item.id
                    ? "bg-primary/20 text-primary border-l-2 border-primary"
                    : "text-white/70 hover:text-white hover:bg-primary/10"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-electrolize"
                  >
                    {item.label}
                  </motion.span>
                )}
              </Button>
            ))}
          </nav>
        </div>

        <div className="p-2 border-t border-primary/20">
          <Button
            onClick={onLogout}
            variant="ghost"
            className="w-full justify-start py-2 px-3 rounded-none text-white/70 hover:text-white hover:bg-primary/10 transition-colors"
          >
            <span className="mr-3">
              <LogOut className="w-5 h-5" />
            </span>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-electrolize"
              >
                Logout
              </motion.span>
            )}
          </Button>
        </div>
      </motion.aside>
    </>
  )
}
