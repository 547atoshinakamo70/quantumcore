import React, { useState, useEffect } from 'react'

interface MinerStatus {
  status: 'up' | 'down'
  timestamp?: string
  hashrate?: number
  [key: string]: any
}

export default function MiningPanel() {
  const [status, setStatus] = useState<'loading' | 'up' | 'down'>('loading')
  const [data, setData] = useState<MinerStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkMinerStatus = async () => {
      try {
        setStatus('loading')
        setError(null)
        
        const apiUrl = import.meta.env.VITE_BLOCKCHAIN_API
        if (!apiUrl) {
          throw new Error('VITE_BLOCKCHAIN_API environment variable is not set')
        }

        const response = await fetch(`${apiUrl}/miner/status`)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const minerData: MinerStatus = await response.json()
        setData(minerData)
        setStatus(minerData.status === 'up' ? 'up' : 'down')
      } catch (err) {
        console.error('Failed to fetch miner status:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setStatus('down')
      }
    }

    // Check status immediately
    checkMinerStatus()

    // Set up periodic checking every 30 seconds
    const interval = setInterval(checkMinerStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    switch (status) {
      case 'loading': return 'text-yellow-400'
      case 'up': return 'text-green-400'
      case 'down': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'loading': return '⏳'
      case 'up': return '🟢'
      case 'down': return '🔴'
      default: return '⚪'
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-6">Mining Panel</h1>
        
        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-2xl">{getStatusIcon()}</span>
            <div>
              <h2 className="text-xl font-semibold text-white">Miner Status</h2>
              <p className={`text-lg font-medium ${getStatusColor()}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 mb-4">
              <p className="text-red-300 text-sm">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}

          {data && status !== 'loading' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {data.timestamp && (
                <div className="bg-gray-800 rounded p-3">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Last Updated</h3>
                  <p className="text-white">{new Date(data.timestamp).toLocaleString()}</p>
                </div>
              )}
              
              {data.hashrate && (
                <div className="bg-gray-800 rounded p-3">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Hashrate</h3>
                  <p className="text-white">{data.hashrate.toLocaleString()} H/s</p>
                </div>
              )}

              {/* Display any additional properties from the API response */}
              {Object.entries(data)
                .filter(([key]) => !['status', 'timestamp', 'hashrate'].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="bg-gray-800 rounded p-3">
                    <h3 className="text-sm font-medium text-gray-400 mb-1 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <p className="text-white">{String(value)}</p>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-300 mb-2">Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">API Endpoint:</span>
              <p className="text-white font-mono text-xs break-all">
                {import.meta.env.VITE_BLOCKCHAIN_API || 'Not configured'}
              </p>
            </div>
            <div>
              <span className="text-gray-400">WebSocket URL:</span>
              <p className="text-white font-mono text-xs break-all">
                {import.meta.env.VITE_WS_URL || 'Not configured'}
              </p>
            </div>
            <div>
              <span className="text-gray-400">Guard API:</span>
              <p className="text-white font-mono text-xs break-all">
                {import.meta.env.VITE_GUARD_API || 'Not configured'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}