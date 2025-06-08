"use client"

import type { Player } from "@/lib/player"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useNotification } from "@/components/notification-provider"
import { useState } from "react"
import { motion } from "framer-motion"

interface SettingsPageProps {
  player: Player
  setPlayer: (player: Player) => void
}

export function SettingsPage({ player, setPlayer }: SettingsPageProps) {
  const [theme, setTheme] = useState(player.settings?.theme || "blue")
  const [animations, setAnimations] = useState(player.settings?.animations !== false)
  const [notifications, setNotifications] = useState(player.settings?.notifications !== false)

  const { showNotification } = useNotification()

  const changeTheme = (newTheme: "blue" | "purple" | "green" | "red") => {
    setTheme(newTheme)

    // Apply theme changes
    let primary, secondary
    switch (newTheme) {
      case "blue":
        primary = "#00a8ff"
        secondary = "#74b9ff"
        break
      case "purple":
        primary = "#7209b7"
        secondary = "#3f37c9"
        break
      case "green":
        primary = "#2b9348"
        secondary = "#80b918"
        break
      case "red":
        primary = "#f72585"
        secondary = "#7209b7"
        break
      default:
        primary = "#00a8ff"
        secondary = "#74b9ff"
    }

    document.documentElement.style.setProperty("--primary", primary)
    document.documentElement.style.setProperty("--primary-light", secondary)
  }

  const saveSettings = () => {
    const updatedPlayer = { ...player }

    if (!updatedPlayer.settings) {
      updatedPlayer.settings = {
        theme: "blue",
        animations: true,
        notifications: true,
      }
    }

    updatedPlayer.settings.theme = theme
    updatedPlayer.settings.animations = animations
    updatedPlayer.settings.notifications = notifications

    setPlayer(updatedPlayer)

    showNotification({
      title: "SETTINGS SAVED",
      message: "Your settings have been saved successfully!",
      type: "success",
    })
  }

  const exportPlayerData = () => {
    const dataStr = JSON.stringify(player)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = "hunter-protocol-data.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    showNotification({
      title: "DATA EXPORTED",
      message: "Your data has been exported successfully!",
      type: "success",
    })
  }

  const importPlayerData = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"

    input.onchange = (e) => {
      const file = e.target.files?.[0]
      if (!file) return

      const reader = new FileReader()

      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target?.result as string)

          // Validate data structure
          if (importedData.name && importedData.level && importedData.stats) {
            setPlayer(importedData)

            showNotification({
              title: "DATA IMPORTED",
              message: "Your data has been imported successfully!",
              type: "success",
            })
          } else {
            showNotification({
              title: "INVALID DATA",
              message: "The file does not contain valid Hunter Protocol data.",
              type: "error",
            })
          }
        } catch (error) {
          showNotification({
            title: "IMPORT ERROR",
            message: `Error importing data: ${error instanceof Error ? error.message : "Unknown error"}`,
            type: "error",
          })
        }
      }

      reader.readAsText(file)
    }

    input.click()
  }

  const resetPlayerData = () => {
    showNotification({
      title: "RESET CONFIRMATION",
      message: "Are you sure you want to reset all data? This cannot be undone!",
      type: "warning",
      confirmText: "Reset",
      cancelText: "Cancel",
      onConfirm: () => {
        localStorage.removeItem("player")
        window.location.reload()
      },
    })
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className="bg-black/80 backdrop-blur-lg p-6 rounded-none border border-primary/30 shadow-[0_0_15px_rgba(0,168,255,0.3)] cyberpunk-border holographic-ui">
        <div className="holographic-header">System Settings</div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-primary mb-3 font-audiowide">Theme</h3>
            <div className="flex space-x-4">
              <div
                className={`w-12 h-12 rounded-none cursor-pointer transition-all duration-300 ${theme === "blue" ? "ring-2 ring-white" : ""}`}
                style={{ background: "linear-gradient(135deg, #00a8ff, #74b9ff)" }}
                onClick={() => changeTheme("blue")}
              ></div>
              <div
                className={`w-12 h-12 rounded-none cursor-pointer transition-all duration-300 ${theme === "purple" ? "ring-2 ring-white" : ""}`}
                style={{ background: "linear-gradient(135deg, #7209b7, #3f37c9)" }}
                onClick={() => changeTheme("purple")}
              ></div>
              <div
                className={`w-12 h-12 rounded-none cursor-pointer transition-all duration-300 ${theme === "green" ? "ring-2 ring-white" : ""}`}
                style={{ background: "linear-gradient(135deg, #2b9348, #80b918)" }}
                onClick={() => changeTheme("green")}
              ></div>
              <div
                className={`w-12 h-12 rounded-none cursor-pointer transition-all duration-300 ${theme === "red" ? "ring-2 ring-white" : ""}`}
                style={{ background: "linear-gradient(135deg, #f72585, #7209b7)" }}
                onClick={() => changeTheme("red")}
              ></div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-primary mb-3 font-audiowide">Animations</h3>
            <div className="flex items-center space-x-2">
              <Switch
                id="animations-toggle"
                checked={animations}
                onCheckedChange={setAnimations}
                className="data-[state=checked]:bg-primary"
              />
              <Label htmlFor="animations-toggle" className="text-primary/80 font-electrolize cursor-pointer">
                Enable animations
              </Label>
            </div>
            <p className="text-primary/60 text-sm mt-1 font-electrolize">
              Disable this if you experience performance issues
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-primary mb-3 font-audiowide">Notifications</h3>
            <div className="flex items-center space-x-2">
              <Switch
                id="notifications-toggle"
                checked={notifications}
                onCheckedChange={setNotifications}
                className="data-[state=checked]:bg-primary"
              />
              <Label htmlFor="notifications-toggle" className="text-primary/80 font-electrolize cursor-pointer">
                Enable notifications
              </Label>
            </div>
            <p className="text-primary/60 text-sm mt-1 font-electrolize">Show level up and achievement notifications</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-primary mb-3 font-audiowide">Data Management</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={exportPlayerData}
                className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary font-michroma"
              >
                Export Data
              </Button>
              <Button
                onClick={importPlayerData}
                className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary font-michroma"
              >
                Import Data
              </Button>
              <Button
                onClick={resetPlayerData}
                className="px-4 py-2 bg-black/60 hover:bg-red-900/30 text-primary/70 hover:text-red-400 rounded-none border border-primary/30 transition-colors font-michroma"
              >
                Reset All Data
              </Button>
            </div>
          </div>

          <Button
            onClick={saveSettings}
            className="mt-4 w-full py-3 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary font-michroma"
          >
            SAVE SETTINGS
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
