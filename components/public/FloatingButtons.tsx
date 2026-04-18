'use client'

import { Configuracion } from '@/lib/types'
import { Instagram, Mail, MessageCircle } from 'lucide-react'

export default function FloatingButtons({ config }: { config: Configuracion | null }) {
  const waHref = config?.telefono_wa
    ? `https://wa.me/${config.telefono_wa.replace(/\D/g, '')}`
    : '#'

  const igHref = config?.instagram || '#'
  const mailHref = config?.correo_contacto ? `mailto:${config.correo_contacto}` : '#'

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        title="Contáctanos por WhatsApp"
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.25)] hover:scale-110 transition-transform duration-300 ease-in-out"
      >
        <MessageCircle className="w-7 h-7" />
      </a>

      {/* Instagram Button */}
      <a
        href={igHref}
        target="_blank"
        rel="noopener noreferrer"
        title="Síguenos en Instagram"
        className="w-14 h-14 text-white rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.25)] hover:scale-110 transition-transform duration-300 ease-in-out"
        style={{ background: 'linear-gradient(45deg, #E1306C, #833AB4)' }}
      >
        <Instagram className="w-7 h-7" />
      </a>

      {/* Email Button */}
      <a
        href={mailHref}
        title="Envíanos un correo"
        className="w-14 h-14 text-white rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.25)] hover:scale-110 transition-transform duration-300 ease-in-out"
        style={{ background: 'linear-gradient(135deg, #EA4335, #FBBC05)' }}
      >
        <Mail className="w-7 h-7" />
      </a>
    </div>
  )
}
