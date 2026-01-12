const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export interface Item {
  title: string | undefined
  imageUrl: string
  id: string // Backend uses string IDs
  name: string // Backend uses 'name' not 'title'
  description: string
  category: string
  color: string
  location: string
  date: string
  image: string
  type: "lost" | "found" // Backend uses lowercase
  status: "registered" | "analyzing" | "returned" // Backend uses lowercase
  contactName?: string
  contactEmail?: string
  createdAt: string
}

interface ApiResponse<T> {
  success: boolean
  data: T
  total?: number
  message?: string
  error?: string
}

export interface CreateItemDTO {
  name: string
  description: string
  category: string
  color: string
  location: string
  date: string
  type: "lost" | "found"
  contactName?: string
  contactEmail?: string
}

// Fetch all items
export async function getAllItems(): Promise<Item[]> {
  try {
    console.log("[v0] Fetching all items from API")
    const response = await fetch(`${API_BASE_URL}/api/items`, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const result: ApiResponse<Item[]> = await response.json()
    console.log("[v0] API Response:", result)
    return result.data || []
  } catch (error) {
    console.error("[API] Erro ao buscar todos os itens:", error)
    return []
  }
}

// Fetch item by ID
export async function getItemById(id: string): Promise<Item | null> {
  try {
    console.log(`[v0] Fetching item ${id} from API`)
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
      cache: "no-store", // Don't cache to always get fresh data
    })

    if (!response.ok) {
      console.error(`[v0] API returned status ${response.status}`)
      return null
    }

    const result: ApiResponse<Item> = await response.json()
    console.log("[v0] Item data:", result.data)
    return result.data || null
  } catch (error) {
    console.error(`[API] Erro ao buscar item ${id}:`, error)
    return null
  }
}

// Create new item with image
export async function createItem(formData: FormData): Promise<Item | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/items`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const result: ApiResponse<Item> = await response.json()
    return result.data || null
  } catch (error) {
    console.error("[API] Erro ao criar item:", error)
    return null
  }
}

// Update item
export async function updateItem(id: string, data: Partial<Item>): Promise<Item | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const result: ApiResponse<Item> = await response.json()
    return result.data || null
  } catch (error) {
    console.error(`[API] Erro ao atualizar item ${id}:`, error)
    return null
  }
}

// Delete item
export async function deleteItem(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error(`[API] Erro ao deletar item ${id}:`, error)
    return false
  }
}
