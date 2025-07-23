"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Cloud, Loader2, Check, AlertTriangle, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SyncStatusProps {
  isSyncing: boolean
  lastSyncTime: string | null
  syncError: string | null
  isOnline: boolean
  onManualSync: () => void
}

export function SyncStatus({ isSyncing, lastSyncTime, syncError, isOnline, onManualSync }: SyncStatusProps) {
  const formatSyncTime = (timeString: string) => {
    const date = new Date(timeString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return date.toLocaleDateString()
  }

  const getSyncIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4 text-red-400" />
    if (isSyncing) return <Loader2 className="w-4 h-4 text-primary animate-spin" />
    if (syncError) return <AlertTriangle className="w-4 h-4 text-amber-400" />
    if (lastSyncTime) return <Check className="w-4 h-4 text-green-400" />
    return <Cloud className="w-4 h-4 text-primary/70" />
  }

  const getSyncStatus = () => {
    if (!isOnline) return "Offline"
    if (isSyncing) return "Syncing..."
    if (syncError) return "Sync Error"
    if (lastSyncTime) return `Synced ${formatSyncTime(lastSyncTime)}`
    return "Not Synced"
  }

  const getStatusColor = () => {
    if (!isOnline) return "text-red-400"
    if (isSyncing) return "text-primary"
    if (syncError) return "text-amber-400"
    if (lastSyncTime) return "text-green-400"
    return "text-primary/70"
  }

  return (
    <div className="flex items-center space-x-2 text-xs">
      <div className="flex items-center space-x-1">
        {getSyncIcon()}
        <span className={`font-electrolize ${getStatusColor()}`}>{getSyncStatus()}</span>
      </div>

      {!isSyncing && (isOnline || syncError) && (
        <Button
          onClick={onManualSync}
          size="sm"
          variant="ghost"
          className="h-6 px-2 text-xs text-primary/70 hover:text-primary"
        >
          Sync
        </Button>
      )}

      <AnimatePresence>
        {syncError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-xs text-amber-400 font-electrolize max-w-xs truncate"
            title={syncError}
          >
            {syncError}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
