// apps/api/src/server.ts
import http from 'node:http';
import { getUserRepository } from './db/factory';
import { ApiResponse } from '@workspace/contracts';

const PORT = Number(process.env.PORT) || 4000;
const userRepo = getUserRepository();

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/api/health' && req.method === 'GET') {
    const response: ApiResponse<{ status: string }> = {
      success: true,
      data: { status: 'healthy' },
    };
    res.writeHead(200);
    return res.end(JSON.stringify(response));
  }

  if (req.url === '/api/users' && req.method === 'GET') {
    try {
      const testUser = await userRepo.findByEmail('test@example.com');
      const response: ApiResponse<typeof testUser> = {
        success: true,
        data: testUser,
      };
      res.writeHead(200);
      return res.end(JSON.stringify(response));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Internal Server Error';
      const errorResponse: ApiResponse<never> = {
        success: false,
        error: { code: 'SERVER_ERROR', message },
      };
      res.writeHead(500);
      return res.end(JSON.stringify(errorResponse));
    }
  }

  res.writeHead(404);
  res.end(JSON.stringify({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } }));
});

server.listen(PORT, () => {
  console.log(`API Server running at http://localhost:${PORT}`);
});