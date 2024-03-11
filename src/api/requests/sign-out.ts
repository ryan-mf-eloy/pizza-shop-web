import { api } from '..'

export async function signOut() {
  await api.post('/sign-out')
}
