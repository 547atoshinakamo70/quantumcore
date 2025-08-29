import React, { useState } from 'react'

export default function CoinJoin(){
  const [mixConfig, setMixConfig] = useState({
    amount: '',
    denomination: '0.1',
    rounds: 3,
  })
  
  const [mixingStatus, setMixingStatus] = useState<'idle' | 'mixing' | 'complete'>('idle')
  const [progress, setProgress] = useState(0)

  const handleStartMix = () => {
    if (!mixConfig.amount) {
      alert('Introduce una cantidad para mezclar')
      return
    }
    
    setMixingStatus('mixing')
    setProgress(0)
    
    // Simulate mixing progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setMixingStatus('complete')
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const denominations = ['0.01', '0.1', '1.0', '10.0']

  return (
    <div className='space-y-4'>
      <div className='badge'>CoinJoin</div>
      <div className="card">
        <div className="text-[#a9b9ff] mb-4">UI de mezcla UTXO (requiere coordinador externo).</div>
        
        <div className="space-y-4">
          {/* Mix Configuration */}
          <div className="bg-[#0f1426] border border-[#1b2340] rounded-lg p-4">
            <h3 className="text-[#dce6ff] font-medium mb-3">Configuración de Mezcla</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#a6b6e6] text-sm mb-1">Cantidad (BTC)</label>
                <input 
                  type="number" 
                  step="0.001"
                  value={mixConfig.amount}
                  onChange={(e) => setMixConfig({...mixConfig, amount: e.target.value})}
                  className="input w-full"
                  placeholder="0.0"
                />
              </div>
              
              <div>
                <label className="block text-[#a6b6e6] text-sm mb-1">Denominación</label>
                <select 
                  value={mixConfig.denomination}
                  onChange={(e) => setMixConfig({...mixConfig, denomination: e.target.value})}
                  className="input w-full"
                >
                  {denominations.map(denom => (
                    <option key={denom} value={denom}>{denom} BTC</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-[#a6b6e6] text-sm mb-1">Rondas</label>
                <input 
                  type="number" 
                  min="1" 
                  max="10"
                  value={mixConfig.rounds}
                  onChange={(e) => setMixConfig({...mixConfig, rounds: parseInt(e.target.value)})}
                  className="input w-full"
                />
              </div>
            </div>
          </div>

          {/* Mixing Status */}
          {mixingStatus !== 'idle' && (
            <div className="bg-[#0f1426] border border-[#1b2340] rounded-lg p-4">
              <h3 className="text-[#dce6ff] font-medium mb-3">Estado de Mezcla</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#a6b6e6]">Progreso:</span>
                  <span className="text-[#dce6ff]">{progress}%</span>
                </div>
                
                <div className="w-full bg-[#1b2340] rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                
                <div className="text-center text-sm text-[#a6b6e6]">
                  {mixingStatus === 'mixing' 
                    ? `Mezclando... Ronda ${Math.floor(progress / 33) + 1} de ${mixConfig.rounds}`
                    : 'Mezcla completada ✓'
                  }
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button 
              onClick={handleStartMix}
              disabled={mixingStatus === 'mixing'}
              className="btn bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
            >
              {mixingStatus === 'mixing' ? 'Mezclando...' : 'Iniciar Mezcla'}
            </button>
            
            <button 
              onClick={() => {
                setMixingStatus('idle')
                setProgress(0)
              }}
              className="btn bg-gray-600 hover:bg-gray-500"
            >
              Reset
            </button>
          </div>

          {/* Privacy Info */}
          <div className="text-xs text-[#93a3d6] bg-[#0f1426] border border-[#1b2340] rounded p-3">
            <strong>Nota:</strong> Esta es una demo. Para usar CoinJoin real, conecta un coordinador 
            como Wasabi Wallet o JoinMarket.
          </div>
        </div>
      </div>
    </div>
  )
}
