"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface NotificationOptions {
  title: string
  message: string
  type?: "info" | "success" | "warning" | "error"
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
}

interface NotificationContextType {
  showNotification: (options: NotificationOptions) => void
}

const NotificationContext = createContext<NotificationContextType>({
  showNotification: () => {},
})

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<NotificationOptions>({
    title: "",
    message: "",
    type: "info",
    confirmText: "OK",
    cancelText: "Cancel",
  })
  const [callback, setCallback] = useState<(() => void) | undefined>(undefined)

  const showNotification = (opts: NotificationOptions) => {
    setOptions({
      ...opts,
      confirmText: opts.confirmText || "OK",
      cancelText: opts.cancelText || "Cancel",
    })
    setCallback(() => opts.onConfirm)
    setOpen(true)
  }

  const handleConfirm = () => {
    setOpen(false)
    if (callback) {
      callback()
      setCallback(undefined)
    }
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="holographic-ui">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-michroma text-primary">{options.title}</AlertDialogTitle>
            <AlertDialogDescription className="font-electrolize text-white/80">
              {options.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {callback && (
              <AlertDialogCancel className="font-michroma bg-black/60 hover:bg-black/80 text-primary/70 hover:text-primary rounded-none border border-primary/30">
                {options.cancelText}
              </AlertDialogCancel>
            )}
            <AlertDialogAction
              onClick={handleConfirm}
              className="font-michroma bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 btn-primary"
            >
              {options.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)
