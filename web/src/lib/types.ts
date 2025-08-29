export interface InterchainNetwork {
  id: string
  name: string
  symbol: string
  status: 'live' | 'stub' | 'maintenance' | 'error'
  balance?: string
  address?: string
  rpcUrl?: string
}

export interface InterchainBridge {
  id: string
  from: string
  to: string
  status: 'active' | 'inactive' | 'maintenance'
  fee: string
  estimatedTime: string
}

export interface InterchainTransaction {
  id: string
  from: InterchainNetwork
  to: InterchainNetwork
  amount: string
  status: 'pending' | 'completed' | 'failed'
  timestamp: number
  txHash?: string
}

export interface InterchainState {
  loading: boolean
  error: string | null
  networks: InterchainNetwork[]
  bridges: InterchainBridge[]
  transactions: InterchainTransaction[]
}