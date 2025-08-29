import React, { useState } from 'react'

export default function Vaults(){
  const [vaults] = useState([
    { id: 1, name: 'BTC Mining Pool', type: 'Mining', balance: '2.15 BTC', apy: '4.2%', status: 'active' },
    { id: 2, name: 'ETH Staking', type: 'Staking', balance: '50.8 ETH', apy: '5.8%', status: 'active' },
    { id: 3, name: 'DeFi Yield', type: 'Yield', balance: '10,500 DAI', apy: '8.1%', status: 'paused' },
    { id: 4, name: 'LP Farming', type: 'Liquidity', balance: '25.3 LP', apy: '12.4%', status: 'active' },
  ])

  const [selectedVault, setSelectedVault] = useState<number | null>(null)
  const [depositAmount, setDepositAmount] = useState('')

  const handleVaultAction = (vaultId: number, action: string) => {
    if (action === 'deposit' && !depositAmount) {
      alert('Introduce una cantidad para depositar')
      return
    }
    alert(`Acción "${action}" en vault #${vaultId}${depositAmount ? ` - Cantidad: ${depositAmount}` : ''}`)
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-600 text-white'
      case 'paused': return 'bg-yellow-600 text-white'
      case 'stopped': return 'bg-red-600 text-white'
      default: return 'bg-gray-600 text-white'
    }
  }

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Mining': return 'text-orange-400 border-orange-400'
      case 'Staking': return 'text-blue-400 border-blue-400'
      case 'Yield': return 'text-green-400 border-green-400'
      case 'Liquidity': return 'text-purple-400 border-purple-400'
      default: return 'text-gray-400 border-gray-400'
    }
  }

  return (
    <div className='space-y-4'>
      <div className='badge'>Vaults & Minería</div>
      <div className="card">
        <div className="text-[#a9b9ff] mb-4">Gestión de vaults de minería, staking y yield farming.</div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#0f1426] border border-[#1b2340] rounded-lg p-3 text-center">
            <div className="text-[#cfe1ff] text-sm">Total Vaults</div>
            <div className="text-xl font-bold text-[#dce6ff]">{vaults.length}</div>
          </div>
          <div className="bg-[#0f1426] border border-[#1b2340] rounded-lg p-3 text-center">
            <div className="text-[#cfe1ff] text-sm">Activos</div>
            <div className="text-xl font-bold text-green-400">
              {vaults.filter(v => v.status === 'active').length}
            </div>
          </div>
          <div className="bg-[#0f1426] border border-[#1b2340] rounded-lg p-3 text-center">
            <div className="text-[#cfe1ff] text-sm">APY Promedio</div>
            <div className="text-xl font-bold text-[#dce6ff]">7.6%</div>
          </div>
          <div className="bg-[#0f1426] border border-[#1b2340] rounded-lg p-3 text-center">
            <div className="text-[#cfe1ff] text-sm">Hashrate</div>
            <div className="text-xl font-bold text-[#dce6ff]">2.5 TH/s</div>
          </div>
        </div>

        {/* Vaults Grid */}
        <div className="space-y-4">
          {vaults.map(vault => (
            <div 
              key={vault.id} 
              className={`bg-[#0f1426] border rounded-lg p-4 cursor-pointer transition-all ${
                selectedVault === vault.id 
                  ? 'border-blue-500 bg-[#1a2342]' 
                  : 'border-[#1b2340] hover:border-[#2a3454]'
              }`}
              onClick={() => setSelectedVault(vault.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="font-medium text-[#dce6ff]">{vault.name}</div>
                  <span className={`px-2 py-1 rounded border text-xs ${getTypeColor(vault.type)}`}>
                    {vault.type}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(vault.status)}`}>
                  {vault.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <div className="text-[#a6b6e6]">Balance</div>
                  <div className="text-[#dce6ff] font-medium">{vault.balance}</div>
                </div>
                <div>
                  <div className="text-[#a6b6e6]">APY</div>
                  <div className="text-green-400 font-medium">{vault.apy}</div>
                </div>
                <div>
                  <div className="text-[#a6b6e6]">Estado</div>
                  <div className="text-[#dce6ff] capitalize">{vault.status}</div>
                </div>
              </div>
              
              {selectedVault === vault.id && (
                <div className="border-t border-[#1b2340] pt-4 space-y-3">
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Cantidad a depositar"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="input flex-1"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleVaultAction(vault.id, 'deposit')
                      }}
                      className="btn bg-green-600 hover:bg-green-500"
                    >
                      Depositar
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleVaultAction(vault.id, 'withdraw')
                      }}
                      className="btn bg-red-600 hover:bg-red-500"
                    >
                      Retirar
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleVaultAction(vault.id, 'claim')
                      }}
                      className="btn bg-blue-600 hover:bg-blue-500"
                    >
                      Reclamar Rewards
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
