import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ItemWithDate {
  createdAt: string
  updatedAt?: string
}

/**
 * Ordena itens por data de criação ou atualização (mais recente primeiro por padrão)
 */
export function sortItemsByDate<T extends ItemWithDate>(items: T[], order: "asc" | "desc" = "desc"): T[] {
  if (!Array.isArray(items) || items.length === 0) {
    return []
  }

  return [...items].sort((a, b) => {
    // Usa updatedAt se disponível, caso contrário usa createdAt
    const dateA = new Date(a.updatedAt || a.createdAt).getTime()
    const dateB = new Date(b.updatedAt || b.createdAt).getTime()

    return order === "desc" ? dateB - dateA : dateA - dateB
  })
}

/**
 * Verifica se um item foi criado nas últimas 24 horas
 */
export function isNewItem(createdAt: string, hoursThreshold = 24): boolean {
  const now = Date.now()
  const itemDate = new Date(createdAt).getTime()
  const diffInHours = (now - itemDate) / (1000 * 60 * 60)

  return diffInHours <= hoursThreshold
}

/**
 * Retorna o tempo relativo em formato legível (ex: "2h atrás", "3 dias atrás")
 */
export function getRelativeTime(dateString: string): string {
  const now = Date.now()
  const date = new Date(dateString).getTime()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return "agora"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min atrás`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d atrás`

  return new Date(dateString).toLocaleDateString("pt-BR")
}

/**
 * Filtra e ordena itens para exibir os mais recentes
 */
export function getRecentItems<T extends ItemWithDate>(items: T[], limit = 4): T[] {
  const sorted = sortItemsByDate(items, "desc")
  return sorted.slice(0, limit)
}
