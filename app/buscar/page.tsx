"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { getAllItems } from "@/lib/api"
import { sortItemsByDate, isNewItem, getRelativeTime } from "@/lib/utils"

type Item = {
  id: string
  name: string
  category: string
  location: string
  date: string
  image: string
  color: string
  type: "found" | "lost"
}

export default function BuscarPage() {
  const [items, setItems] = useState<Item[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [itemType, setItemType] = useState<"all" | "found" | "lost">("all")
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadItems = async () => {
      try {
        console.log("[v0] Starting to load items from API...")
        const allItems = await getAllItems()
        console.log("[v0] Received items:", allItems.length)

        if (!allItems || allItems.length === 0) {
          setError("Nenhum item encontrado. Certifique-se de que o backend está rodando em http://localhost:4000")
          setItems([])
          return
        }

        const transformed = allItems.map((item) => ({
          id: String(item.id),
          name: item.name,
          category: item.category || "Outros",
          location: item.location,
          date: item.date,
          image: item.image,
          color: item.color || "Preto",
          type: item.type === "found" ? ("found" as const) : ("lost" as const),
        }))
        setItems(transformed)
        setError(null)
      } catch (error) {
        console.error("[v0] Error loading items:", error)
        setError("Erro ao carregar itens. Verifique se o backend está rodando.")
      } finally {
        setIsLoading(false)
      }
    }
    loadItems()
  }, [])

  const filteredItems = items
    .filter((item) => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(item.category)
      const colorMatch = selectedColors.length === 0 || selectedColors.includes(item.color)
      const typeMatch = itemType === "all" || item.type === itemType
      return categoryMatch && colorMatch && typeMatch
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === "recent" ? dateB - dateA : dateA - dateB
    })

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const toggleColor = (color: string) => {
    setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando itens...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-bold">
              Achados & Perdidos
            </Link>
          </div>
        </header>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-destructive/10 text-destructive p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Erro ao Carregar Itens</h2>
              <p className="mb-4">{error}</p>
              <div className="text-sm text-left bg-background p-4 rounded border">
                <p className="font-mono mb-2">Passos para resolver:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Verifique se o backend está rodando</li>
                  <li>
                    Execute: <code className="bg-muted px-1">cd backend && npm run dev</code>
                  </li>
                  <li>
                    O backend deve estar em <code className="bg-muted px-1">http://localhost:4000</code>
                  </li>
                </ol>
              </div>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Tentar Novamente
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold">
            Achados & Perdidos
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Filtrar por:</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Tipo</h4>
                  <div className="space-y-2">
                    <Button
                      variant={itemType === "all" ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setItemType("all")}
                    >
                      Todos
                    </Button>
                    <Button
                      variant={itemType === "found" ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setItemType("found")}
                    >
                      Achados
                    </Button>
                    <Button
                      variant={itemType === "lost" ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setItemType("lost")}
                    >
                      Perdidos
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Categoria</h4>
                  <div className="space-y-2">
                    {["Eletronicos", "Roupas", "Documentos", "Outros"].map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <Label htmlFor={category}>{category}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Cor Predominante</h4>
                  <div className="space-y-2">
                    {[
                      { name: "Preto", color: "bg-black" },
                      { name: "Vermelho", color: "bg-red-500" },
                      { name: "Amarelo", color: "bg-yellow-500" },
                      { name: "Verde", color: "bg-green-500" },
                      { name: "Azul", color: "bg-blue-500" },
                      { name: "Branco", color: "bg-white border" },
                    ].map(({ name, color }) => (
                      <div key={name} className="flex items-center space-x-2">
                        <Checkbox
                          id={name}
                          checked={selectedColors.includes(name)}
                          onCheckedChange={() => toggleColor(name)}
                        />
                        <Label htmlFor={name} className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded ${color}`} />
                          {name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Todos os Itens</h2>
                <p className="text-muted-foreground">{filteredItems.length} itens encontrados</p>
              </div>
              <Button variant="outline" onClick={() => setSortOrder(sortOrder === "recent" ? "oldest" : "recent")}>
                {sortOrder === "recent" ? "Mais Recentes Primeiro" : "Mais Antigos Primeiro"}
              </Button>
            </div>

            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum item encontrado com os filtros selecionados.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <Link key={item.id} href={item.type === "found" ? `/item/${item.id}` : `/perdido/${item.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="aspect-square relative bg-muted">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {isNewItem(item.date) && (
                          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            NOVO
                          </span>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-1">Local: {item.location}</p>
                        <p className="text-sm text-muted-foreground">Data: {getRelativeTime(item.date)}</p>
                        <span
                          className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                            item.type === "found" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {item.type === "found" ? "ACHADO" : "PERDIDO"}
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
