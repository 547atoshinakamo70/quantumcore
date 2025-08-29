import React, { useState } from 'react'

export default function NFTs(){
  const [badges] = useState([
    { id: 1, name: 'Quantum Pioneer', rarity: 'Legendary', yield: '5.2% APY', holders: 12 },
    { id: 2, name: 'DeFi Expert', rarity: 'Epic', yield: '3.8% APY', holders: 45 },
    { id: 3, name: 'Trading Master', rarity: 'Rare', yield: '2.1% APY', holders: 156 },
    { id: 4, name: 'Node Operator', rarity: 'Common', yield: '1.5% APY', holders: 289 },
  ])

  const [mintAmount, setMintAmount] = useState(1)

  const handleMint = (badgeId: number) => {
    alert(`Minting ${mintAmount}x badge #${badgeId} - Conecta tu contrato para ejecutar`)
  }

  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'Legendary': return 'text-yellow-400 border-yellow-400'
      case 'Epic': return 'text-purple-400 border-purple-400'
      case 'Rare': return 'text-blue-400 border-blue-400'
      case 'Common': return 'text-gray-400 border-gray-400'
      default: return 'text-gray-400 border-gray-400'
    }
  }

  return (
    <div className='space-y-4'>
      <div className='badge'>NFTs</div>
      <div className="card">
        <div className="text-[#a9b9ff] mb-4">Quantum Badges (funcionales). Conecta contrato para listar y mintear.</div>
        
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-[#0f1426] border border-[#1b2340] rounded-lg p-3 text-center">
            <div className="text-[#cfe1ff] font-bold">Badges activos</div>
            <div className="text-2xl font-bold text-[#dce6ff]">{badges.length}</div>
          </div>
          <div className="bg-[#0f1426] border border-[#1b2340] rounded-lg p-3 text-center">
            <div className="text-[#cfe1ff] font-bold">Yield promedio</div>
            <div className="text-2xl font-bold text-[#dce6ff]">3.1%</div>
          </div>
          <div className="bg-[#0f1426] border border-[#1b2340] rounded-lg p-3 text-center">
            <div className="text-[#cfe1ff] font-bold">Total Holders</div>
            <div className="text-2xl font-bold text-[#dce6ff]">
              {badges.reduce((acc, badge) => acc + badge.holders, 0)}
            </div>
          </div>
          <div className="bg-[#0f1426] border border-[#1b2340] rounded-lg p-3 text-center">
            <div className="text-[#cfe1ff] font-bold">Royalties</div>
            <div className="text-2xl font-bold text-[#dce6ff]">2.5%</div>
          </div>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {badges.map(badge => (
            <div key={badge.id} className="bg-[#0f1426] border border-[#1b2340] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium text-[#dce6ff]">{badge.name}</div>
                <span className={`px-2 py-1 rounded border text-xs ${getRarityColor(badge.rarity)}`}>
                  {badge.rarity}
                </span>
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-[#a6b6e6]">Yield:</span>
                  <span className="text-[#dce6ff]">{badge.yield}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a6b6e6]">Holders:</span>
                  <span className="text-[#dce6ff]">{badge.holders}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  value={mintAmount}
                  onChange={(e) => setMintAmount(parseInt(e.target.value))}
                  className="input w-16 text-center"
                />
                <button 
                  onClick={() => handleMint(badge.id)}
                  className="btn bg-blue-600 hover:bg-blue-500 flex-1"
                >
                  Mint
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
