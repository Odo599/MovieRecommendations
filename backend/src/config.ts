import * as z from "zod";

const envSchema = z.object({
    POSTGRES_USERNAME: z.string().min(1),
    POSTGRES_PASSWORD: z.string().min(1),
    POSTGRES_HOST: z.string().min(1),
    POSTGRES_PORT: z.coerce.number().min(1).default(5432),
    REDIS_HOST: z.string().min(1),
    REDIS_PASSWORD: z.string().min(1),
    TMDB_API_KEY: z.string().min(1),
    JWT_SECRET: z.string().min(24),
});

export const config = envSchema.parse(process.env);
