import { api } from '..'

interface GetProfileResponse {
  id: number
  name: string
  email: string
  phone: string | null
  role: 'manager' | 'customer'
  createdAt: Date | null
  updatedAt: Date | null
}

export async function getProfile() {
  const { data } = await api.get<GetProfileResponse>('/me')

  return data
}
