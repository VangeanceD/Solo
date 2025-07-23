"use client"

import { useState, useEffect, useCallback } from "react"
import {
  savePlayerData,
  loadPlayerData,
  getDeviceId,
  isOnline,
  isSupabaseConfigured,
  testSupabaseConnection,
} from "@/lib/supabase"
import type { Player } from "@/lib/player"

export function usePlayerSync() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [isConfigured, setIsConfigured] = useState(false)

  const deviceId = getDeviceId()

  // Check if Supabase is configured
  useEffect(() => {
    setIsConfigured(isSupabaseConfigured())
  }, [])

  // Save player data to cloud
  const syncToCloud = useCallback(
    async (playerData: Player) => {
      if (!isConfigured) {
        setSyncError("Cloud sync not configured")
        return { success: false, error: "not_configured" }
      }

      if (!isOnline()) {
        setSyncError("Offline - will sync when connection is restored")
        return { success: false, error: "offline" }
      }

      setIsSyncing(true)
      setSyncError(null)

      try {
        const result = await savePlayerData(deviceId, playerData)

        if (result.success) {
          setLastSyncTime(new Date().toISOString())
          setSyncError(null)

          // Also save to localStorage as backup
          localStorage.setItem("player", JSON.stringify(playerData))
          localStorage.setItem("lastSync", new Date().toISOString())

          return { success: true }
        } else {
          setSyncError("Failed to sync to cloud")
          return { success: false, error: result.error }
        }
      } catch (error) {
        setSyncError("Sync failed - check your connection")
        return { success: false, error }
      } finally {
        setIsSyncing(false)
      }
    },
    [deviceId, isConfigured],
  )

  // Load player data from cloud
  const syncFromCloud = useCallback(async () => {
    if (!isConfigured) {
      setSyncError("Cloud sync not configured")
      return { success: false, error: "not_configured" }
    }

    if (!isOnline()) {
      setSyncError("Offline - using local data")
      return { success: false, error: "offline" }
    }

    setIsSyncing(true)
    setSyncError(null)

    try {
      const result = await loadPlayerData(deviceId)

      if (result.success && result.data) {
        setLastSyncTime(new Date().toISOString())
        setSyncError(null)

        // Also save to localStorage
        localStorage.setItem("player", JSON.stringify(result.data))
        localStorage.setItem("lastSync", new Date().toISOString())

        return { success: true, data: result.data }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      setSyncError("Failed to load from cloud")
      return { success: false, error }
    } finally {
      setIsSyncing(false)
    }
  }, [deviceId, isConfigured])

  // Test connection
  const testConnection = useCallback(async () => {
    if (!isConfigured) {
      return { success: false, error: "not_configured" }
    }

    setIsSyncing(true)
    setSyncError(null)

    try {
      const result = await testSupabaseConnection()
      if (result.success) {
        setSyncError(null)
        return { success: true }
      } else {
        setSyncError("Connection test failed")
        return { success: false, error: result.error }
      }
    } catch (error) {
      setSyncError("Connection test failed")
      return { success: false, error }
    } finally {
      setIsSyncing(false)
    }
  }, [isConfigured])

  // Update configuration status
  const updateConfiguration = useCallback(() => {
    setIsConfigured(isSupabaseConfigured())
    setSyncError(null)
  }, [])

  // Auto-sync when coming online
  useEffect(() => {
    const handleOnline = () => {
      if (isConfigured) {
        setSyncError(null)
        // Try to sync when coming back online
        const localPlayer = localStorage.getItem("player")
        if (localPlayer) {
          try {
            const playerData = JSON.parse(localPlayer)
            syncToCloud(playerData)
          } catch (error) {
            console.error("Error parsing local player data:", error)
          }
        }
      }
    }

    const handleOffline = () => {
      setSyncError("Offline - changes will sync when connection is restored")
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [syncToCloud, isConfigured])

  // Initialize last sync time from localStorage
  useEffect(() => {
    const lastSync = localStorage.getItem("lastSync")
    if (lastSync) {
      setLastSyncTime(lastSync)
    }
  }, [])

  return {
    syncToCloud,
    syncFromCloud,
    testConnection,
    updateConfiguration,
    isSyncing,
    lastSyncTime,
    syncError,
    deviceId,
    isOnline: isOnline(),
    isConfigured,
  }
}
