"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { UIPreview } from "@/components/ui-preview-generator"
import { useThemeEnhanced } from "@/components/theme-provider-enhanced"

interface UIVariant {
  id: string
  name: string
  description: string
  preview: string
  theme: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
}

const variants: UIVariant[] = [
  {
    id: "cyberpunk",
    name: "Cyberpunk Neon",
    description: "High-tech neon aesthetic with vibrant cyan and purple",
    preview: "/ui-previews/cyberpunk.png",
    theme: {
      primary: "199 100% 50%",
      secondary: "202 100% 73%",
      accent: "280 100% 70%",
      background: "240 10% 3.9%",
    },
  },
  {
    id: "minimal-dark",
    name: "Minimal Dark",
    description: "Clean, minimalist design with subtle accents",
    preview: "/ui-previews/minimal-dark.png",
    theme: {
      primary: "210 40% 60%",
      secondary: "210 40% 70%",
      accent: "210 40% 50%",
      background: "220 13% 13%",
    },
  },
  {
    id: "anime-vibrant",
    name: "Anime Vibrant",
    description: "Colorful, energetic design inspired by anime UIs",
    preview: "/ui-previews/anime-vibrant.png",
    theme: {
      primary: "340 100% 60%",
      secondary: "45 100% 60%",
      accent: "200 100% 60%",
      background: "240 20% 8%",
    },
  },
  {
    id: "solo-leveling",
    name: "Solo Leveling Dark",
    description: "Dark, mysterious theme inspired by Solo Leveling",
    preview: "/ui-previews/solo-leveling.png",
    theme: {
      primary: "280 100% 60%",
      secondary: "280 80% 70%",
      accent: "320 100% 50%",
      background: "240 30% 5%",
    },
  },
  {
    id: "glass-morphism",
    name: "Glass Morphism",
    description: "Modern frosted glass effect with blur",
    preview: "/ui-previews/glass.png",
    theme: {
      primary: "200 100% 55%",
      secondary: "220 100% 65%",
      accent: "180 100% 50%",
      background: "220 20% 10%",
    },
  },
  {
    id: "retro-game",
    name: "Retro Gaming",
    description: "Pixel-perfect retro gaming aesthetic",
    preview: "/ui-previews/retro.png",
    theme: {
      primary: "120 100% 50%",
      secondary: "60 100% 50%",
      accent: "0 100% 50%",
      background: "0 0% 5%",
    },
  },
]

interface VariantSelectorProps {
  onSelect: (variant: UIVariant) => void
  currentVariant?: string
}

export function VariantSelector({ onSelect }: VariantSelectorProps) {
  const { theme: currentTheme } = useThemeEnhanced()
  const [selectedVariant, setSelectedVariant] = useState(currentTheme)
  const [showSelector, setShowSelector] = useState(false)

  useEffect(() => {
    setSelectedVariant(currentTheme)
  }, [currentTheme])

  const handleSelect = (variant: UIVariant) => {
    setSelectedVariant(variant.id as any)
    onSelect(variant)
  }

  return (
    <>
      {/* Floating Button to Open Selector */}
      <Button
        onClick={() => setShowSelector(true)}
        className="fixed bottom-24 right-4 md:bottom-4 z-50 w-14 h-14 rounded-full bg-primary/20 hover:bg-primary/30 text-primary border-2 border-primary/50 shadow-[0_0_20px_rgba(0,168,255,0.4)]"
      >
        <span className="text-2xl">🎨</span>
      </Button>

      {/* Selector Modal */}
      <AnimatePresence>
        {showSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 overflow-y-auto"
          >
            <div className="container mx-auto p-4 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-primary font-audiowide glow-text">
                  CHOOSE YOUR UI THEME
                </h2>
                <Button
                  onClick={() => setShowSelector(false)}
                  variant="ghost"
                  className="text-white/70 hover:text-white"
                >
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {variants.map((variant) => (
                  <Card
                    key={variant.id}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedVariant === variant.id
                        ? "border-2 border-primary shadow-[0_0_30px_rgba(0,168,255,0.5)]"
                        : "border border-primary/20 hover:border-primary/50"
                    }`}
                    onClick={() => handleSelect(variant)}
                  >
                    <CardContent className="p-4">
                      {/* Preview Image */}
                      <div className="relative w-full h-64 bg-gradient-to-br from-black/40 to-black/60 rounded-lg mb-4 overflow-hidden border border-primary/20">
                        <UIPreview variant={variant.id as any} />
                        {/* Selected Indicator */}
                        {selectedVariant === variant.id && (
                          <div className="absolute top-2 right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-pulse-glow">
                            <Check className="w-5 h-5 text-black" />
                          </div>
                        )}
                      </div>

                      {/* Variant Info */}
                      <h3 className="text-xl font-bold text-primary font-michroma mb-2">{variant.name}</h3>
                      <p className="text-white/70 text-sm font-electrolize mb-4">{variant.description}</p>

                      {/* Color Palette */}
                      <div className="flex gap-2">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white/20"
                          style={{ backgroundColor: `hsl(${variant.theme.primary})` }}
                        />
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white/20"
                          style={{ backgroundColor: `hsl(${variant.theme.secondary})` }}
                        />
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white/20"
                          style={{ backgroundColor: `hsl(${variant.theme.accent})` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button
                  onClick={() => setShowSelector(false)}
                  className="px-8 py-6 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-michroma text-lg"
                >
                  CLOSE
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
