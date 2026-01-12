import { getItemById } from "@/lib/api"
import Link from "next/link"
import { MapPin, Calendar, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default async function PerdidoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  console.log("[v0] Loading perdido page for ID:", id)
  const item = await getItemById(id)
  console.log("[v0] Item loaded:", item)

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Item não encontrado</h1>
          <p className="text-gray-600 mb-4">ID buscado: {id}</p>
          <Link href="/buscar">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Voltar para Busca</Button>
          </Link>
        </div>
      </div>
    )
  }

  const statusMap: Record<string, string> = {
    registered: "Registrado",
    analyzing: "Em Analise/Aguardando",
    returned: "Devolvido",
  }

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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <Card className="p-8">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{item.name}</h1>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                    {statusMap[item.status] || item.status}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                    {item.type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Category */}
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase">Categoria</p>
                <p className="text-lg text-gray-800">{item.category}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase">Local</p>
                <p className="text-lg text-gray-800">{item.location}</p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase">Data</p>
                <p className="text-lg text-gray-800">{item.date}</p>
              </div>
            </div>

            {/* Color */}
            {item.color && (
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <div
                    className="w-5 h-5 rounded-full border-2 border-gray-400"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase">Cor</p>
                  <p className="text-lg text-gray-800 capitalize">{item.color}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-3">
              <Info className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-800">Descrição</h2>
            </div>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">{item.description}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold">
              Tenho esse Item!
            </Button>
            <Link href="/buscar" className="flex-1">
              <Button variant="outline" className="w-full py-6 text-lg font-semibold bg-transparent">
                Ver Todos os Itens
              </Button>
            </Link>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Importante:</strong> Se você encontrou este item, clique em "Tenho esse Item!" para entrar em
              contato com o proprietário.
            </p>
          </div>
        </Card>
      </main>
    </div>
  )
}
