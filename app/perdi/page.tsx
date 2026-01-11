"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { CheckCircle, Upload } from "lucide-react"
import { createItem } from "@/lib/api"

export default function PerdiItemPage() {
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    descricao: "",
    local: "",
    imagem: null as File | null,
  })
  const [preview, setPreview] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, imagem: file })
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const submitData = new FormData()
    
    // CORREÇÃO 1: Mudamos de "title" para "name" (como o backend pediu)
    submitData.append("name", formData.nome) 
    
    // CORREÇÃO 2: Adicionamos a categoria que estava faltando
    submitData.append("category", formData.categoria) 
    
    // CORREÇÃO 3: Garantimos que location está sendo enviado
    submitData.append("location", formData.local)
    
    submitData.append("description", formData.descricao)
    submitData.append("type", "PERDIDO")
    
    // Data em formato ISO para evitar erro de formatação
    submitData.append("date", new Date().toISOString())

    if (formData.imagem) {
      submitData.append("image", formData.imagem)
    }

    try {
      console.log("Enviando dados:", Object.fromEntries(submitData)) // Log para conferência
      const result = await createItem(submitData)
      
      if (result) {
        setSubmitted(true)
        setTimeout(() => {
          setSubmitted(false)
          setFormData({ nome: "", categoria: "", descricao: "", local: "", imagem: null })
          setPreview(null)
        }, 3000)
      }
    } catch (error: any) {
      console.error("Erro ao registrar item:", error)
      // Agora o alert vai mostrar exatamente o que o backend reclamar
      alert(error.message || "Erro ao registrar item")
    }
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
      <main className="max-w-2xl mx-auto px-6 py-12">
        <Card className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Registrar Item Perdido</h1>
          <p className="text-gray-600 mb-8">Preencha os dados abaixo para registrar um item que você perdeu</p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Foto do Item */}
              <div>
                <Label htmlFor="imagem" className="text-sm font-semibold text-gray-700">
                  Foto do Item
                </Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8">
                  {preview ? (
                    <div className="space-y-4">
                      <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          document.getElementById("imagem")?.click()
                        }}
                        className="w-full text-sm text-orange-500 hover:text-orange-600 font-medium"
                      >
                        Trocar Imagem
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="imagem" className="cursor-pointer block text-center">
                      <div className="flex justify-center mb-3">
                        <Upload className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-gray-600 font-medium mb-1">Clique para enviar uma foto</p>
                      <p className="text-gray-500 text-sm">ou arraste uma imagem aqui</p>
                    </label>
                  )}
                  <input id="imagem" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </div>
              </div>

              {/* Nome do Item */}
              <div>
                <Label htmlFor="nome" className="text-sm font-semibold text-gray-700">
                  Nome do Item *
                </Label>
                <input
                  id="nome"
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Carteira de couro marrom"
                  className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Categoria */}
              <div>
                <Label htmlFor="categoria" className="text-sm font-semibold text-gray-700">
                  Categoria *
                </Label>
                <select
                  id="categoria"
                  required
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Eletronicos">Eletrônicos</option>
                  <option value="Documentos">Documentos</option>
                  <option value="Roupas">Roupas</option>
                  <option value="Acessorios">Acessórios</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              {/* Descrição */}
              <div>
                <Label htmlFor="descricao" className="text-sm font-semibold text-gray-700">
                  Descrição *
                </Label>
                <textarea
                  id="descricao"
                  required
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva o item perdido com o máximo de detalhes possível"
                  rows={4}
                  className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              {/* Local */}
              <div>
                <Label htmlFor="local" className="text-sm font-semibold text-gray-700">
                  Local onde perdeu *
                </Label>
                <input
                  id="local"
                  type="text"
                  required
                  value={formData.local}
                  onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                  placeholder="Ex: Bloco A, Biblioteca"
                  className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg font-semibold"
                >
                  Registrar Item Perdido
                </Button>
                <Link href="/">
                  <Button type="button" variant="outline" className="w-full py-6 text-lg font-semibold bg-transparent">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          ) : (
            <div className="py-12 text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Item Registrado com Sucesso!</h2>
                <p className="text-gray-600">
                  Seu item foi registrado em nosso sistema. Você receberá uma notificação caso alguém o encontre.
                </p>
              </div>
              <Link href="/">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg">
                  Voltar para Home
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
