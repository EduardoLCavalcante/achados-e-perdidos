import Link from "next/link"
import { Search, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getRecentItems } from "@/lib/api"

async function fetchRecentItems() {
  try {
    console.log("[v0] [HomePage] Buscando itens recentes do tipo 'found'...")

    const recentItems = await getRecentItems("found", 4)

    console.log("[v0] [HomePage] Itens recentes carregados:", recentItems.length)
    console.log(
      "[v0] [HomePage] Timestamps dos itens:",
      recentItems.map((i) => ({
        id: i.id,
        name: i.name,
        createdAt: i.createdAt,
      })),
    )

    return recentItems
  } catch (error) {
    console.error("[v0] [HomePage] ERRO ao buscar itens recentes:", error)
    return []
  }
}

export default async function HomePage() {
  const recentItems = await fetchRecentItems()

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
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-700">Últimos itens encontrados</h3>
            <p className="text-sm text-gray-500">Atualizados automaticamente</p>
          </div>

          {recentItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-lg mb-2 font-medium">Nenhum item encontrado no momento.</p>
              <p className="text-sm">
                Verifique se o servidor backend está rodando em{" "}
                {process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentItems.map((item) => (
                <Link key={item.id} href={`/item/${item.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {new Date(item.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000 && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          NOVO
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="font-semibold text-gray-800 line-clamp-1">{item.name}</h4>
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
                        <span className="line-clamp-1">{item.location}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>{new Date(item.date).toLocaleDateString("pt-BR")}</span>
                        </div>
                        <span className="text-xs text-gray-400">{getRelativeTime(item.createdAt)}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function getRelativeTime(dateString: string): string {
  const now = Date.now()
  const date = new Date(dateString).getTime()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return "agora"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min atrás`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d atrás`
  return new Date(dateString).toLocaleDateString("pt-BR")
}
