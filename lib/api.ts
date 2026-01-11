const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export interface Item {
  id: number
  title: string
  description: string
  location: string
  type: "ACHADO" | "PERDIDO"
  imageUrl: string
  date: string
  status: "Registrado" | "Em Analise/Aguardando" | "Devolvido"
  createdAt: string
  // category: string // Adicionei isso pois vi no seu erro anterior que existia
  // color: string    // Adicionei isso pois vi no seu erro anterior que existia
}

export interface CreateItemDTO {
  title: string
  description: string
  location: string
  type: "ACHADO" | "PERDIDO"
  date: string
}

// Fetch all items
export async function getAllItems(): Promise<Item[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/items`, {
      cache: "no-store", // Mudado para evitar cache de dados velhos durante dev
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    
    // SEGURANÇA: Garante que sempre retorna um array, mesmo se a API mandar objeto
    return Array.isArray(data) ? data : (data.data || [])
  } catch (error) {
    console.error("[API] Erro ao buscar todos os itens:", error)
    return []
  }
}

// Fetch item by ID
export async function getItemById(id: number): Promise<Item | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`[API] Erro ao buscar item ${id}:`, error)
    return null
  }
}

// Create new item with image (AQUI ESTAVA O PROBLEMA DE DEBUG)
export async function createItem(formData: FormData): Promise<Item | null> {
  try {
    // NOTA: Ao enviar FormData, NÃO defina 'Content-Type': 'application/json' manualmente.
    // O navegador faz isso sozinho definindo o 'boundary' do multipart.
    
    const response = await fetch(`${API_BASE_URL}/api/items`, {
      method: "POST",
      body: formData, 
    })

    // SE A RESPOSTA NÃO FOR OK (Ex: 400 ou 500)
    if (!response.ok) {
      // Tentamos ler o corpo do erro como JSON, se falhar, lemos como texto
      let errorMessage = `Erro ${response.status}`
      try {
        const errorBody = await response.json()
        console.log("❌ DETALHES DO ERRO DO BACKEND:", errorBody) // <--- OLHE AQUI NO CONSOLE
        errorMessage = errorBody.message || JSON.stringify(errorBody)
      } catch (e) {
        const errorText = await response.text()
        console.log("❌ DETALHES DO ERRO (TEXTO):", errorText)
        errorMessage = errorText
      }
      
      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    console.error("[API] Erro final ao criar item:", error)
    throw error // Re-lançamos o erro para o componente pegar e mostrar um toast/alerta
  }
}

// Update item
export async function updateItem(id: number, data: Partial<Item>): Promise<Item | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
       const errorBody = await response.json().catch(() => ({}))
       console.error("Erro update:", errorBody)
       throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`[API] Erro ao atualizar item ${id}:`, error)
    return null
  }
}

// Delete item
export async function deleteItem(id: number): Promise<boolean> {
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