import { api } from '..'

interface GetManagedRestaurantResponse {
  id: number
  name: string
  role: 'manager' | 'customer'
  description: string | null
  managerId: string | null
  createdAt: Date | null
  updatedAt: Date | null
}

export async function getManagedRestaurant() {
  const { data } = await api.get<GetManagedRestaurantResponse>(
    '/managed-restaurant',
  )

  return data
}
