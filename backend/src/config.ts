import * as z from "zod"

const envSchema = z.object({
    JWT_SECRET: z.string().min(24),
    DATABASE_URL: z.string().min(10),
    TMDB_API_KEY: z.string().min(1),
    REDIS_HOST: z.string().min(1),
    REDIS_PASSWORD: z.string().min(1),
})

export const config = envSchema.parse(process.env)
