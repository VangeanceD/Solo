"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface IntroAnimationProps {
  onComplete: () => void
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [showContinue, setShowContinue] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContinue(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center flex-col z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="w-[300px] h-[400px] relative mb-8"
      >
        <svg viewBox="0 0 100 120" width="300" height="400">
          <defs>
            <linearGradient id="silhouette-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0d1117" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
          </defs>
          <path
            d="M50,10 C70,10 80,30 80,50 C80,65 75,75 70,85 C65,95 60,100 50,110 C40,100 35,95 30,85 C25,75 20,65 20,50 C20,30 30,10 50,10 Z"
            fill="url(#silhouette-gradient)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,168,255,0.15),transparent_70%)]"></div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
        className="text-3xl font-audiowide text-primary glow-text mb-4"
      >
        SYSTEM INITIALIZING
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2, ease: "easeOut" }}
        className="text-xl font-rajdhani text-white/90 mb-8"
      >
        Hunter Protocol v3.0 - Awaiting Authorization
      </motion.div>

      {showContinue && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Button
            onClick={onComplete}
            className="font-michroma text-primary bg-primary/20 border border-primary/30 hover:bg-primary/30 px-8 py-6"
          >
            ACCESS SYSTEM
          </Button>
        </motion.div>
      )}
    </div>
  )
}
