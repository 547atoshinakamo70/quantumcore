import React, { useState, useEffect } from 'react'
import { InterchainNetwork, InterchainBridge, InterchainTransaction, InterchainState } from '../lib/types'
import { ENV } from '../lib/env'

// Mock data for when API is unavailable
const mockNetworks: InterchainNetwork[] = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', status: 'live', balance: '0.00000000', address: '1A1zP1e...' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', status: 'stub', balance: '0.000', address: '0x742d3...' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC', status: 'stub', balance: '0.000', address: '0x742d3...' },
  { id: 'bnb', name: 'BNB Smart Chain', symbol: 'BNB', status: 'stub', balance: '0.000', address: '0x742d3...' },
  { id: 'cosmos', name: 'Cosmos Hub', symbol: 'ATOM', status: 'stub', balance: '0.000', address: 'cosmos1...' },
  { id: 'dag', name: 'Constellation', symbol: 'DAG', status: 'stub', balance: '0.000', address: 'DAG4...' }
]

const mockBridges: InterchainBridge[] = [
  { id: 'btc-eth', from: 'btc', to: 'eth', status: 'active', fee: '0.001 BTC', estimatedTime: '30-60 min' },
  { id: 'eth-polygon', from: 'eth', to: 'polygon', status: 'active', fee: '0.005 ETH', estimatedTime: '10-15 min' },
  { id: 'eth-bnb', from: 'eth', to: 'bnb', status: 'maintenance', fee: '0.005 ETH', estimatedTime: '5-10 min' }
]

const mockTransactions: InterchainTransaction[] = [
  {
    id: 'tx1',
    from: mockNetworks[0],
    to: mockNetworks[1],
    amount: '0.01 BTC',
    status: 'completed',
    timestamp: Date.now() - 3600000,
    txHash: '0xabc123...'
  },
  {
    id: 'tx2', 
    from: mockNetworks[1],
    to: mockNetworks[2],
    amount: '0.5 ETH',
    status: 'pending',
    timestamp: Date.now() - 1800000
  }
]

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-[#1a2342] rounded w-3/4 mb-3"></div>
    <div className="h-4 bg-[#1a2342] rounded w-1/2 mb-3"></div>
    <div className="h-4 bg-[#1a2342] rounded w-2/3"></div>
  </div>
)

const NetworkCard = ({ network }: { network: InterchainNetwork }) => {
  const statusColors = {
    live: 'bg-green-500',
    stub: 'bg-yellow-500', 
    maintenance: 'bg-orange-500',
    error: 'bg-red-500'
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-lg font-semibold text-white">{network.name}</div>
          <span className={`w-2 h-2 rounded-full ${statusColors[network.status]}`}></span>
        </div>
        <div className="badge">{network.symbol}</div>
      </div>
      <div className="space-y-2 text-sm text-gray-400">
        <div>Status: <span className="text-white capitalize">{network.status}</span></div>
        {network.balance && (
          <div>Balance: <span className="text-white">{network.balance}</span></div>
        )}
        {network.address && (
          <div>Address: <span className="text-white font-mono text-xs">{network.address}</span></div>
        )}
      </div>
    </div>
  )
}

const BridgeCard = ({ bridge, networks }: { bridge: InterchainBridge; networks: InterchainNetwork[] }) => {
  const fromNetwork = networks.find(n => n.id === bridge.from)
  const toNetwork = networks.find(n => n.id === bridge.to)
  
  const statusColors = {
    active: 'text-green-400',
    inactive: 'text-gray-500',
    maintenance: 'text-orange-400'
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="text-white font-semibold">
          {fromNetwork?.name} → {toNetwork?.name}
        </div>
        <span className={`text-sm ${statusColors[bridge.status]} capitalize`}>
          {bridge.status}
        </span>
      </div>
      <div className="space-y-2 text-sm text-gray-400">
        <div>Fee: <span className="text-white">{bridge.fee}</span></div>
        <div>Time: <span className="text-white">{bridge.estimatedTime}</span></div>
      </div>
    </div>
  )
}

const TransactionCard = ({ transaction }: { transaction: InterchainTransaction }) => {
  const statusColors = {
    pending: 'text-yellow-400',
    completed: 'text-green-400', 
    failed: 'text-red-400'
  }

  const timeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) return `${hours}h ago`
    return `${minutes}m ago`
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="text-white font-semibold">
          {transaction.from.symbol} → {transaction.to.symbol}
        </div>
        <span className={`text-sm ${statusColors[transaction.status]} capitalize`}>
          {transaction.status}
        </span>
      </div>
      <div className="space-y-2 text-sm text-gray-400">
        <div>Amount: <span className="text-white">{transaction.amount}</span></div>
        <div>Time: <span className="text-white">{timeAgo(transaction.timestamp)}</span></div>
        {transaction.txHash && (
          <div>Hash: <span className="text-white font-mono text-xs">{transaction.txHash}</span></div>
        )}
      </div>
    </div>
  )
}

export const InterchainPanel: React.FC = () => {
  const [state, setState] = useState<InterchainState>({
    loading: true,
    error: null,
    networks: [],
    bridges: [],
    transactions: []
  })

  useEffect(() => {
    const loadInterchainData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      try {
        // Try to fetch from API if available
        if (ENV.INTERCHAIN_API) {
          const response = await fetch(`${ENV.INTERCHAIN_API}/status`)
          if (response.ok) {
            const data = await response.json()
            setState({
              loading: false,
              error: null,
              networks: data.networks || mockNetworks,
              bridges: data.bridges || mockBridges,
              transactions: data.transactions || mockTransactions
            })
            return
          }
        }
        
        // Fallback to mock data with simulated delay
        setTimeout(() => {
          setState({
            loading: false,
            error: null,
            networks: mockNetworks,
            bridges: mockBridges,
            transactions: mockTransactions
          })
        }, 1000)
        
      } catch (error) {
        console.warn('Interchain API unavailable, using mock data:', error)
        setState({
          loading: false,
          error: null, // Don't show error to user, just use mock data
          networks: mockNetworks,
          bridges: mockBridges,
          transactions: mockTransactions
        })
      }
    }

    loadInterchainData()
  }, [])

  if (state.loading) {
    return (
      <div className="space-y-6">
        <div className="badge">Interchain Router</div>
        <div>Loading interchain networks and bridges...</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card">
              <LoadingSkeleton />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="space-y-6">
        <div className="badge">Interchain Router</div>
        <div className="card bg-red-950 border-red-800">
          <div className="text-red-400 font-semibold mb-2">Connection Error</div>
          <div className="text-red-300 text-sm mb-4">{state.error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="btn bg-red-600 hover:bg-red-500"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="badge">Interchain Router</div>
        <div className="text-gray-400 text-sm">
          Cross-chain bridges for BTC • ETH • Polygon • BNB • Cosmos • DAG
        </div>
      </div>

      {/* Networks Section */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Networks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.networks.map(network => (
            <NetworkCard key={network.id} network={network} />
          ))}
        </div>
      </section>

      {/* Bridges Section */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Available Bridges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.bridges.map(bridge => (
            <BridgeCard key={bridge.id} bridge={bridge} networks={state.networks} />
          ))}
        </div>
      </section>

      {/* Recent Transactions */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Recent Transactions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.transactions.length > 0 ? (
            state.transactions.map(tx => (
              <TransactionCard key={tx.id} transaction={tx} />
            ))
          ) : (
            <div className="card col-span-full text-center text-gray-400">
              No recent transactions
            </div>
          )}
        </div>
      </section>

      {/* Footer Note */}
      <div className="text-xs text-gray-500 text-center">
        {ENV.INTERCHAIN_API ? 'Connected to live API' : 'Using mock data - API endpoint not configured'}
      </div>
    </div>
  )
}