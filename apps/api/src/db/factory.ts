import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { IUserRepository } from "../modules/users/user.repository"
import { PostgresUserRepository } from "./adapters/postgres.user.repo"
import { InMemoryUserRepository } from "./adapters/memory.user.repo"

let memoryRepo: InMemoryUserRepository | null = null
let pgPool: Pool | null = null

export async function closeUserRepository(): Promise<void> {
  if (pgPool) {
    await pgPool.end()
    pgPool = null
  }
}

export function getUserRepository(): IUserRepository {
  const driver = (
    process.env.DB_DRIVER || (process.env.DATABASE_URL ? "postgres" : "memory")
  ).toLowerCase()

  // 1. In-Memory Option (zero dependencies, offline)
  if (driver === "memory") {
    if (!memoryRepo) {
      console.log("⚡ Using In-Memory Repository Adapter")
      memoryRepo = new InMemoryUserRepository()
    }
    return memoryRepo
  }

  // 2. PostgreSQL Option (Docker, Local Service, or Cloud)
  if (driver === "postgres") {
    if (!process.env.DATABASE_URL) {
      console.warn("⚠️ DATABASE_URL missing. Falling back to In-Memory store.")
      if (!memoryRepo) memoryRepo = new InMemoryUserRepository()
      return memoryRepo
    }

    if (!pgPool) {
      const isCloud =
        process.env.DATABASE_URL.includes("sslmode=require") ||
        process.env.NODE_ENV === "production"

      pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: isCloud ? { rejectUnauthorized: false } : undefined,
      })

      console.log("🐘 Connected to PostgreSQL via Drizzle ORM")
    }

    return new PostgresUserRepository(drizzle(pgPool))
  }

  throw new Error(`Unsupported DB_DRIVER: ${driver}`)
}
