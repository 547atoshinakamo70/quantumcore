import React, { useState, useEffect } from 'react'

export default function Market(){
  const [signals, setSignals] = useState([
    { id: 1, title: 'Inicializando', description: 'Conecta fuentes externas (GTrends, GitHub PRs, tickets)', status: 'warning' },
  ])

  const mockSignals = [
    { title: 'BTC Trend Alert', description: 'Búsquedas de "Bitcoin" +15% último día', status: 'success' },
    { title: 'GitHub Activity', description: 'Nuevo PR en ethereum/go-ethereum', status: 'info' },
    { title: 'Support Ticket', description: 'Incremento de tickets relacionados con fees', status: 'warning' },
    { title: 'Market Sentiment', description: 'Sentiment score: 0.72 (positivo)', status: 'success' },
    { title: 'Whale Movement', description: 'Transfer de 1,000 BTC detectado', status: 'warning' },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      const randomSignal = mockSignals[Math.floor(Math.random() * mockSignals.length)]
      const newSignal = {
        id: Date.now(),
        ...randomSignal
      }
      
      setSignals(prev => [newSignal, ...prev].slice(0, 10)) // Keep only last 10
    }, 3000) // Add new signal every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'success': return 'bg-green-500 shadow-green-500/50'
      case 'warning': return 'bg-yellow-500 shadow-yellow-500/50'
      case 'info': return 'bg-blue-500 shadow-blue-500/50'
      default: return 'bg-gray-500 shadow-gray-500/50'
    }
  }

  return (
    <div className='space-y-4'>
      <div className='badge'>Market Sentinel</div>
      <div className="card">
        <div className="text-[#a9b9ff] mb-4">Feed de tendencias, PRs, costes y frustración de usuarios (conecta tus fuentes).</div>
        
        <div className="space-y-3">
          {signals.map(signal => (
            <div key={signal.id} className="flex items-center gap-3 bg-[#0f1426] border border-[#1b2340] rounded-lg p-3">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(signal.status)} shadow-lg`}></div>
              <div className="flex-1">
                <div className="text-[#eaf1ff] font-medium">{signal.title}</div>
                <div className="text-[#a6b6e6] text-sm">{signal.description}</div>
              </div>
              <div className="text-xs text-[#93a3d6]">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
