# QuantumCore Backend Service

A minimal Node.js + Express backend service to support the MiningPanel in the frontend.

## Features

- **Health endpoint**: `GET /healthz` - Returns service health status
- **Miner status endpoint**: `GET /miner/status` - Returns mining status data
- **CORS support**: Restricted to configured origin (default: GitHub Pages)
- **WebSocket support**: Real-time updates for future enhancements
- **Railway deployment ready**: Includes Dockerfile and environment configuration

## API Endpoints

### Health Check
```
GET /healthz
```
Returns: `{ "ok": true }`

### Miner Status
```
GET /miner/status
```
Returns:
```json
{
  "status": "ok",
  "hashRate": 631,
  "workers": 8,
  "ts": "2025-08-29T12:53:59.852Z",
  "uptime": 3675,
  "difficulty": "696387681902",
  "temperature": 72,
  "power": 928
}
```

## Environment Variables

- `PORT`: Server port (default: 3000)
- `ALLOWED_ORIGIN`: CORS allowed origin (default: https://547atoshinakamo70.github.io)

## Development

```bash
npm install
npm run dev
```

## Production Deployment

### Railway/Similar Platform
1. Deploy the backend directory
2. Set environment variables:
   - `ALLOWED_ORIGIN=https://547atoshinakamo70.github.io`
   - `PORT=3000` (or Railway assigned port)

### Docker
```bash
docker build -t quantumcore-backend .
docker run -p 3000:3000 -e ALLOWED_ORIGIN=https://547atoshinakamo70.github.io quantumcore-backend
```

## WebSocket Support

The service includes WebSocket support for real-time mining status updates. Clients can connect to the same port and receive periodic mining status updates every 5 seconds.
