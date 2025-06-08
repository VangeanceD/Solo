"use client"

import type { Player } from "@/lib/player"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState } from "react"

interface InventoryPageProps {
  player: Player
}

export function InventoryPage({ player }: InventoryPageProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const handleItemClick = (itemId: string) => {
    setSelectedItem(itemId === selectedItem ? null : itemId)
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary glow-text solo-text font-audiowide">Inventory</h2>
      </div>

      <Card className="bg-black/80 backdrop-blur-lg p-6 rounded-none border border-primary/30 shadow-[0_0_15px_rgba(0,168,255,0.3)] cyberpunk-border holographic-ui">
        <div className="holographic-header">Items</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {player.inventory && player.inventory.length > 0 ? (
            player.inventory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`bg-black/60 p-4 rounded-none border ${selectedItem === item.id ? "border-primary animate-border-glow" : "border-primary/30"} quest-card holographic-ui cursor-pointer`}
                onClick={() => handleItemClick(item.id)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-primary font-michroma">{item.name}</h3>
                  <div className="px-2 py-1 bg-primary/10 text-primary/70 rounded-none text-xs font-electrolize">
                    {item.category}
                  </div>
                </div>
                <p className="text-primary/60 mt-2 font-electrolize">{item.description}</p>

                {selectedItem === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-primary/30"
                  >
                    <div className="text-primary/80 font-michroma mb-2">Item Stats:</div>
                    <div className="space-y-2">
                      {Object.entries(item.stats).map(([stat, value]) => (
                        <div key={stat} className="flex justify-between">
                          <span className="text-primary/70 font-electrolize">{stat}</span>
                          <span className={`font-orbitron ${value.startsWith("-") ? "text-red-400" : "text-primary"}`}>
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div className="text-primary/70 font-electrolize">Rarity:</div>
                      <div className="text-primary font-orbitron">{item.rarity}</div>
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-between items-center mt-3">
                  <span className="text-primary/70 font-orbitron">{item.rarity}</span>
                  <Button className="px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded-none border border-primary/30 transition-colors tracking-wider btn-primary text-sm font-michroma">
                    {selectedItem === item.id ? "HIDE DETAILS" : "VIEW DETAILS"}
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-primary/60 col-span-2 font-electrolize">
              No items in inventory. Complete quests to earn items!
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
