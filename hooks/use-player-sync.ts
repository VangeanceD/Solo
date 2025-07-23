"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { savePlayerData, loadPlayerData, isSupabaseConfigured } from "@/lib/supabase"
import type { Player } from "@/lib/player"

export interface SyncStatus {
  isOnline: boolean
  lastSync: Date | null
  isLoading: boolean
  error: string | null
  hasUnsyncedChanges: boolean
}

export function usePlayerSync() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: false,
    lastSync: null,
    isLoading: false,
    error: null,
    hasUnsyncedChanges: false,
  })

  const deviceIdRef = useRef<string>("")
  const syncTimeoutRef = useRef<NodeJS.Timeout>()

  // Initialize device ID
  useEffect(() => {
    if (typeof window === "undefined") return

    let deviceId = localStorage.getItem("device_id")
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("device_id", deviceId)
    }
    deviceIdRef.current = deviceId
  }, [])

  // Check if Supabase is configured and update status
  useEffect(() => {
    const checkConfiguration = () => {
      const isConfigured = isSupabaseConfigured()
      setSyncStatus((prev) => ({
        ...prev,
        isOnline: isConfigured,
        error: isConfigured ? null : "Cloud sync not configured",
      }))
    }

    checkConfiguration()

    // Listen for storage changes (when user configures Supabase in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "supabase_url" || e.key === "supabase_key") {
        checkConfiguration()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Sync player data to cloud
  const syncToCloud = useCallback(async (playerData: Player): Promise<boolean> => {
    if (!isSupabaseConfigured() || !deviceIdRef.current) {
      setSyncStatus((prev) => ({ ...prev, error: "Sync not configured" }))
      return false
    }

    setSyncStatus((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      await savePlayerData(deviceIdRef.current, playerData)

      setSyncStatus((prev) => ({
        ...prev,
        isLoading: false,
        lastSync: new Date(),
        hasUnsyncedChanges: false,
        error: null,
      }))

      return true
    } catch (error) {
      console.error("Sync to cloud failed:", error)
      setSyncStatus((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Sync failed",
        hasUnsyncedChanges: true,
      }))
      return false
    }
  }, [])

  // Load player data from cloud
  const loadFromCloud = useCallback(async (): Promise<Player | null> => {
    if (!isSupabaseConfigured() || !deviceIdRef.current) {
      setSyncStatus((prev) => ({ ...prev, error: "Sync not configured" }))
      return null
    }

    setSyncStatus((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const result = await loadPlayerData(deviceIdRef.current)

      setSyncStatus((prev) => ({
        ...prev,
        isLoading: false,
        lastSync: new Date(),
        error: result.success ? null : result.error || "Load failed",
      }))

      return result.success ? result.data || null : null
    } catch (error) {
      console.error("Load from cloud failed:", error)
      setSyncStatus((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Load failed",
      }))
      return null
    }
  }, [])

  // Debounced sync function
  const debouncedSync = useCallback(
    (playerData: Player) => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current)
      }

      setSyncStatus((prev) => ({ ...prev, hasUnsyncedChanges: true }))

      syncTimeoutRef.current = setTimeout(() => {
        if (isSupabaseConfigured()) {
          syncToCloud(playerData)
        }
      }, 2000) // 2 second debounce
    },
    [syncToCloud],
  )

  // Manual sync function
  const manualSync = useCallback(
    async (playerData: Player): Promise<boolean> => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current)
      }
      return await syncToCloud(playerData)
    },
    [syncToCloud],
  )

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current)
      }
    }
  }, [])

  return {
    syncStatus,
    syncToCloud: debouncedSync,
    loadFromCloud,
    manualSync,
    isConfigured: isSupabaseConfigured(),
  }
}
