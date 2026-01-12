// REMOVA ESTA LINHA SE FOR NEXT.JS 15 (SERVER COMPONENT)
// Na verdade, como seu código usa 'async', NÃO pode ter "use client".
// O código abaixo é a versão correta (Server Component):

import { getItemById } from "@/lib/api"
import Link from "next/link"
import Image from "next/image" // Importante para otimização
import { MapPin, Calendar, Info, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default async function PerdidoDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
        <Card className="overflow-hidden"> {/* Adicionado overflow-hidden para a imagem respeitar a borda */}
          
          {/* SEÇÃO DA IMAGEM (Adicionada de volta) */}
          <div className="relative w-full h-96 bg-gray-200">
             {/* Usando <img> normal se não tiver o domínio configurado no next.config.js, 
                 ou <Image fill /> se estiver configurado */}
             <img 
               src={item.imageUrl || "/placeholder.svg"} 
               alt={item.title}
               className="w-full h-full object-cover"
             />
          </div>

          <div className="p-8">
            {/* Header do Item */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{item.title}</h1>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                    {item.status}
                  </span>
                </div>
                {/* ID discreto para referência */}
                <span className="text-gray-400 text-sm">ID: #{item.id}</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
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
                  {/* Formata a data para ficar legível */}
                  <p className="text-lg text-gray-800">
                    {new Date(item.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-3">
                <Info className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-800">Descrição</h2>
              </div>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                {item.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Transformamos o botão em Link para funcionar sem JavaScript (Client Side) */}
              <Link 
                href={`https://wa.me/5588999999999?text=Olá, encontrei o item: ${item.title}`} 
                target="_blank"
                className="flex-1"
              >
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Tenho esse Item!
                </Button>
              </Link>
              
              <Link href="/buscar" className="flex-1">
                <Button variant="outline" className="w-full py-6 text-lg font-semibold bg-transparent">
                  Ver Todos os Itens
                </Button>
              </Link>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <strong>Dica de Segurança:</strong> Marque encontros em locais públicos e movimentados, como na portaria da universidade.
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}