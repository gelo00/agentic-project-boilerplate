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
  
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: true,
        message: 'Node.js 22 LTS API Service is active',
        endpoints: {
          health: '/api/health',
        },
        frontendUrl: 'http://localhost:3000',
      })
    );
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } }));
});

server.listen(PORT, () => {
  console.log(`API Server running at http://localhost:${PORT}`);
});