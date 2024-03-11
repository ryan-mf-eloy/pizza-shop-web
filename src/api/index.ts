import axios from 'axios'

import { env } from '@/env'

export const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  withCredentials: true,
})

/**
 * Apply delay to resolve requests - (Only to simulate loading states, don't use this in production)
 */
if (env.VITE_ENABLE_API_DELAY) {
  api.interceptors.request.use((config) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(config)
      }, 2000)
    })
  })
}
