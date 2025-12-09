import axios from 'axios'

const API_BASE_URL = 'http://localhost:5001/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface Quest {
  id: number
  title: string
  isCompleted: boolean
  createdAt: string
}

export interface CreateQuestDto {
  title: string
}

export const questApi = {
  // クエスト一覧取得
  getAll: async (): Promise<Quest[]> => {
    const response = await apiClient.get<Quest[]>('/quests')
    return response.data
  },

  // クエスト作成
  create: async (dto: CreateQuestDto): Promise<Quest> => {
    const response = await apiClient.post<Quest>('/quests', dto)
    return response.data
  },

  // クエスト完了切り替え
  toggle: async (id: number): Promise<Quest> => {
    const response = await apiClient.patch<Quest>(`/quests/${id}/toggle`)
    return response.data
  },

  // クエスト削除
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/quests/${id}`)
  },
}
