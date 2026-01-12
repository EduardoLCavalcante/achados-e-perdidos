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
  { name: "Prata", class: "bg-gray-400" }, // Adicionei Prata pois tem no mock
  { name: "Marrom", class: "bg-amber-800" }, // Adicionei Marrom pois tem no mock
]

// Lista expandida para incluir as categorias do Mock
const categoriesList = ["Eletronicos", "Roupas", "Documentos", "Acessórios", "Utensílios", "Material Escolar", "Outros"]

export default function BuscarPage() {
  const [allItems, setAllItems] = useState<any[]>([])
  
  // URL base para imagens relativas
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

  useEffect(() => {
    getAllItems().then((data) => {
        // Garante que é array
        setAllItems(Array.isArray(data) ? data : [])
    })
  }, [])

  const [viewMode, setViewMode] = useState<"lista" | "mapa">("lista")
  
  // CORREÇÃO 1: Começa com array VAZIO para mostrar TUDO inicialmente
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [itemType, setItemType] = useState<"all" | "ACHADO" | "PERDIDO">("all")

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const filteredItems = (Array.isArray(allItems) ? allItems : []).filter((item) => {
    // Lógica de Categoria (Case insensitive para evitar erros de digitação)
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.some(c => c.toLowerCase() === item.category?.toLowerCase())
    
    // Lógica de Cor
    const colorMatch = selectedColors.length === 0 || selectedColors.some(c => c.toLowerCase() === item.color?.toLowerCase())
    
    // CORREÇÃO 2: Normalizando o Tipo (backend envia 'found', front espera 'ACHADO')
    const itemTypeNormalized = item.type === "found" ? "ACHADO" : item.type === "lost" ? "PERDIDO" : item.type
    
    const typeMatch = itemType === "all" || 
                      (itemType === "ACHADO" && itemTypeNormalized === "ACHADO") || 
                      (itemType === "PERDIDO" && itemTypeNormalized === "PERDIDO")

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
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-80 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 space-y-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800">Filtrar por:</h2>

              {/* Category Filter */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <Checkbox
                    id="categoria-all"
                    checked={selectedCategories.length === 0}
                    onCheckedChange={() => setSelectedCategories([])} // Limpar filtros = Selecionar todos
                    className="mr-2"
                  />
                  <Label htmlFor="categoria-all" className="cursor-pointer">
                    Todas as Categorias
                  </Label>
                </h3>
                <div className="space-y-2 ml-6 max-h-60 overflow-y-auto">
                  {categoriesList.map((category) => (
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
              <span className="text-gray-700 font-medium">
                {filteredItems.length} itens encontrados
              </span>
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
            {filteredItems.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-lg">
                 <p className="text-gray-500 text-lg">Nenhum item encontrado com esses filtros.</p>
                 <Button 
                   variant="link" 
                   onClick={() => {
                     setSelectedCategories([])
                     setSelectedColors([])
                     setItemType("all")
                   }}
                   className="text-blue-500"
                 >
                   Limpar Filtros
                 </Button>
               </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                 // Normaliza o tipo para exibição
                 const isLost = item.type === "PERDIDO" || item.type === "lost";
                 
                 // CORREÇÃO 3: Lógica segura de imagem (Unsplash ou Upload local)
                 const imageUrl = item.image?.startsWith("http") 
                    ? item.image 
                    : item.image 
                        ? `${API_BASE_URL}${item.image}` 
                        : "/placeholder.svg";

                 return (
                <Link key={item.id} href={isLost ? `/perdido/${item.id}` : `/item/${item.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                    <div className="aspect-square bg-gray-100 relative">
                      {/* Item Type Badge */}
                      <div className="absolute top-2 right-2 z-10">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            isLost ? "bg-orange-500 text-white" : "bg-green-500 text-white"
                          }`}
                        >
                          {isLost ? "Perdido" : "Achado"}
                        </span>
                      </div>
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Fallback se a imagem falhar
                            e.currentTarget.src = "https://placehold.co/400x400?text=Sem+Imagem"
                        }}
                      />
                    </div>
                    <div className="p-4 space-y-2 flex-1">
                      <h4 className="font-semibold text-gray-800 line-clamp-1">{item.name}</h4>
                      <div className="flex items-start space-x-2 text-sm text-gray-600">
                        <MapPinIcon />
                        <span className="line-clamp-1">Local: {item.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <CalendarIcon />
                        <span>Data: {new Date(item.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              )})}
            </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

// Icon Components para não poluir o código principal
function MapPinIcon() {
    return (
        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    )
}

function CalendarIcon() {
    return (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    )
}