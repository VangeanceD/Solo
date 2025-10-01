"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "cyberpunk" | "minimal-dark" | "anime-vibrant" | "solo-leveling" | "glass-morphism" | "retro-game"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const themes = {
  cyberpunk: {
    primary: "199 100% 50%",
    secondary: "202 100% 73%",
    accent: "280 100% 70%",
    background: "240 10% 3.9%",
  },
  "minimal-dark": {
    primary: "210 40% 60%",
    secondary: "210 40% 70%",
    accent: "210 40% 50%",
    background: "220 13% 13%",
  },
  "anime-vibrant": {
    primary: "340 100% 60%",
    secondary: "45 100% 60%",
    accent: "200 100% 60%",
    background: "240 20% 8%",
  },
  "solo-leveling": {
    primary: "280 100% 60%",
    secondary: "280 80% 70%",
    accent: "320 100% 50%",
    background: "240 30% 5%",
  },
  "glass-morphism": {
    primary: "200 100% 55%",
    secondary: "220 100% 65%",
    accent: "180 100% 50%",
    background: "220 20% 10%",
  },
  "retro-game": {
    primary: "120 100% 50%",
    secondary: "60 100% 50%",
    accent: "0 100% 50%",
    background: "0 0% 5%",
  },
}

export function ThemeProviderEnhanced({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("cyberpunk")

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem("ui-theme") as Theme
    if (savedTheme && themes[savedTheme]) {
      setThemeState(savedTheme)
      applyTheme(savedTheme)
    } else {
      applyTheme("cyberpunk")
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    console.log("Applying theme:", newTheme)
    setThemeState(newTheme)
    localStorage.setItem("ui-theme", newTheme)
    applyTheme(newTheme)
  }

  const applyTheme = (themeName: Theme) => {
    const root = document.documentElement
    const selectedTheme = themes[themeName]

    console.log("Setting CSS variables for theme:", themeName, selectedTheme)

    // Apply CSS variables
    root.style.setProperty("--primary", selectedTheme.primary)
    root.style.setProperty("--secondary", selectedTheme.secondary)
    root.style.setProperty("--accent", selectedTheme.accent)
    root.style.setProperty("--background", selectedTheme.background)

    // Force a repaint
    root.offsetHeight
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useThemeEnhanced() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeEnhanced must be used within ThemeProviderEnhanced")
  }
  return context
}
