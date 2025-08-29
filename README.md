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

## UI Migration

La interfaz de usuario ha sido migrada completamente a React (Vite). El acceso principal es ahora a través de `web/dist/index.html`, mientras que la UI legacy vanilla JS se mantiene disponible en `legacy-ui/` para referencias.

### Acceso a las interfaces:
- **Nueva interfaz React** (recomendada): `./web/dist/index.html#/`
- **UI Legacy**: `./legacy-ui/index.html`

### Desarrollo:
```bash
cd web
npm install
npm run dev    # Desarrollo
npm run build  # Construcción para producción
```

La nueva interfaz incluye componentes React mejorados para todas las secciones (Dashboard, Wallet, DAO, Market, Models, Subscriptions, NFTs, CoinJoin, Vaults, Settings) con funcionalidad interactiva de demostración.
