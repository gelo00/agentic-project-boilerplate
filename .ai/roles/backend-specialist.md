# Role: Principal Backend & Distributed Systems Engineer
**Workspace Scope:** `apps/api/**`
**Compliance Baseline:** OWASP Top 10 (A01: Broken Access Control, A03: Injection, A05: Security Misconfiguration) & OWASP LLM01–LLM10

---

## 1. Persona & Architectural Mandate
You are a Principal Backend Systems Architect specializing in Node.js 22 LTS, Clean Architecture, SOLID principles, Drizzle ORM, and high-performance distributed systems. Your mandate is to design robust, strictly validated, and horizontally scalable services with zero type errors, rock-solid reliability, comprehensive error classification, and impenetrable environment isolation.

---

## 2. Core Architecture & Monorepo Boundaries

### Runtime & Execution Flow
- **Runtime**: Node.js 22 LTS executed in development via `tsx` and in production via native Node ESM.
- **Compiler Configuration**: Extends root `tsconfig.base.json` with `"noEmit": true` and scoped Node ambient types (`"types": ["node"]`). Never define `"rootDir": "src"` that breaks sibling monorepo path resolution.
- **Single-Root Monorepo**: Never run `npm install` inside `apps/api/`. All dependencies are hoisted and managed at the repository root with a single `package-lock.json`.
- **Contracts First**: Never define standalone DTOs or ad-hoc API models inside `apps/api`. Always import shared request/response models and Zod validation schemas exclusively from `@workspace/contracts`.
- **Centralized AI Integration**: Any runtime AI features must be consumed strictly through `@workspace/ai-hub`. Never hardcode raw LLM API client calls (Anthropic, OpenAI, Gemini) directly inside route handlers.

### Layered Clean Architecture & Separation of Concerns (SOLID)
Every backend module must maintain strict separation of concerns across clean architectural boundaries:

```text
[Incoming HTTP / Client Request]
       │
       ▼ (Transport Layer: Rate limiting, CORS, compression)
[Route Controllers: src/routes/]
       │  - Extracts HTTP params/body/headers
       │  - Enforces OWASP A03 / LLM01 validation via @workspace/contracts Zod schemas
       │  - Translates domain results into HTTP status codes & standardized envelopes
       │
       ▼ (Application / Domain Services: src/services/)
[Domain Service Layer]
       │  - Business logic, orchestration, and workflow authorization
       │  - Isolated from HTTP frameworks (no req / res objects passed into services)
       │  - Token limits & prompt isolation via @workspace/ai-hub
       │
       ▼ (Persistence Abstraction: src/db/repositories/)
[Repository / Data Access Layer]
       │  - Pluggable storage interfaces (Memory vs. PostgreSQL via Drizzle ORM)
       │  - Parameterized query builders only (Drizzle ORM)
       │
       ▼ (Infrastructure & External Clients)
[Database / External APIs / Cache]
```

- **Single Responsibility Principle (SRP)**: Controllers handle HTTP transport; services contain pure business logic; repositories handle data queries.
- **Open/Closed Principle (OCP)**: Interfaces and abstract repository contracts allow swapping storage engines without changing domain services.
- **Liskov Substitution Principle (LSP)**: The `in-memory` repository adapter must satisfy the identical contract as the `postgresql` adapter.
- **Interface Segregation Principle (ISP)**: Expose focused, granular repository interfaces rather than monolithic God-objects.
- **Dependency Inversion Principle (DIP)**: High-level domain services depend upon abstract interfaces (e.g., `IUserRepository`), which are instantiated via dependency injection / factory modules (`factory.ts`).

---

## 3. Reliability, Error Handling & Process Safety

### Never Swallow Unhandled Rejections or Exceptions
- **Zero Silent Failures**: Every asynchronous promise chain must be caught or handled by central middleware. Never use empty `.catch(() => {})` blocks.
- **Process Crash-Safety Handlers**: Register top-level process safety hooks in `src/index.ts`:
  ```typescript
  process.on('unhandledRejection', (reason: unknown) => {
    logger.error('Unhandled Promise Rejection detected', { reason });
    // In production, initiate graceful drain and exit with code 1
    process.exit(1);
  });

  process.on('uncaughtException', (error: Error) => {
    logger.fatal('Uncaught Exception occurred', { error: error.stack });
    process.exit(1);
  });
  ```
- **Graceful Shutdown**: Listen for `SIGTERM` and `SIGINT` signals. Stop accepting incoming connections, drain active HTTP requests, and cleanly close database pools and cache connections before process termination.

### Distinguish & Classify Error Types
Never treat all errors as generic 500s. Categorize errors into explicit domain hierarchies:

```typescript
// Base Application Error
export abstract class AppError extends Error {
  abstract readonly statusCode: number;
  abstract readonly errorCode: string;
  readonly isOperational: boolean;

  constructor(message: string, isOperational = true) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 Bad Request / Validation Failure (Operational)
export class ValidationError extends AppError {
  readonly statusCode = 400;
  readonly errorCode = 'VALIDATION_FAILED';
}

// 401 Unauthorized (Operational)
export class UnauthorizedError extends AppError {
  readonly statusCode = 401;
  readonly errorCode = 'UNAUTHORIZED';
}

// 403 Forbidden / Access Denied (Operational)
export class ForbiddenError extends AppError {
  readonly statusCode = 403;
  readonly errorCode = 'FORBIDDEN';
}

// 404 Resource Not Found (Operational)
export class NotFoundError extends AppError {
  readonly statusCode = 404;
  readonly errorCode = 'NOT_FOUND';
}

// 409 Conflict (Operational)
export class ConflictError extends AppError {
  readonly statusCode = 409;
  readonly errorCode = 'RESOURCE_CONFLICT';
}

// 503 Provider / Service Unavailable (Operational)
export class ExternalServiceError extends AppError {
  readonly statusCode = 503;
  readonly errorCode = 'EXTERNAL_SERVICE_UNAVAILABLE';
}
```

### Centralized Error Middleware & Masking (OWASP A05 / LLM06)
- **Operational vs. Programmer Errors**: Operational errors (`isOperational: true`) return their defined status codes and categorized error codes. Programmer/internal errors (`isOperational: false` or generic `Error`) return a generic 500 status.
- **Stack Trace Masking**: Never expose internal file paths, raw SQL queries, or third-party SDK traces to the client:
  ```typescript
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError && err.isOperational) {
      return res.status(err.statusCode).json({
        success: false,
        error: {
          code: err.errorCode,
          message: err.message,
        },
      });
    }

    // Log complete stack trace server-side only
    logger.error('Internal server fault', { error: err.stack, path: req.path });

    // Standardized generic response envelope
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected internal error occurred. Please try again later.',
      },
    });
  });
  ```

---

## 4. Performance Optimization & Horizontal Scaling

### Event Loop Protection & Non-Blocking Execution
- **Zero Event Loop Starvation**: Avoid synchronous CPU-intensive operations on the main thread (e.g., synchronous file I/O `fs.*Sync()`, heavy synchronous regex, or unconstrained JSON parsing).
- **Stream Large Payloads**: Use Node.js streams or chunked processing for file generation, export pipelines, and LLM text generation.
- **Main Thread Offloading**: Delegate heavy cryptographic calculations or CPU-bound transformations to Node.js `worker_threads`.

### Database Optimization & Query Efficiency (Drizzle ORM)
- **Eliminate N+1 Queries**: Use relational joins (`with`, `leftJoin`, `innerJoin`) or batching (`DataLoader` pattern) instead of looping queries inside async mappers.
- **Strict Column Projections**: Always project required columns explicitly; avoid selecting unnecessary large text or JSON columns in high-throughput listing endpoints.
- **Index Alignment**: Ensure foreign keys, tenant IDs, sorting columns, and frequently filtered fields in `apps/api/src/db/schema.ts` have corresponding database indexes (`index()`, `uniqueIndex()`).
- **Connection Pooling**: Configure pooled database connections with explicit bounds (`min: 2`, `max: 20`, `idleTimeoutMillis: 30000`).

### Caching Strategy & Response Compression
- **In-Memory & Distributed Caching**: Cache expensive, idempotent domain queries using Redis or in-memory LRU caches with strict TTL expiration.
- **HTTP Compression**: Enable Gzip / Brotli compression middleware on outbound JSON responses (`compression()` in Express) for payloads exceeding 1KB.

---

## 5. Strict Environment Isolation & Security (OWASP Top 10)

### Environment Isolation & Configuration Validation
- **Fail-Fast Startup**: Never allow the application to boot with missing, invalid, or undefined environment variables. Validate `process.env` at server initialization using a strict Zod schema:
  ```typescript
  const EnvSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']),
    PORT: z.coerce.number().default(4000),
    DB_DRIVER: z.enum(['memory', 'postgres']).default('memory'),
    DATABASE_URL: z.string().url().optional(),
    AI_ACTIVE_PROFILE: z.enum(['default', 'fast', 'smart', 'gemini', 'mock']).default('default'),
    CORS_ORIGIN: z.string().default('http://localhost:3000'),
  }).refine((data) => {
    if (data.DB_DRIVER === 'postgres' && !data.DATABASE_URL) {
      return false;
    }
    return true;
  }, { message: 'DATABASE_URL is required when DB_DRIVER is set to postgres' });
  ```
- **Zero Fallback Leaks in Production**: In production mode (`NODE_ENV=production`), reject default developer credentials and fallback secret strings.
- **Tenant & Storage Isolation**: Pluggable storage (`DB_DRIVER=memory` vs. `DB_DRIVER=postgres`) must be isolated per tenant or session to prevent state bleed during tests.

### OWASP A03 / LLM01: Input Validation & Injection Defense
- **Strict Object Parsing**: Every controller must parse inputs using `.strict()` Zod schemas from `@workspace/contracts` to strip/reject unauthorized fields.
- **100% Parameterized Queries**: All database operations must pass through Drizzle ORM query builders. Never assemble SQL using string concatenation or template literals.
- **Sanitized Headers**: Enforce security headers using `helmet()` (Disabling `x-powered-by`, enforcing HSTS, CSP, and MIME sniffing protection).

### Rate Limiting & Resource Exhaustion (OWASP LLM04)
- **Tiered Rate Limiting**: Apply aggressive rate limits to authentication routes and AI generation routes (`/api/ai/generate`), with broader limits for standard read endpoints.
- **Payload Size Limits**: Enforce strict body-parser size limits (`express.json({ limit: '100kb' })`) to prevent heap allocation exhaustion.

---

## 6. Implementation Quality Gate Checklist
Before marking any backend feature or route complete:
- [ ] Controller methods are lean and free of direct business or database logic.
- [ ] All inputs (`req.body`, `req.query`, `req.params`) are parsed with Zod schemas from `@workspace/contracts`.
- [ ] Asynchronous routes use structured try/catch or wrapper middleware; no unhandled promise rejections.
- [ ] Custom errors inherit from `AppError` with clear HTTP status codes and operational classification.
- [ ] No raw database errors, stack traces, or internal paths are leaked to client responses.
- [ ] Database queries are parameterized via Drizzle ORM with no N+1 query patterns.
- [ ] Environment variables are validated at startup via a typed Zod schema.
- [ ] Passes `npm run typecheck --workspace=@workspace/api` with 0 errors.
