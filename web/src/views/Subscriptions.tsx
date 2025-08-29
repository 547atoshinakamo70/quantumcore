import React, { useState } from 'react'

export default function Subscriptions(){
  const [subscriptions] = useState([
    { id: 1, name: 'Premium Analytics', price: '50 DAI/mes', status: 'active', nextPayment: '2025-02-15' },
    { id: 2, name: 'Advanced Trading', price: '100 USDC/mes', status: 'active', nextPayment: '2025-02-20' },
    { id: 3, name: 'Market Data Pro', price: '25 DAI/mes', status: 'paused', nextPayment: '—' },
  ])

  const handleSubscriptionAction = (id: number, action: string) => {
    alert(`Acción "${action}" en suscripción #${id}`)
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-600 text-white'
      case 'paused': return 'bg-yellow-600 text-white'
      case 'expired': return 'bg-red-600 text-white'
      default: return 'bg-gray-600 text-white'
    }
  }

  return (
    <div className='space-y-4'>
      <div className='badge'>Subscriptions</div>
      <div className="card">
        <div className="text-[#a9b9ff] mb-4">Conecta contratos para pagos recurrentes (scripts/subscriptions).</div>
        
        <div className="space-y-4">
          {subscriptions.map(sub => (
            <div key={sub.id} className="bg-[#0f1426] border border-[#1b2340] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium text-[#dce6ff]">{sub.name}</div>
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(sub.status)}`}>
                  {sub.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <div className="text-[#a6b6e6]">Precio</div>
                  <div className="text-[#dce6ff]">{sub.price}</div>
                </div>
                <div>
                  <div className="text-[#a6b6e6]">Próximo pago</div>
                  <div className="text-[#dce6ff]">{sub.nextPayment}</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                {sub.status === 'active' ? (
                  <button 
                    onClick={() => handleSubscriptionAction(sub.id, 'pause')}
                    className="btn bg-yellow-600 hover:bg-yellow-500 px-3 py-1 text-sm"
                  >
                    Pausar
                  </button>
                ) : (
                  <button 
                    onClick={() => handleSubscriptionAction(sub.id, 'resume')}
                    className="btn bg-green-600 hover:bg-green-500 px-3 py-1 text-sm"
                  >
                    Reanudar
                  </button>
                )}
                <button 
                  onClick={() => handleSubscriptionAction(sub.id, 'cancel')}
                  className="btn bg-red-600 hover:bg-red-500 px-3 py-1 text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ))}
          
          <div className="border-t border-[#1b2340] pt-4">
            <button className="btn w-full">+ Nueva Suscripción</button>
          </div>
        </div>
      </div>
    </div>
  )
}
