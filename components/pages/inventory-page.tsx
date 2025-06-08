"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Package } from "lucide-react"
import type { Player } from "@/lib/player"

interface InventoryPageProps {
  player: Player
}

export function InventoryPage({ player }: InventoryPageProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary font-audiowide glow-text">INVENTORY</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {player.inventory.length > 0 ? (
          player.inventory.map((item) => (
            <Card key={item.id} className="bg-black/60 backdrop-blur-md border border-primary/30 quest-card">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <Package className="w-5 h-5 text-primary/70 mr-2" />
                  <h3 className="text-lg font-semibold text-primary font-michroma">{item.name}</h3>
                </div>
                <p className="text-white/70 mb-3 text-sm font-electrolize">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-primary/70 text-sm font-orbitron">{item.type}</span>
                  <span className="text-white/50 text-sm font-electrolize">{item.effect}</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8 bg-black/40 border border-primary/20">
            <Package className="w-12 h-12 text-primary/30 mx-auto mb-2" />
            <p className="text-white/50 font-electrolize">Your inventory is empty</p>
          </div>
        )}
      </div>
    </div>
  )
}
