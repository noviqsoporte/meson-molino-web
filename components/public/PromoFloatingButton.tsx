'use client'

import { useState, useEffect } from 'react'
import { Promocion } from '@/lib/types'
import { Megaphone, X } from 'lucide-react'

interface PromoFloatingButtonProps {
  promociones: Promocion[]
}

export default function PromoFloatingButton({ promociones }: PromoFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)

  // Auto-open on first visit after 3 seconds
  useEffect(() => {
    if (promociones.length > 0 && !hasOpened) {
      const timer = setTimeout(() => {
        setIsOpen(true)
        setHasOpened(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [promociones, hasOpened])

  if (!promociones || promociones.length === 0) return null

  // Mostrar solo la primera promoción (o puedes rotarlas)
  const promo = promociones[0]

  return (
    <>
      {/* Botón flotante - Esquina inferior izquierda */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 bg-[var(--color-acento)] text-white rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.25)] hover:scale-110 transition-all duration-300 ease-in-out relative ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
          title="Ver Promociones"
        >
          <Megaphone className="w-7 h-7" />
          {/* Indicador de notificación */}
          {!hasOpened && (
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
          )}
        </button>
      </div>

      {/* Popup de la Promoción */}
      <div 
        className={`fixed bottom-6 left-6 z-50 w-[90vw] max-w-[360px] bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 origin-bottom-left ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 rounded-full p-1.5 shadow-sm transition-all z-10"
        >
          <X size={18} />
        </button>

        {promo.foto_url && (
          <div className="relative w-full h-48 sm:h-56">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={promo.foto_url} 
              alt={promo.titulo}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          <h3 className="text-xl font-playfair font-bold text-[var(--color-primario)] mb-2">
            {promo.titulo}
          </h3>
          {promo.descripcion && (
            <p className="text-sm font-inter text-[#5C5C5C] mb-4 whitespace-pre-wrap">
              {promo.descripcion}
            </p>
          )}
          
          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-2.5 bg-[var(--color-primario)] hover:bg-[var(--color-acento)] text-white font-inter font-medium rounded-lg transition-colors"
          >
            ¡Entendido!
          </button>
        </div>
      </div>
    </>
  )
}
