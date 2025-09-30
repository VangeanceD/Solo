"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
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
  Menu,
  X,
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
  const [open, setOpen] = useState(true)

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

  const NavButton = ({
    page,
    icon: Icon,
    label,
  }: {
    page: string
    icon: any
    label: string
  }) => (
    <Button
      variant="ghost"
      className={`w-full justify-start rounded-none border-b border-primary/10 ${
        activePage === page ? "bg-primary/10 text-primary" : "text-white/70 hover:text-white hover:bg-primary/5"
      }`}
      onClick={() => onNavigate(page)}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </Button>
  )

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
            <NavButton page="profile" icon={Home} label="Profile" />
            <NavButton page="quests" icon={Star} label="Quests" />
            <NavButton page="daily-quests" icon={CalendarCheck} label="Daily Missions" />
            <NavButton page="schedule" icon={CalendarCheck} label="Schedule" />
            <NavButton page="todo" icon={ListChecks} label="To-Do" />
            <NavButton page="customize-profile" icon={UserCog} label="Customize Profile" />
            <NavButton page="inventory" icon={LayoutGrid} label="Inventory" />
            <NavButton page="rewards" icon={Gift} label="Rewards" />
            <NavButton page="activity" icon={Activity} label="Activity" />
            <NavButton page="settings" icon={Settings} label="Settings" />
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
