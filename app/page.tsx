import Link from "next/link"
import { Search, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getAllItems } from "@/lib/api"

async function getRecentItems() {
  try {
    const response = await getAllItems()
    
    // VERIFICAÇÃO DE SEGURANÇA:
    // Se response for nulo ou não for array, usamos um array vazio []
    const items = Array.isArray(response) ? response : []

    return items
      .filter((item) => item.type === "ACHADO")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4)

  } catch (error) {
    console.error("Erro ao buscar itens:", error)
    return [] // Retorna array vazio para não quebrar a página em caso de erro
  }
}
export default async function HomePage() {
  const recentItems = await getRecentItems()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            Achados <span className="text-gray-400">&</span> Perdidos
          </h1>
          <div className="relative">
            <input
              type="search"
              placeholder="Pesquisar..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Lost Item Card */}
          <Link href="/perdi">
            <Card className="p-12 bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 transition-all cursor-pointer group">
              <div className="flex flex-col items-center justify-center text-white space-y-6">
                <div className="p-6 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
                  <Search className="w-16 h-16" />
                </div>
                <h2 className="text-3xl font-bold tracking-wide">PERDI UM ITEM</h2>
              </div>
            </Card>
          </Link>

          {/* Found Item Card */}
          <Link href="/buscar">
            <Card className="p-12 bg-gradient-to-br from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 transition-all cursor-pointer group">
              <div className="flex flex-col items-center justify-center text-white space-y-6">
                <div className="p-6 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-16 h-16" />
                </div>
                <h2 className="text-3xl font-bold tracking-wide">ACHEI UM ITEM</h2>
              </div>
            </Card>
          </Link>
        </div>

        {/* Recent Items Section */}
        <section>
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">Últimos itens encontrados</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentItems.map((item) => (
              <Link key={item.id} href={`/item/${item.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-square bg-gray-100 relative">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-semibold text-gray-800">{item.title}</h4>
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
                      <span>Data: {item.createdAt}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
