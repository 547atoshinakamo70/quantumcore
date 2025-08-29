# Production Safety Belt (Drop-in Kit)

Este paquete te permite ejecutar tu experimento **tal cual está**, pero con
controles mínimos de producción: contenedores reproducibles, proxy TLS con
rate limiting, health checks, CI, y plantillas de despliegue. **No incluye
bloqueo por país/geo-IP**; respeta tu enfoque de privacidad y fraud-detection
basado en TensorFlow/Keras.

## ¿Cómo integrar?
1. Copia las carpetas de este paquete en la raíz de tu repo (no sobrescribe tu código).
2. Revisa `proxy/default.conf` para ajustar CORS/CSP/ORIGIN.
3. Exporta variables de entorno según `app-snippets/env.ts` y `.env.example`.
4. Construye y prueba localmente con `compose/docker-compose.yml`.
5. Configura `REGISTRY` e `IMAGE_NAME` en `.github/workflows/ci.yml`.
6. Despliega en Kubernetes con el Helm chart de `k8s/helm/` (staging → prod).
7. Opcional: Ejecuta el **Relayer Guardian** como proxy para AA/RPC con límites y circuit breaker.

> Sugerencia: empieza por staging (idéntico a prod) y canary 1–5% antes de 100%.

## GitHub Pages Deploy & Mining Panel

### GitHub Actions Variables Setup
Para usar el despliegue automático en GitHub Pages y el panel de minería, configura estas variables en tu repositorio:

1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. En la pestaña **Variables**, añade:
   - `VITE_BLOCKCHAIN_API`: URL de tu API de blockchain (ej: `https://api-5470.up.railway.app`)
   - `VITE_WS_URL`: URL de WebSocket (ej: `wss://api-5470.up.railway.app`)  
   - `VITE_GUARD_API`: URL de la API guardian (ej: `https://guard-5470.up.railway.app`)

### Workflow Triggers
- **Push a main**: Despliega automáticamente a GitHub Pages
- **Manual**: Ve a Actions → "Deploy dApp (Auto) to GitHub Pages" → "Run workflow"

### Mining Panel Features
- **Ruta**: `/mining` - Muestra el estado del minero en tiempo real
- **Auto-refresh**: Verifica el estado cada 30 segundos
- **Estados**: Loading (🟡), Up (🟢), Down (🔴)
- **Endpoint**: Consulta `${VITE_BLOCKCHAIN_API}/miner/status`

### CSP Configuration
El CSP (Content Security Policy) está configurado para permitir conexiones a dominios de Railway ejemplo:
- `https://api-5470.up.railway.app`
- `wss://api-5470.up.railway.app`
- `https://guard-5470.up.railway.app`

Para usar tus propios dominios, edita el meta tag CSP en `web/index.html`.

### API Requirements
El endpoint `/miner/status` debe retornar JSON con este formato mínimo:
```json
{
  "status": "up",           // "up" o "down"
  "timestamp": "2025-01-20T10:00:00Z",  // opcional
  "hashrate": 1234567       // opcional
}
```

Propiedades adicionales en la respuesta se mostrarán automáticamente en el panel.
