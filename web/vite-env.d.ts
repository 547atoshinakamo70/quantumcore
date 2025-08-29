/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHOW_BUILD_INFO?: string
  readonly VITE_ETH_RPC?: string
  readonly VITE_POLYGON_RPC?: string
  readonly VITE_BNB_RPC?: string
  readonly VITE_COSMOS_RPC?: string
  readonly VITE_COSMOS_CHAIN_ID?: string
  readonly VITE_COSMOS_DENOM?: string
  readonly VITE_BTC_API?: string
  readonly VITE_DAG_NODE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}