"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useNotification } from "@/components/notification-provider"
import type { Player } from "@/lib/player"

interface SettingsPageProps {
  player: Player
  setPlayer: (player: Player) => void
}

export function SettingsPage({ player, setPlayer }: SettingsPageProps) {
  const { addNotification } = useNotification()

  const handleSettingChange = (setting: keyof Player["settings"], value: boolean) => {
    setPlayer({
      ...player,
      settings: {
        ...player.settings,
        [setting]: value,
      },
    })

    addNotification(
      `${setting.charAt(0).toUpperCase() + setting.slice(1)} ${value ? "enabled" : "disabled"}`,
      "success",
    )
  }

  const handleResetProgress = () => {
    // This would typically show a confirmation dialog
    addNotification("This feature is not implemented yet", "warning")
  }

  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify(player, null, 2)
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

      const exportFileDefaultName = `arise-hunter-data-${new Date().toISOString().slice(0, 10)}.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()

      addNotification("Data exported successfully", "success")
    } catch (error) {
      addNotification("Failed to export data", "error")
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary font-audiowide glow-text">SETTINGS</h1>

      <Card className="bg-black/60 backdrop-blur-md border border-primary/30 animate-border-glow cyberpunk-border holographic-ui">
        <CardContent className="p-6">
          <div className="holographic-header">Interface Settings</div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="theme-toggle" className="text-white font-michroma">
                  Dark Theme
                </Label>
                <p className="text-white/50 text-sm font-electrolize">Enable dark theme for the interface</p>
              </div>
              <Switch
                id="theme-toggle"
                checked={player.settings.theme === "dark"}
                onCheckedChange={(checked) => handleSettingChange("theme", checked ? "dark" : "light")}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications-toggle" className="text-white font-michroma">
                  Notifications
                </Label>
                <p className="text-white/50 text-sm font-electrolize">Enable in-app notifications</p>
              </div>
              <Switch
                id="notifications-toggle"
                checked={player.settings.notifications}
                onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sound-toggle" className="text-white font-michroma">
                  Sound Effects
                </Label>
                <p className="text-white/50 text-sm font-electrolize">Enable sound effects for actions</p>
              </div>
              <Switch
                id="sound-toggle"
                checked={player.settings.sound}
                onCheckedChange={(checked) => handleSettingChange("sound", checked)}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/60 backdrop-blur-md border border-primary/30 animate-border-glow cyberpunk-border holographic-ui">
        <CardContent className="p-6">
          <div className="holographic-header">Data Management</div>
          <div className="space-y-4">
            <Button
              onClick={handleExportData}
              className="w-full py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary"
            >
              EXPORT DATA
            </Button>

            <Button
              onClick={handleResetProgress}
              className="w-full py-2 bg-red-900/20 hover:bg-red-900/30 text-red-500 rounded-none border border-red-500/30 transition-colors tracking-wider"
            >
              RESET PROGRESS
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
