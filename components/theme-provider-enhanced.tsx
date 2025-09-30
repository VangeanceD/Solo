"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "cyberpunk" | "minimal-dark" | "anime-vibrant" | "solo-leveling" | "glass-morphism" | "retro-game"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProviderEnhanced({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("cyberpunk")

  useEffect(() => {
    const savedTheme = localStorage.getItem("ui-theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    }
  }, [])

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem("ui-theme", newTheme)
    applyTheme(newTheme)
  }

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement
    const themes = {
      cyberpunk: {
        primary: "199 100% 50%",
        secondary: "202 100% 73%",
        accent: "280 100% 70%",
      },
      "minimal-dark": {
        primary: "210 40% 60%",
        secondary: "210 40% 70%",
        accent: "210 40% 50%",
      },
      "anime-vibrant": {
        primary: "340 100% 60%",
        secondary: "45 100% 60%",
        accent: "200 100% 60%",
      },
      "solo-leveling": {
        primary: "280 100% 60%",
        secondary: "280 80% 70%",
        accent: "320 100% 50%",
      },
      "glass-morphism": {
        primary: "200 100% 55%",
        secondary: "220 100% 65%",
        accent: "180 100% 50%",
      },
      "retro-game": {
        primary: "120 100% 50%",
        secondary: "60 100% 50%",
        accent: "0 100% 50%",
      },
    }

    const selectedTheme = themes[theme]
    root.style.setProperty("--primary", selectedTheme.primary)
    root.style.setProperty("--secondary", selectedTheme.secondary)
    root.style.setProperty("--accent", selectedTheme.accent)
  }

  return <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>{children}</ThemeContext.Provider>
}

export function useThemeEnhanced() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeEnhanced must be used within ThemeProviderEnhanced")
  }
  return context
}
