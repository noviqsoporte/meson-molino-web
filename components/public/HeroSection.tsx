'use client'

import { Configuracion } from '@/lib/types'

export default function HeroSection({ config }: { config: Configuracion | null }) {
  const bgImage = config?.hero_foto_url 
    ? `url('${config.hero_foto_url}')` 
    : 'linear-gradient(to bottom right, var(--color-primario), var(--color-acento))'
    
  const nombre = config?.nombre_negocio || 'El Mesón del Molino'
  const tagline = config?.tagline || 'Experiencias culinarias y eventos inolvidables'

  return (
    <div className="relative h-screen min-h-[600px] flex items-center justify-center">
      {/* Background w/ Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: bgImage }}
      >
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 animate-slide-up-fade opacity-0-init delay-100 max-w-4xl mx-auto">
        <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl text-white mb-6 drop-shadow-lg">
          {nombre}
        </h1>
        <p className="font-inter text-lg md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light tracking-wide">
          {tagline}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center items-center opacity-0-init animate-slide-up-fade delay-300 max-w-2xl mx-auto">
          <a 
            href="#restaurante" 
            className="w-full flex items-center justify-center bg-transparent border-2 border-white/80 bg-white/10 text-white hover:bg-white/20 transition-colors duration-300 px-8 py-3 rounded text-lg font-medium shadow-lg"
          >
            Restaurante
          </a>
          <a 
            href="#salon" 
            className="w-full flex items-center justify-center bg-transparent border-2 border-white/80 bg-white/10 text-white hover:bg-white/20 transition-colors duration-300 px-8 py-3 rounded text-lg font-medium shadow-lg"
          >
            Salón de Eventos
          </a>
          <button 
            type="button"
            onClick={() => {
              document.getElementById('salon')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="w-full flex items-center justify-center bg-brand-dark text-white hover:bg-brand-olive transition-colors duration-300 px-8 py-3 rounded text-lg font-medium shadow-lg"
          >
            Ver Paquetes
          </button>
          <a 
            href="#reserva-mesa" 
            className="w-full flex items-center justify-center bg-transparent border-2 border-brand-gold text-white hover:bg-brand-gold/20 transition-colors duration-300 px-8 py-3 rounded text-lg font-medium shadow-lg"
          >
            Reservar Mesa
          </a>
        </div>
      </div>

    </div>
  )
}
