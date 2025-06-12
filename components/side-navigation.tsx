"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  Home,
  Calendar,
  Plus,
  User,
  Palette,
  Package,
  Gift,
  Settings,
  LogOut,
  Menu,
  X,
  Clock,
  CheckSquare,
  AlertTriangle,
  Target,
} from "lucide-react"
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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Auto-collapse on mobile
      if (mobile) {
        setIsCollapsed(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const navItems = [
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4 sm:w-5 sm:h-5" />, shortLabel: "Profile" },
    { id: "quests", label: "Quests", icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" />, shortLabel: "Quests" },
    {
      id: "daily-quests",
      label: "Daily Missions",
      icon: <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />,
      shortLabel: "Daily",
    },
    {
      id: "create-quest",
      label: "Create Quest",
      icon: <Plus className="w-4 h-4 sm:w-5 sm:h-5" />,
      shortLabel: "Create",
    },
    {
      id: "create-daily-missions",
      label: "Create Daily Missions",
      icon: <Target className="w-4 h-4 sm:w-5 sm:h-5" />,
      shortLabel: "Daily+",
    },
    {
      id: "schedule",
      label: "Daily Schedule",
      icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5" />,
      shortLabel: "Schedule",
    },
    { id: "todo", label: "To-Do List", icon: <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5" />, shortLabel: "To-Do" },
    {
      id: "workout-accountability",
      label: "Workout Accountability",
      icon: <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />,
      shortLabel: "Workout",
    },
    {
      id: "customize-profile",
      label: "Customize",
      icon: <Palette className="w-4 h-4 sm:w-5 sm:h-5" />,
      shortLabel: "Custom",
    },
    { id: "inventory", label: "Inventory", icon: <Package className="w-4 h-4 sm:w-5 sm:h-5" />, shortLabel: "Items" },
    { id: "rewards", label: "Rewards", icon: <Gift className="w-4 h-4 sm:w-5 sm:h-5" />, shortLabel: "Rewards" },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4 sm:w-5 sm:h-5" />, shortLabel: "Settings" },
  ]

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  const handleNavigate = (pageId: string) => {
    try {
      onNavigate(pageId)
      if (isMobile) {
        setIsMobileOpen(false)
      }
    } catch (error) {
      console.error("Navigation error:", error)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={toggleMobileMenu}
          className="md:hidden fixed top-3 left-3 z-30 p-2 bg-black/80 backdrop-blur-md border border-primary/30 text-primary rounded-sm"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      )}

      {/* Mobile overlay */}
      {isMobileOpen && isMobile && (
        <div className="md:hidden fixed inset-0 bg-black/70 z-20" onClick={() => setIsMobileOpen(false)}></div>
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isMobile ? "100%" : isCollapsed ? "80px" : "280px",
          x: isMobileOpen || !isMobile ? 0 : isMobile ? "-100%" : -280,
        }}
        transition={{ duration: 0.3 }}
        className={`fixed md:relative top-0 left-0 h-full z-20 bg-black/90 md:bg-black/80 backdrop-blur-lg border-r border-primary/20 flex flex-col ${
          isMobile ? "max-w-sm" : ""
        }`}
      >
        <div className="p-3 sm:p-4 border-b border-primary/20 flex items-center justify-between">
          {!isCollapsed && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg sm:text-xl font-bold text-primary font-audiowide glow-text"
            >
              ARISE
            </motion.h1>
          )}
          {!isMobile && (
            <button onClick={toggleCollapse} className="text-primary/70 hover:text-primary">
              {isCollapsed ? <Menu className="w-4 h-4 sm:w-5 sm:h-5" /> : <X className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent">
          <nav className="p-2 space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                variant="ghost"
                className={`w-full justify-start py-2 px-3 rounded-none transition-colors text-sm ${
                  activePage === item.id
                    ? "bg-primary/20 text-primary border-l-2 border-primary"
                    : "text-white/70 hover:text-white hover:bg-primary/10"
                }`}
              >
                <span className="mr-2 sm:mr-3 flex-shrink-0">{item.icon}</span>
                {(!isCollapsed || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-electrolize text-xs sm:text-sm truncate"
                  >
                    {isMobile && window.innerWidth < 400 ? item.shortLabel : item.label}
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
            className="w-full justify-start py-2 px-3 rounded-none text-white/70 hover:text-white hover:bg-primary/10 transition-colors text-sm"
          >
            <span className="mr-2 sm:mr-3 flex-shrink-0">
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            {(!isCollapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-electrolize text-xs sm:text-sm"
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
