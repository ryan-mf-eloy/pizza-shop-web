import { api } from '..'

interface SignUpBody {
  restaurantName: string
  managerName: string
  phone: string
  email: string
}

export async function signUp(body: SignUpBody) {
  await api.post('/restaurants', { ...body })
}
