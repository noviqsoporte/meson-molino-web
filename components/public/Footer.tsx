import { Configuracion } from '@/lib/types'
import { Instagram, MessageCircle, MapPin, Clock, Phone } from 'lucide-react'

export default function Footer({ config }: { config: Configuracion | null }) {
  const nombre = config?.nombre_negocio || 'El Mesón del Molino'
  const tagline = config?.tagline || 'Experiencias culinarias y eventos inolvidables'

  return (
    <footer className="bg-[#1F3D2B] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left mb-12">
          
          {/* Left Column */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-playfair text-3xl font-bold mb-4">{nombre}</h3>
            <p className="text-[#A8B5A2] text-sm leading-relaxed max-w-sm">
              {tagline}
            </p>
          </div>

          {/* Center Column */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold mb-6 uppercase tracking-wider text-sm">Contáctanos</h4>
            <div className="space-y-4 text-sm text-[#A8B5A2]">
              <div className="flex items-start gap-3 justify-center md:justify-start">
                <MapPin className="h-5 w-5 shrink-0 text-white" />
                <span>{config?.direccion || 'Dirección del restaurante (Por definir)'}</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Clock className="h-5 w-5 shrink-0 text-white" />
                <span>{config?.horarios || 'Mar-Dom 13:00 a 21:00 hrs'}</span>
              </div>
              {config?.telefono_wa && (
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <Phone className="h-5 w-5 shrink-0 text-white" />
                  <span>{config.telefono_wa}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="font-bold mb-6 uppercase tracking-wider text-sm">Síguenos</h4>
            <div className="flex gap-4">
              <a 
                href={config?.instagram || '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href={config?.telefono_wa ? `https://wa.me/${config.telefono_wa.replace(/\D/g, '')}` : '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Separator & Copyright */}
        <div className="border-t border-[#C9A227] pt-8 text-center text-xs text-[#A8B5A2]">
          <p>© 2025 El Mesón del Molino. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
