import * as zod from 'zod'

const envSchema = zod.object({
  VITE_API_BASE_URL: zod.string().url(),
  VITE_ENABLE_API_DELAY: zod.string().transform((val) => val === 'true'),
})

export const env = envSchema.parse(import.meta.env)
