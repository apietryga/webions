import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'mysql',
  schema: './server/database/schema.ts',
  out: './server/database/migrations',
  dbCredentials: {
    user: "root",
    password: process.env.DATABASE_PASSWORD,
    host: "127.0.0.1",
    port: 3306,
    database: "webions",
  }
})