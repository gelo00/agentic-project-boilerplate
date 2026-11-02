import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/db/schema/postgres.schema.ts",

  out: "./src/db/migrations",

  dialect: "postgresql",

  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      "postgres://postgres:postgres@localhost:5432/app_db",
  },
})
