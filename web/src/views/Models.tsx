import React, { useState } from 'react'

export default function Models(){
  const [models] = useState([
    { id: 'qnn-001', name: 'Price Predictor v2', accuracy: 0.87, status: 'running', lastUpdate: '2min ago' },
    { id: 'qnn-002', name: 'Sentiment Analyzer', accuracy: 0.92, status: 'training', lastUpdate: '15min ago' },
    { id: 'qnn-003', name: 'Risk Assessment', accuracy: 0.78, status: 'stopped', lastUpdate: '1h ago' },
    { id: 'qnn-004', name: 'Volume Predictor', accuracy: 0.83, status: 'running', lastUpdate: '5min ago' },
  ])
  
  const [selectedModel, setSelectedModel] = useState<string | null>(null)

  const handleModelAction = (modelId: string, action: string) => {
    alert(`Acción "${action}" ejecutada en modelo ${modelId}`)
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'running': return 'bg-green-500'
      case 'training': return 'bg-yellow-500'
      case 'stopped': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className='space-y-4'>
      <div className='badge'>Model Lab</div>
      <div className="card">
        <div className="text-[#a9b9ff] mb-4">32 QNNs con métricas y experimentos (conecta scripts/qnn).</div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {models.map(model => (
            <div 
              key={model.id} 
              className={`bg-[#0f1426] border rounded-lg p-4 cursor-pointer transition-all ${
                selectedModel === model.id 
                  ? 'border-blue-500 bg-[#1a2342]' 
                  : 'border-[#1b2340] hover:border-[#2a3454]'
              }`}
              onClick={() => setSelectedModel(model.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium text-[#dce6ff]">{model.name}</div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(model.status)}`}></div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#a6b6e6]">Precisión:</span>
                  <span className="text-[#dce6ff]">{(model.accuracy * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a6b6e6]">Estado:</span>
                  <span className="text-[#dce6ff] capitalize">{model.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a6b6e6]">Actualizado:</span>
                  <span className="text-[#93a3d6]">{model.lastUpdate}</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    handleModelAction(model.id, 'start')
                  }}
                  className="btn bg-green-600 hover:bg-green-500 px-2 py-1 text-xs"
                  disabled={model.status === 'running'}
                >
                  Start
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    handleModelAction(model.id, 'stop')
                  }}
                  className="btn bg-red-600 hover:bg-red-500 px-2 py-1 text-xs"
                  disabled={model.status === 'stopped'}
                >
                  Stop
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    handleModelAction(model.id, 'retrain')
                  }}
                  className="btn px-2 py-1 text-xs"
                >
                  Retrain
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
