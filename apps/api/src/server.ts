import cors from "cors"

import express, { ErrorRequestHandler, RequestHandler } from "express"

import rateLimit from "express-rate-limit"

import { ApiResponse } from "@workspace/contracts"

import { closeCacheService, getCacheService } from "./cache/factory.js"

import { env } from "./config/env.js"

import { closeUserRepository } from "./db/factory.js"

interface LiveHealthData {
  status: string
  uptimeSeconds: number
}

interface ReadyHealthData {
  status: string
  cache: boolean
}

const app = express()

app.disable("x-powered-by")

app.use(express.json({ limit: "1mb" }))

app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,

    limit: 100,

    standardHeaders: "draft-7",

    legacyHeaders: false,
  }),
)

const requestLogger: RequestHandler = (req, _res, next) => {
  console.log(`${req.method} ${req.originalUrl}`)

  next()
}

app.use(requestLogger)

app.get("/", (_req, res) => {
  const response: ApiResponse = {
    success: true,

    data: {
      message: "Node.js 22 LTS API Service is active",

      endpoints: {
        health: "/api/health",

        live: "/api/health/live",

        ready: "/api/health/ready",
      },
    },
  }

  res.json(response)
})

app.get("/api/health", (_req, res) => {
  const response: ApiResponse<{ status: string }> = {
    success: true,

    data: { status: "healthy" },
  }

  res.json(response)
})

app.get("/api/health/live", (_req, res) => {
  const response: ApiResponse<LiveHealthData> = {
    success: true,

    data: { status: "alive", uptimeSeconds: Math.floor(process.uptime()) },
  }

  res.json(response)
})

app.get("/api/health/ready", async (_req, res) => {
  const cacheHealthy = await getCacheService().isHealthy()

  const response: ApiResponse<ReadyHealthData> = {
    success: cacheHealthy,

    data: { status: cacheHealthy ? "ready" : "degraded", cache: cacheHealthy },
  }

  res.status(cacheHealthy ? 200 : 503).json(response)
})

app.use((_req, res) => {
  const response: ApiResponse = {
    success: false,

    error: { code: "NOT_FOUND", message: "Route not found" },
  }

  res.status(404).json(response)
})

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error)

  const response: ApiResponse = {
    success: false,

    error: { code: "INTERNAL_ERROR", message: "Internal server error" },
  }

  res.status(500).json(response)
}

app.use(errorHandler)

const server = app.listen(env.PORT, () => {
  console.log(`API Server running at http://localhost:${env.PORT}`)
})

async function shutdown(signal: string): Promise<void> {
  console.log(`Received ${signal}; shutting down`)

  server.close(async () => {
    await Promise.all([closeCacheService(), closeUserRepository()])

    process.exit(0)
  })

  setTimeout(() => process.exit(1), 10_000).unref()
}

process.once("SIGINT", () => void shutdown("SIGINT"))

process.once("SIGTERM", () => void shutdown("SIGTERM"))
