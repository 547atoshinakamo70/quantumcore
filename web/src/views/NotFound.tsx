import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="space-y-4">
      <div className="badge">404 - Página no encontrada</div>
      <div className="card">
        <div className="text-[#a9b9ff] mb-4">La página que buscas no existe</div>
        <div className="text-[#93a3d6] mb-4">
          Puedes navegar a una de las secciones disponibles usando el menú lateral
          o regresar al dashboard.
        </div>
        <Link to="/" className="btn">
          Volver al Dashboard
        </Link>
      </div>
    </div>
  )
}