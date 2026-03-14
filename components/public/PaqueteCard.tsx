'use client'

import { useState } from 'react'
import { Paquete } from '@/lib/types'
import { Check, Users } from 'lucide-react'

export default function PaqueteCard({ paquete }: { paquete: Paquete }) {
  const minPersonas = paquete.personas_min || 1
  const maxPersonas = paquete.personas_max || 500
  const [personasInput, setPersonasInput] = useState<string>(minPersonas.toString())

  const personasNum = parseInt(personasInput) || 0
  const precioFijoNum = parseFloat(paquete.precio_fijo) || 0
  const precioPorPersona = personasNum > 0 ? (precioFijoNum / personasNum) : 0

  const handleBlur = () => {
    let p = parseInt(personasInput)
    if (isNaN(p)) p = minPersonas
    if (p < minPersonas) p = minPersonas
    if (p > maxPersonas) p = maxPersonas
    setPersonasInput(p.toString())
  }

  const handleCotizar = () => {
    // Custom event to communicate with the CotizarEvento form
    window.dispatchEvent(new CustomEvent('selectPaquete', { detail: paquete.id }))
    const el = document.getElementById('cotizar-evento')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const incluyeList = paquete.incluye.split('\n').filter(line => line.trim() !== '')

  return (
    <div className="bg-white rounded-xl shadow-[0_8px_32px_rgba(31,61,43,0.12)] overflow-hidden flex flex-col h-full opacity-0-init animate-slide-up-fade">
      {/* Image header */}
      <div className="h-48 relative overflow-hidden bg-gradient-to-br from-brand-dark to-brand-olive shrink-0">
        {paquete.foto_url && (
          <img 
            src={paquete.foto_url} 
            alt={paquete.nombre} 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow inline-flex items-center gap-1.5 text-sm font-medium text-brand-dark">
          <Users className="w-4 h-4 text-brand-gold" />
          {paquete.personas_min} - {paquete.personas_max} personas
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <h3 className="font-playfair text-2xl font-bold text-brand-dark mb-2">
          {paquete.nombre}
        </h3>
        
        <p className="text-gray-600 mb-6 text-sm leading-relaxed min-h-[40px]">
          {paquete.descripcion}
        </p>

        <div className="mb-6 flex-grow">
          <h4 className="font-semibold text-brand-dark mb-3 text-sm uppercase tracking-wide">Incluye:</h4>
          <ul className="space-y-2.5">
            {incluyeList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                <Check className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
            {incluyeList.length === 0 && (
              <li className="text-sm text-gray-400 italic">Detalles no especificados</li>
            )}
          </ul>
        </div>

        <div className="bg-brand-bg rounded-lg p-4 mb-6 border border-brand-gold/20 shrink-0">
          <div className="text-center mb-4">
            <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Precio Fijo</span>
            <span className="font-playfair text-3xl text-brand-dark font-bold">
              ${precioFijoNum.toLocaleString('es-MX')} <span className="text-lg">MXN</span>
            </span>
          </div>
          
          <div className="pt-4 border-t border-brand-gold/20">
            <label className="block text-sm text-brand-dark mb-2 font-medium">
              Calculadora: ¿Cuántas personas asistirán?
            </label>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                min={paquete.personas_min} 
                max={paquete.personas_max}
                value={personasInput === '0' ? '' : personasInput}
                onChange={(e) => setPersonasInput(e.target.value)}
                onFocus={(e) => e.target.select()}
                onBlur={handleBlur}
                placeholder={`ej. ${minPersonas + 5}`}
                className="w-20 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none text-center"
              />
              <div className="flex-1 text-right">
                <span className="block text-xs text-gray-500">Precio por persona:</span>
                <span className="font-semibold text-brand-dark text-lg">
                  ${precioPorPersona.toLocaleString('es-MX', { maximumFractionDigits: 0 })} MXN
                </span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleCotizar}
          className="w-full bg-brand-dark text-white hover:bg-brand-olive transition-colors py-3.5 rounded-lg font-medium shadow-md flex items-center justify-center gap-2 shrink-0 group"
        >
          Cotizar este paquete
        </button>
      </div>
    </div>
  )
}
