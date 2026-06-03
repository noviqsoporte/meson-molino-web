'use client'

import { useState, useEffect } from 'react'
import { Configuracion } from '@/lib/types'
import { X } from 'lucide-react'

interface PromoFloatingButtonProps {
  config: Configuracion | null
}

export default function PromoFloatingButton({ config }: PromoFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const anuncio_url = config?.anuncio_foto_url

  // Auto-open on first visit after 3 seconds
  useEffect(() => {
    if (anuncio_url && !hasOpened) {
      const timer = setTimeout(() => {
        setIsOpen(true)
        setHasOpened(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [anuncio_url, hasOpened])

  if (!anuncio_url) return null

  return (
    <>
      {/* Botón flotante - Agrupado en la derecha */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-11 h-11 bg-[var(--color-acento)] text-white rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.25)] hover:scale-110 transition-all duration-300 ease-in-out relative ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
          title="Ver Aviso"
        >
          <span className="text-xl leading-none" role="img" aria-label="Aviso">⚽</span>
          {/* Indicador de notificación */}
          {!hasOpened && (
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </button>

      {/* Popup de la Promoción */}
      <div 
        className={`fixed bottom-6 right-20 z-50 w-[90vw] max-w-[360px] bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 rounded-full p-1.5 shadow-sm transition-all z-10"
        >
          <X size={18} />
        </button>

        {anuncio_url && (
          <div className="relative w-full overflow-hidden flex flex-col">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={anuncio_url} 
              alt="Aviso Especial"
              className="w-full h-auto object-cover max-h-[60vh]"
            />
            
            <div className="p-4 bg-white">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 bg-[var(--color-primario)] hover:bg-[var(--color-acento)] text-white font-inter font-medium rounded-lg transition-colors"
              >
                ¡Entendido!
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
