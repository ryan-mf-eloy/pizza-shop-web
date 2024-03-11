import { api } from '..'

interface UpadateProfileBody {
  name: string
  description: string | null
}

export async function updateProfile(body: UpadateProfileBody) {
  await api.put('/profile', { ...body })
}
