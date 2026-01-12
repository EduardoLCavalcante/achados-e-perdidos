"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react"
import { updateItem } from "@/lib/api"
import { useRouter } from "next/navigation"

interface ClaimButtonProps {
  itemId: string
  itemName: string
}

export function ClaimButton({ itemId, itemName }: ClaimButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")
  const router = useRouter()

    const handleClaim = async () => {
    setStatus("loading")
    console.log("[v0] Claiming item:", itemId)

    try {
        const updatedItem = await updateItem(itemId, {
        type: "found",
        })

        if (updatedItem) {
        console.log("[v0] Item marcado como encontrado:", updatedItem)
        setStatus("success")
        router.refresh()
        } else {
        throw new Error("Failed to update item")
        }
    } catch (error) {
        console.error("[v0] Error claiming item:", error)
        setStatus("idle")
        alert("Erro ao registrar reivindicação. Tente novamente.")
    }
    }

  if (status === "success") {
    return (
      <Card className="p-6 bg-green-100 border-2 border-green-500">
        <div className="flex items-center justify-center gap-3 text-green-800">
          <CheckCircle className="w-8 h-8" />
          <div>
            <p className="text-xl font-bold">Item Registrado!</p>
            <p className="text-sm">O proprietário será notificado sobre sua reivindicação.</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Button
      onClick={handleClaim}
      disabled={status === "loading"}
      className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold disabled:opacity-50"
    >
      {status === "loading" ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Processando...
        </>
      ) : (
        "Tenho esse Item!"
      )}
    </Button>
  )
}
