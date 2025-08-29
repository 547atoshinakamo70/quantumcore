import React, { useState } from 'react'

export default function DAO(){
  const [proposals] = useState([
    { id: 12, title: 'Migrar a modelo QNN v2', status: 'Abierto', end: '2025-09-10', votes: 127 },
    { id: 11, title: 'Optimizar fees Interchain', status: 'Completado', end: '2025-08-02', votes: 89 },
    { id: 10, title: 'Nuevo algoritmo de consensus', status: 'En votación', end: '2025-10-15', votes: 45 },
  ])

  const handleVote = (proposalId: number, vote: 'yes' | 'no') => {
    alert(`Voto "${vote}" registrado para propuesta #${proposalId}`)
  }

  return (
    <div className='space-y-4'>
      <div className='badge'>DAO</div>
      <div className="card">
        <div className="text-[#a9b9ff] mb-4">Propuestas, votos y quorum. Conecta tu backend/contratos para activar.</div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1b2340]">
                <th className="text-left text-[#a9b9ff] p-2">ID</th>
                <th className="text-left text-[#a9b9ff] p-2">Título</th>
                <th className="text-left text-[#a9b9ff] p-2">Estado</th>
                <th className="text-left text-[#a9b9ff] p-2">Fin votación</th>
                <th className="text-left text-[#a9b9ff] p-2">Votos</th>
                <th className="text-left text-[#a9b9ff] p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map(proposal => (
                <tr key={proposal.id} className="border-b border-[#1b2340]">
                  <td className="p-2 text-[#dce6ff]">#{proposal.id}</td>
                  <td className="p-2 text-[#dce6ff]">{proposal.title}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      proposal.status === 'Abierto' ? 'bg-green-600 text-white' :
                      proposal.status === 'Completado' ? 'bg-blue-600 text-white' :
                      'bg-yellow-600 text-white'
                    }`}>
                      {proposal.status}
                    </span>
                  </td>
                  <td className="p-2 text-[#93a3d6]">{proposal.end}</td>
                  <td className="p-2 text-[#dce6ff]">{proposal.votes}</td>
                  <td className="p-2">
                    {proposal.status !== 'Completado' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleVote(proposal.id, 'yes')}
                          className="btn bg-green-600 hover:bg-green-500 px-2 py-1 text-xs"
                        >
                          Sí
                        </button>
                        <button 
                          onClick={() => handleVote(proposal.id, 'no')}
                          className="btn bg-red-600 hover:bg-red-500 px-2 py-1 text-xs"
                        >
                          No
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
