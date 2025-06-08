"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useNotification } from "@/components/notification-provider"
import type { Player } from "@/lib/player"

interface SettingsPageProps {
  player: Player
  setPlayer: (player: Player) => void
}

export function SettingsPage({ player, setPlayer }: SettingsPageProps) {
  const { addNotification } = useNotification()

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
    // This would reset the player's progress
    addNotification("Progress reset functionality would be implemented here", "info")
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
    </div>
  )
}
