"use client"

import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface PunishmentModalProps {
  show: boolean
  onClose: () => void
  message: string
}

export function PunishmentModal({ show, onClose, message }: PunishmentModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="max-w-md w-full mx-4 relative overflow-hidden"
            style={{
              background: "rgba(20, 0, 0, 0.9)",
              border: "1px solid rgba(255, 62, 62, 0.5)",
              boxShadow: "0 0 30px rgba(255, 62, 62, 0.3)",
            }}
          >
            <div className="animate-rotate absolute -z-10 inset-0 opacity-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,62,62,0.3),transparent_70%)]"></div>
            </div>

            <h2 className="text-3xl font-bold text-red-500 mb-4 text-center font-audiowide pt-6">MISSION FAILED</h2>

            <div className="my-4 flex justify-center">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>

            <p className="text-xl text-white mb-6 text-center font-electrolize px-6">{message}</p>

            <div className="mt-6 flex justify-center pb-6">
              <Button
                onClick={onClose}
                className="px-6 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-none border border-red-500/30 transition-colors tracking-wider font-michroma"
              >
                ACCEPT PUNISHMENT
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
