'use client'

import { useState } from 'react'
import { Espacio, Paquete } from '@/lib/types'
import PaqueteCard from './PaqueteCard'

interface RestauranteSectionProps {
  espacios: Espacio[]
  paquetes: Paquete[]
}

export default function RestauranteSection({ espacios, paquetes }: RestauranteSectionProps) {
  const restauranteEspacios = espacios.filter(e => e.seccion === 'Restaurante')
  const buffets = paquetes.filter(p => p.tipo === 'Buffet')

  const [activeTab, setActiveTab] = useState<string>(restauranteEspacios[0]?.id || '')
  const activeEspacio = restauranteEspacios.find(e => e.id === activeTab)

  return (
    <section id="restaurante" className="py-20 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 opacity-0-init animate-slide-up-fade">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-brand-dark mb-4">
            Conócenos
          </h2>
          <p className="font-inter text-lg text-gray-600 max-w-2xl mx-auto">
            Espacios diseñados para cada ocasión
          </p>
        </div>

        {restauranteEspacios.length > 0 && (
          <div className="mb-16">
            <div className="flex overflow-x-auto pb-4 mb-8 gap-4 justify-start md:justify-center scrollbar-hide">
              {restauranteEspacios.map(espacio => {
                const isActive = activeTab === espacio.id
                return (
                  <button
                    key={espacio.id}
                    onClick={() => setActiveTab(espacio.id)}
                    className="whitespace-nowrap px-6 py-3 text-sm md:text-base font-medium transition-all duration-300"
                    style={{
                      backgroundColor: isActive ? 'var(--color-primario)' : 'transparent',
                      color: isActive ? '#FFFFFF' : 'var(--color-primario)',
                      border: isActive ? '1px solid transparent' : '1px solid var(--color-primario)',
                      borderRadius: '8px'
                    }}
                  >
                    {espacio.nombre}
                  </button>
                )
              })}
            </div>

            {activeEspacio && (
              <div 
                key={activeEspacio.id} 
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fade-in transition-opacity duration-300"
              >
                {/* Galería */}
                <div className="flex flex-col gap-4">
                  {activeEspacio.foto_url_1 && (
                    <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={activeEspacio.foto_url_1} 
                        alt={activeEspacio.nombre} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {(activeEspacio.foto_url_2 || activeEspacio.foto_url_3) && (
                    <div className="grid grid-cols-2 gap-4">
                      {activeEspacio.foto_url_2 && (
                        <div className="w-full h-32 md:h-48 rounded-xl overflow-hidden shadow">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={activeEspacio.foto_url_2} 
                            alt={`${activeEspacio.nombre} 2`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      {activeEspacio.foto_url_3 && (
                        <div className="w-full h-32 md:h-48 rounded-xl overflow-hidden shadow">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={activeEspacio.foto_url_3} 
                            alt={`${activeEspacio.nombre} 3`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Descripción */}
                <div className="flex flex-col justify-center">
                  <h3 className="font-playfair text-3xl font-bold text-brand-dark mb-6 text-[var(--color-primario)]">
                    {activeEspacio.nombre}
                  </h3>
                  <p className="font-inter text-gray-600 leading-relaxed whitespace-pre-wrap text-lg">
                    {activeEspacio.descripcion}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Subsección Nuestro Buffet */}
        {buffets.length > 0 && (
          <div className="mt-24 pt-16 border-t border-gray-200">
            <div className="text-center mb-12 opacity-0-init animate-slide-up-fade">
              <h3 className="font-playfair text-3xl md:text-4xl font-bold text-brand-dark mb-4 text-[var(--color-primario)]">
                Nuestro Buffet
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto font-inter">
                Disfruta de nuestros deliciosos buffets en un ambiente inigualable.
              </p>
            </div>
            
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '32px',
              maxWidth: '900px',
              margin: '0 auto'
            }}>
              {buffets.map(paquete => (
                <div style={{ width: '380px', maxWidth: '100%' }} key={paquete.id}>
                  <PaqueteCard paquete={paquete} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
