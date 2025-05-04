"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface Notification {
  id: string
  message: string
  type: "success" | "error" | "info" | "warning"
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (message: string, type: Notification["type"]) => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (message: string, type: Notification["type"] = "info") => {
    const id = Math.random().toString(36).substring(2, 9)
    setNotifications((prev) => [...prev, { id, message, type }])

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id)
    }, 5000)
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`p-4 rounded-none border shadow-lg backdrop-blur-lg ${
                notification.type === "success"
                  ? "bg-green-900/80 border-green-500/50 text-green-100"
                  : notification.type === "error"
                    ? "bg-red-900/80 border-red-500/50 text-red-100"
                    : notification.type === "warning"
                      ? "bg-amber-900/80 border-amber-500/50 text-amber-100"
                      : "bg-primary/10 border-primary/30 text-primary"
              }`}
            >
              <div className="flex justify-between items-start">
                <p className="font-electrolize">{notification.message}</p>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="ml-4 text-white/70 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}
