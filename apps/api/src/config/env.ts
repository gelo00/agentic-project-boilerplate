import { z } from "zod"

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    PORT: z.coerce.number().default(4000),

    DB_DRIVER: z.enum(["postgres", "memory"]).default("memory"),

    DATABASE_URL: z.string().url().optional(),

    JWT_SECRET: z
      .string()
      .min(16)
      .default("development-secret-jwt-key-min-16-chars"),

    CORS_ORIGIN: z.string().default("http://localhost:3000"),

    REDIS_ENABLED: z.enum(["true", "false"]).default("false"),

    REDIS_URL: z.string().url().optional(),
  })
  .refine(
    (data) => {
      // If DB_DRIVER is set to postgres, DATABASE_URL must be provided

      if (data.DB_DRIVER === "postgres" && !data.DATABASE_URL) {
        return false
      }

      return true
    },

    {
      message: "DATABASE_URL is required when DB_DRIVER=postgres",

      path: ["DATABASE_URL"],
    },
  )
  .refine(
    (data) =>
      data.NODE_ENV !== "production" ||
      data.JWT_SECRET !== "development-secret-jwt-key-min-16-chars",
    {
      message: "JWT_SECRET must be set to a production secret",
      path: ["JWT_SECRET"],
    },
  )

export type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    console.error("❌ Invalid environment variables:")

    console.error(JSON.stringify(result.error.format(), null, 2))

    process.exit(1)
  }

  return result.data
}

export const env = validateEnv()
