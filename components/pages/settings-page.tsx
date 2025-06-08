"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertTriangle } from "lucide-react"
import { useNotification } from "@/components/notification-provider"
import { createDefaultPlayer } from "@/lib/player"
import type { Player } from "@/lib/player"

interface SettingsPageProps {
  player: Player
  setPlayer: (player: Player) => void
  onLogout: () => void
}

export function SettingsPage({ player, setPlayer, onLogout }: SettingsPageProps) {
  const { addNotification } = useNotification()
  const [showConfirmReset, setShowConfirmReset] = useState(false)

  const handleSettingChange = (setting: keyof Player["settings"], value: boolean | string) => {
    const updatedPlayer = {
      ...player,
      settings: {
        ...player.settings,
        [setting]: value,
      },
    }

    setPlayer(updatedPlayer)
    addNotification("Settings updated successfully!", "success")
  }

  const handleResetProgress = () => {
    setShowConfirmReset(true)
  }

  const confirmResetProgress = () => {
    // Create a new player with the same name
    const newPlayer = createDefaultPlayer(player.name)

    // Keep the same settings
    newPlayer.settings = player.settings

    // Update the player state
    setPlayer(newPlayer)

    // Close the confirmation dialog
    setShowConfirmReset(false)

    // Show notification
    addNotification("All progress has been reset. Starting fresh!", "success")

    // Redirect to profile page
    onLogout()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary font-audiowide glow-text">SETTINGS</h1>

      <Card className="bg-black/60 backdrop-blur-md border border-primary/30 animate-border-glow cyberpunk-border holographic-ui">
        <CardContent className="p-6">
          <div className="holographic-header">Game Settings</div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="text-white/70 font-michroma">
                Notifications
              </Label>
              <Switch
                id="notifications"
                checked={player.settings.notifications}
                onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="sound" className="text-white/70 font-michroma">
                Sound Effects
              </Label>
              <Switch
                id="sound"
                checked={player.settings.sound}
                onCheckedChange={(checked) => handleSettingChange("sound", checked)}
              />
            </div>

            <div className="border-t border-primary/20 pt-6">
              <h3 className="text-lg font-semibold text-primary mb-4 font-michroma">Danger Zone</h3>
              <Button
                onClick={handleResetProgress}
                variant="destructive"
                className="bg-red-900/20 hover:bg-red-900/30 text-red-400 border-red-500/30"
              >
                Reset All Progress
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reset Confirmation Dialog */}
      {showConfirmReset && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full bg-black/90 border border-red-500/30 p-6 animate-border-glow">
            <div className="flex items-center justify-center mb-4 text-red-500">
              <AlertTriangle className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-red-500 mb-2 font-michroma text-center">WARNING</h2>
            <p className="text-white/70 mb-6 font-electrolize text-center">
              This will reset ALL your progress, including quests, stats, XP, and inventory. This action cannot be
              undone.
            </p>

            <div className="flex space-x-3">
              <Button
                onClick={confirmResetProgress}
                className="flex-1 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-none border border-red-500/30"
              >
                CONFIRM RESET
              </Button>
              <Button
                onClick={() => setShowConfirmReset(false)}
                variant="ghost"
                className="flex-1 py-2 bg-black/60 hover:bg-black/80 text-white/70 hover:text-white rounded-none border border-primary/30"
              >
                CANCEL
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
