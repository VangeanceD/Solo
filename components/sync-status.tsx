"use client"

import { Cloud, CloudOff, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { SyncStatus } from "@/hooks/use-player-sync"

interface SyncStatusProps {
  status: SyncStatus
  onSync?: () => void
  onSetup?: () => void
  isConfigured: boolean
}

export function SyncStatusComponent({ status, onSync, onSetup, isConfigured }: SyncStatusProps) {
  const getStatusIcon = () => {
    if (!isConfigured) {
      return <CloudOff className="w-4 h-4 text-muted-foreground" />
    }

    if (status.isLoading) {
      return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
    }

    if (status.error) {
      return <AlertCircle className="w-4 h-4 text-red-500" />
    }

    if (status.isOnline) {
      return status.hasUnsyncedChanges ? (
        <Cloud className="w-4 h-4 text-yellow-500" />
      ) : (
        <Cloud className="w-4 h-4 text-green-500" />
      )
    }

    return <CloudOff className="w-4 h-4 text-muted-foreground" />
  }

  const getStatusText = () => {
    if (!isConfigured) return "Cloud sync not configured"
    if (status.isLoading) return "Syncing..."
    if (status.error) return `Error: ${status.error}`
    if (status.hasUnsyncedChanges) return "Changes pending sync"
    if (status.lastSync) return `Last sync: ${status.lastSync.toLocaleTimeString()}`
    return "Ready to sync"
  }

  const getStatusColor = () => {
    if (!isConfigured) return "secondary"
    if (status.isLoading) return "default"
    if (status.error) return "destructive"
    if (status.hasUnsyncedChanges) return "default"
    if (status.isOnline) return "default"
    return "secondary"
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant={getStatusColor()} className="flex items-center gap-1 px-2 py-1">
              {getStatusIcon()}
              <span className="text-xs hidden sm:inline">
                {isConfigured ? (status.isOnline ? "Cloud" : "Offline") : "Local"}
              </span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getStatusText()}</p>
          </TooltipContent>
        </Tooltip>

        {!isConfigured ? (
          <Button variant="outline" size="sm" onClick={onSetup} className="text-xs px-2 py-1 h-auto bg-transparent">
            Setup Sync
          </Button>
        ) : status.hasUnsyncedChanges && !status.isLoading ? (
          <Button variant="outline" size="sm" onClick={onSync} className="text-xs px-2 py-1 h-auto bg-transparent">
            Sync Now
          </Button>
        ) : null}
      </div>
    </TooltipProvider>
  )
}
