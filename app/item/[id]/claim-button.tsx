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
  currentStatus: string
}

export function ClaimButton({ itemId, itemName, currentStatus }: ClaimButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">(
    currentStatus === "analyzing" || currentStatus === "returned" ? "success" : "idle",
  )
  const router = useRouter()

  const handleClaim = async () => {
    setStatus("loading")
    console.log("[v0] Claiming found item:", itemId)

    try {
      const updatedItem = await updateItem(itemId, {
        status: "analyzing",
      })

      if (updatedItem) {
        console.log("[v0] Item claimed successfully:", updatedItem)
        setStatus("success")

        // Refresh the page to show updated status
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
        <div className="flex flex-col items-center justify-center gap-3 text-green-800 text-center">
          <CheckCircle className="w-12 h-12" />
          <div>
            <p className="text-xl font-bold">Reivindicação Registrada!</p>
            <p className="text-sm mt-1">Sua solicitação está sendo analisada. Você será contatado em breve.</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-blue-600 hover:bg-blue-700 transition-colors">
      <Button
        onClick={handleClaim}
        disabled={status === "loading"}
        className="w-full bg-transparent hover:bg-white/10 text-white text-lg font-bold py-6 disabled:opacity-50"
        size="lg"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processando...
          </>
        ) : (
          "É MEU! (INICIAR REIVINDICAÇÃO)"
        )}
      </Button>
    </Card>
  )
}
