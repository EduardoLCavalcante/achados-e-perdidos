import Link from "next/link"
import { CheckCircle, Clock, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getItemById } from "@/lib/api"

// Mock item details
const itemDetails: Record<string, any> = {
  "1": {
    id: 1,
    name: "Carteira de Couro Preta",
    image: "/images/tela2.png",
    location: "Bloco C, Proximo a Cantina",
    date: "15/10/2023",
    status: "Em Analise/Aguardando",
    description: "Carteira de couro preta encontrada próxima à cantina do Bloco C",
  },
  "2": {
    id: 2,
    name: "Garrafa Térmica",
    image: "/stainless-steel-bottle.png",
    location: "Bloco B, Cantina",
    date: "19/10/2023",
    status: "Registrado",
    description: "Garrafa térmica em aço inoxidável",
  },
}

const statusSteps = [
  { label: "Registrado", icon: CheckCircle, status: "complete" },
  { label: "Em Analise/Aguardando", icon: Clock, status: "current" },
  { label: "Devolvido", icon: CheckCircle, status: "pending" },
]

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const item = await getItemById(Number.parseInt(id))

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Item não encontrado</h1>
          <Link href="/buscar">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Voltar para Busca</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getStepStatus = (stepLabel: string) => {
    if (item.status === "Registrado") {
      if (stepLabel === "Registrado") return "complete"
      return "pending"
    }
    if (item.status === "Em Analise/Aguardando") {
      if (stepLabel === "Registrado") return "complete"
      if (stepLabel === "Em Analise/Aguardando") return "current"
      return "pending"
    }
    if (item.status === "Devolvido") {
      return "complete"
    }
    return "pending"
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
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Item Image */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <img
              src={item.imageUrl || "/placeholder.svg"}
              alt={item.title}
              className="w-full aspect-square object-cover"
            />
          </div>

          {/* Item Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{item.title}</h1>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <span className="font-semibold">Achado no:</span> {item.location}
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <span className="font-semibold">Data:</span> {item.date}
                  </div>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="space-y-6">
              <div className="flex items-center justify-between relative">
                {/* Progress Line */}
                <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{
                      width:
                        item.status === "Registrado" ? "0%" : item.status === "Em Analise/Aguardando" ? "50%" : "100%",
                    }}
                  />
                </div>

                {statusSteps.map((step, index) => {
                  const status = getStepStatus(step.label)
                  const Icon = step.icon

                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center ${
                          status === "complete"
                            ? "bg-green-500 text-white"
                            : status === "current"
                              ? "bg-orange-500 text-white"
                              : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="mt-3 text-center">
                        <p
                          className={`text-sm font-semibold ${
                            status === "current" ? "text-gray-800" : "text-gray-600"
                          }`}
                        >
                          {index + 1}.{step.label}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Claim Button */}
            <Card className="p-6 bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer">
              <Button className="w-full bg-transparent hover:bg-white/10 text-white text-lg font-bold py-6" size="lg">
                É MEU! (INICIAR REIVINDICAÇÃO)
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
