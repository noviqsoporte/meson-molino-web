'use client'

import { useState } from 'react'
import { Espacio, Paquete } from '@/lib/types'
import PaqueteCard from './PaqueteCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SalonEventosSectionProps {
  espacios: Espacio[]
  paquetes: Paquete[]
  telefonoWa?: string
}

function MiniSlider({ fotos }: { fotos: string[] }) {
  const [index, setIndex] = useState(0)

  if (fotos.length === 0) return null

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? fotos.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setIndex((prev) => (prev === fotos.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative w-full h-64 md:h-80 bg-gray-100 rounded-2xl overflow-hidden group shadow-md">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={fotos[index]} 
        alt={`Foto ${index + 1}`} 
        className="w-full h-full object-cover transition-opacity duration-300"
      />
      {fotos.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-brand-dark p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-brand-dark p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {fotos.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-colors ${i === index ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function SalonEventosSection({ espacios, paquetes }: SalonEventosSectionProps) {
  const salonEspacios = espacios.filter(e => e.seccion === 'Salon')
  const eventos = paquetes.filter(p => p.tipo === 'Evento')

  return (
    <section id="salon" className="py-20 md:py-24 bg-brand-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 opacity-0-init animate-slide-up-fade">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-brand-dark mb-4 text-[var(--color-primario)]">
            Salón de Eventos
          </h2>
          <p className="font-inter text-lg text-gray-600 max-w-2xl mx-auto">
            El espacio perfecto para tu celebración
          </p>
        </div>

        {salonEspacios.length > 0 && (
          <div className="mb-24">
            <div style={{
              maxWidth: '900px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '32px'
            }}>
              {salonEspacios.map(espacio => {
                const fotos = [espacio.foto_url_1, espacio.foto_url_2, espacio.foto_url_3].filter(Boolean) as string[]
                return (
                  <div key={espacio.id} className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center opacity-0-init animate-slide-up-fade">
                    <div className="w-full">
                      {fotos.length > 0 && <MiniSlider fotos={fotos} />}
                    </div>
                    <div className="flex flex-col text-center md:text-left">
                      <h3 className="font-playfair text-3xl font-bold text-[var(--color-primario)] mb-4">
                        {espacio.nombre}
                      </h3>
                      <p className="font-inter text-gray-600 leading-relaxed text-base">
                        {espacio.descripcion}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Subsección Paquetes de Evento */}
        {eventos.length > 0 && (
          <div id="paquetes-eventos" className="border-t border-gray-200 pt-16">
            <div className="text-center mb-12 opacity-0-init animate-slide-up-fade">
              <h3 className="font-playfair text-3xl md:text-4xl font-bold text-[var(--color-primario)] mb-4">
                Paquetes de Eventos
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto font-inter">
                Conoce nuestras opciones y servicios para que tu evento sea inolvidable.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventos.map(paquete => (
                <PaqueteCard key={paquete.id} paquete={paquete} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
