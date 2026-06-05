import dotenv from "dotenv";
dotenv.config({ path: "../.env"})
import { defineConfig } from 'drizzle-kit';

const POSTGRES_URI = `postgres://${process.env.POSTGRES_USERNAME}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/postgres`

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: POSTGRES_URI,
  },
});
