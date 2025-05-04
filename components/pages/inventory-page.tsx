"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Shield, Book, Zap } from "lucide-react"
import type { Player } from "@/lib/player"

interface InventoryPageProps {
  player: Player
}

export function InventoryPage({ player }: InventoryPageProps) {
  const itemTypes = ["all", "equipment", "consumable", "book", "special"]

  const filterItems = (type: string) => {
    if (type === "all") return player.inventory
    return player.inventory.filter((item) => item.type === type)
  }

  const getItemIcon = (type: string) => {
    switch (type) {
      case "equipment":
        return <Shield className="w-5 h-5 text-primary/70" />
      case "book":
        return <Book className="w-5 h-5 text-primary/70" />
      case "consumable":
        return <Zap className="w-5 h-5 text-primary/70" />
      default:
        return <Package className="w-5 h-5 text-primary/70" />
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary font-audiowide glow-text">INVENTORY</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-5 mb-6 bg-black/60 border border-primary/30">
          {itemTypes.map((type) => (
            <TabsTrigger
              key={type}
              value={type}
              className="font-michroma data-[state=active]:bg-primary/20 data-[state=active]:text-primary capitalize"
            >
              {type}
            </TabsTrigger>
          ))}
        </TabsList>

        {itemTypes.map((type) => (
          <TabsContent key={type} value={type} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filterItems(type).length > 0 ? (
                filterItems(type).map((item) => (
                  <Card
                    key={item.id}
                    className="bg-black/60 backdrop-blur-md border border-primary/30 hover:border-primary/60 transition-all duration-300"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            {getItemIcon(item.type)}
                            <h3 className="text-lg font-semibold text-primary ml-2 font-michroma">{item.name}</h3>
                          </div>
                          <p className="text-white/70 mb-3 text-sm font-electrolize">{item.description}</p>
                          <div className="text-primary/70 text-xs font-orbitron uppercase mb-2">Type: {item.type}</div>
                          <div className="text-primary/70 text-xs font-orbitron uppercase">Effect: {item.effect}</div>
                        </div>
                        <Button
                          variant="ghost"
                          className={`ml-4 px-3 py-1 ${
                            item.equipped
                              ? "bg-primary/20 text-primary border border-primary/30"
                              : "bg-black/40 text-white/70 border border-primary/10 hover:bg-primary/10 hover:text-primary"
                          } rounded-none text-xs font-michroma`}
                        >
                          {item.equipped ? "EQUIPPED" : "EQUIP"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8 bg-black/40 border border-primary/20">
                  <Package className="w-12 h-12 text-primary/30 mx-auto mb-2" />
                  <p className="text-white/50 font-electrolize">No items found in this category</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
