import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://547atoshinakamo70.github.io';

// CORS configuration
app.use(cors({
  origin: ALLOWED_ORIGIN,
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Health endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({ ok: true });
});

// Miner status endpoint
app.get('/miner/status', (req, res) => {
  const currentTime = new Date().toISOString();
  
  // Mock mining status data - in a real implementation this would come from actual mining hardware/software
  const status = {
    status: 'ok',
    hashRate: Math.floor(Math.random() * 1000) + 500, // Mock hash rate in MH/s
    workers: Math.floor(Math.random() * 8) + 1, // Mock number of workers
    ts: currentTime,
    uptime: Math.floor(Math.random() * 86400), // Mock uptime in seconds
    difficulty: (Math.random() * 1e12).toFixed(0), // Mock difficulty
    temperature: Math.floor(Math.random() * 20) + 60, // Mock temperature in Celsius
    power: Math.floor(Math.random() * 200) + 800 // Mock power consumption in watts
  };
  
  res.status(200).json(status);
});

// Create HTTP server
const server = createServer(app);

// WebSocket server for future real-time updates
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  // Send initial mining status
  ws.send(JSON.stringify({
    type: 'mining_status',
    data: {
      status: 'ok',
      hashRate: Math.floor(Math.random() * 1000) + 500,
      workers: Math.floor(Math.random() * 8) + 1,
      ts: new Date().toISOString()
    }
  }));
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Optional: Send periodic updates to connected WebSocket clients
setInterval(() => {
  if (wss.clients.size > 0) {
    const statusUpdate = {
      type: 'mining_status',
      data: {
        status: 'ok',
        hashRate: Math.floor(Math.random() * 1000) + 500,
        workers: Math.floor(Math.random() * 8) + 1,
        ts: new Date().toISOString()
      }
    };
    
    wss.clients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(JSON.stringify(statusUpdate));
      }
    });
  }
}, 5000); // Update every 5 seconds

server.listen(PORT, () => {
  console.log(`QuantumCore Backend Service running on port ${PORT}`);
  console.log(`CORS allowed origin: ${ALLOWED_ORIGIN}`);
  console.log(`WebSocket server enabled for real-time updates`);
});