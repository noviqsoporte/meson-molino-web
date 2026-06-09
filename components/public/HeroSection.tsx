'use client'

import { Configuracion } from '@/lib/types'

export default function HeroSection({ config }: { config: Configuracion | null }) {
  const bgImage = config?.hero_foto_url
    ? `url('${config.hero_foto_url}')`
    : 'linear-gradient(to bottom right, var(--color-primario), var(--color-acento))'

  const nombre = config?.nombre_negocio || 'El Mesón del Molino'
  const tagline = config?.tagline || 'Experiencias culinarias y eventos inolvidables'
  const promoUrl = config?.anuncio_foto_url

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

        {/* Promo image inline in hero */}
        {promoUrl && (
          <div className="mb-8 flex justify-center opacity-0-init animate-slide-up-fade delay-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={promoUrl}
              alt="Promoción especial"
              className="rounded-2xl shadow-2xl max-h-48 md:max-h-64 w-auto object-contain border-2 border-white/20"
            />
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 justify-center items-center opacity-0-init animate-slide-up-fade delay-300 max-w-3xl mx-auto">
          <a
            href="#restaurante"
            className="flex items-center justify-center bg-white/10 border border-white/70 text-white hover:bg-white/20 transition-colors duration-300 px-5 py-3 rounded text-sm md:text-base font-medium shadow-lg"
          >
            Restaurante
          </a>
          <a
            href="#buffets"
            className="flex items-center justify-center bg-white/10 border border-white/70 text-white hover:bg-white/20 transition-colors duration-300 px-5 py-3 rounded text-sm md:text-base font-medium shadow-lg"
          >
            Buffets
          </a>
          <a
            href="#salon"
            className="flex items-center justify-center bg-white/10 border border-white/70 text-white hover:bg-white/20 transition-colors duration-300 px-5 py-3 rounded text-sm md:text-base font-medium shadow-lg"
          >
            Salón de Eventos
          </a>
          <a
            href="#paquetes-eventos"
            className="flex items-center justify-center bg-white/10 border border-white/70 text-white hover:bg-white/20 transition-colors duration-300 px-5 py-3 rounded text-sm md:text-base font-medium shadow-lg"
          >
            Paquetes
          </a>
          <a
            href="#reserva-mesa"
            className="flex items-center justify-center bg-white/10 border border-brand-gold/80 text-white hover:bg-brand-gold/20 transition-colors duration-300 px-5 py-3 rounded text-sm md:text-base font-medium shadow-lg"
          >
            Reservar Mesa
          </a>
          <a
            href="#cotizar-evento"
            className="flex items-center justify-center bg-brand-gold text-brand-dark hover:bg-brand-gold/80 transition-colors duration-300 px-5 py-3 rounded text-sm md:text-base font-bold shadow-lg"
          >
            Cotizar
          </a>
          <a
            href="https://www.menusincarta.comunidadquetzalli.com/elmesondelmolino"
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2 sm:col-span-3 flex items-center justify-center bg-white/15 border border-white/70 text-white hover:bg-white/25 transition-colors duration-300 px-5 py-3 rounded text-sm md:text-base font-medium shadow-lg gap-2"
          >
            🍽️ Ver Menú
          </a>
        </div>
      </div>

      {/* Restaurant Guru 2026 Badge */}
      <div className="absolute bottom-4 left-4 z-20">
        <div
          id="b-gold"
          className="rg-award-lang-es_ES"
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.nodeName.toLowerCase() !== 'a') {
              const link = (e.currentTarget as HTMLElement).querySelector('.b-gold_r-link') as HTMLAnchorElement;
              if (link) window.open(link.href);
            }
          }}
        >
          <a href="https://es.restaurantguru.com/El-Meson-Del-Molino-Tepotzotlan" className="b-gold_r-link" target="_blank" rel="noopener noreferrer">El Mesón del Molino</a>
          <p className="b-gold_center">Recomendado</p>
          <a href="https://restaurantguru.com" className="b-gold__link" target="_blank" rel="noopener noreferrer">Restaurant Guru</a>
          <p className="b-gold_year">2026</p>
        </div>
      </div>

    </div>
  )
}
