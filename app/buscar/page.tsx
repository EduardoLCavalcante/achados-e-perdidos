"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { getAllItems } from "@/lib/api"

const colors = [
  { name: "Preto", class: "bg-black" },
  { name: "Vermelho", class: "bg-red-500" },
  { name: "Amarelo", class: "bg-yellow-400" },
  { name: "Verde", class: "bg-green-500" },
  { name: "Azul", class: "bg-blue-500" },
  { name: "Branco", class: "bg-white border border-gray-300" },
]

export default function BuscarPage() {
  const [allItems, setAllItems] = useState<any[]>([])

  useEffect(() => {
    getAllItems().then(setAllItems)
  }, [])

  const [viewMode, setViewMode] = useState<"lista" | "mapa">("lista")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Eletronicos", "Roupas", "Documentos"])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [itemType, setItemType] = useState<"all" | "ACHADO" | "PERDIDO">("all")

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const filteredItems = (Array.isArray(allItems) ? allItems : []).filter((item) => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(item.category)
    const colorMatch = selectedColors.length === 0 || selectedColors.includes(item.color)
    const typeMatch = itemType === "all" || (itemType === "ACHADO" && item.type === "ACHADO") || (itemType === "PERDIDO" && item.type === "PERDIDO")
    return categoryMatch && colorMatch && typeMatch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600">
            Achados <span className="text-gray-400">&</span> Perdidos
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 space-y-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800">Filtrar por:</h2>

              {/* Category Filter */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <Checkbox
                    id="categoria-all"
                    checked={selectedCategories.length === 3}
                    onCheckedChange={() => {
                      if (selectedCategories.length === 3) {
                        setSelectedCategories([])
                      } else {
                        setSelectedCategories(["Eletronicos", "Roupas", "Documentos"])
                      }
                    }}
                    className="mr-2"
                  />
                  <Label htmlFor="categoria-all" className="cursor-pointer">
                    Categoria
                  </Label>
                </h3>
                <div className="space-y-2 ml-6">
                  {["Eletronicos", "Roupas", "Documentos"].map((category) => (
                    <div key={category} className="flex items-center">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                        className="mr-2"
                      />
                      <Label htmlFor={category} className="cursor-pointer text-sm">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Cor Predominante</h3>
                <div className="grid grid-cols-6 gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        setSelectedColors((prev) =>
                          prev.includes(color.name) ? prev.filter((c) => c !== color.name) : [...prev, color.name],
                        )
                      }}
                      className={`w-10 h-10 rounded-md ${color.class} ${
                        selectedColors.includes(color.name)
                          ? "ring-2 ring-blue-500 ring-offset-2"
                          : "hover:ring-2 hover:ring-gray-300"
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Date Filter */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Data do Achado</h3>
                <input
                  type="date"
                  defaultValue="2023-10-09"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Item Type Filter */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Tipo de Item</h3>
                <div className="space-y-2">
                  <Button
                    variant={itemType === "all" ? "default" : "outline"}
                    onClick={() => setItemType("all")}
                    className="w-full justify-start"
                  >
                    Todos
                  </Button>
                  <Button
                    variant={itemType === "ACHADO" ? "default" : "outline"}
                    onClick={() => setItemType("ACHADO")}
                    className="w-full justify-start"
                  >
                    Itens Achados
                  </Button>
                  <Button
                    variant={itemType === "PERDIDO" ? "default" : "outline"}
                    onClick={() => setItemType("PERDIDO")}
                    className="w-full justify-start"
                  >
                    Itens Perdidos
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* View Toggle */}
            <div className="bg-white rounded-lg p-4 mb-6 flex items-center justify-between">
              <span className="text-gray-700 font-medium">Visualizacao:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "lista" ? "default" : "outline"}
                  onClick={() => setViewMode("lista")}
                  className="rounded-full"
                >
                  Lista
                </Button>
                <Button
                  variant={viewMode === "mapa" ? "default" : "outline"}
                  onClick={() => setViewMode("mapa")}
                  className="rounded-full"
                >
                  Mapa Interativo
                </Button>
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Link key={item.id} href={item.type === "PERDIDO" ? `/perdido/${item.id}` : `/item/${item.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-square bg-gray-100 relative">
                      {/* Item Type Badge */}
                      <div className="absolute top-2 right-2 z-10">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.type === "PERDIDO" ? "bg-orange-500 text-white" : "bg-green-500 text-white"
                          }`}
                        >
                          {item.type === "PERDIDO" ? "Perdido" : "Achado"}
                        </span>
                      </div>
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="font-semibold text-gray-800">{item.name}</h4>
                      <div className="flex items-start space-x-2 text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>Local: {item.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Data: {item.date}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
