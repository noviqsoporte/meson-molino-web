'use client'

import { useState } from 'react'
import { Paquete } from '@/lib/types'
import { Users } from 'lucide-react'
import { MiniSlider } from './MiniSlider'

const formatCurrency = (val: string | undefined) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 })
    .format(parseFloat(val || '0') || 0)

export default function PaqueteCard({ paquete }: { paquete: Paquete }) {
  const minPersonas = paquete.personas_min || 1
  const maxPersonas = paquete.personas_max || 500
  const [personasInput, setPersonasInput] = useState<string>(minPersonas.toString())

  const personas = personasInput
  const isBuffet = paquete.tipo === 'Buffet'

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



  const itemsIncluye = paquete.incluye
    .replace(/\\n/g, '\n')
    .split('\n')
    .filter(item => item.trim().length > 0)
    .map(item => item.trim())

  const fotos = [paquete.foto_url, paquete.foto_url_2, paquete.foto_url_3].filter(Boolean) as string[]

  return (
    <div className="bg-white rounded-xl shadow-[0_8px_32px_rgba(31,61,43,0.12)] overflow-hidden flex flex-col h-full opacity-0-init animate-slide-up-fade">
      {/* Image header */}
      <div className="relative w-full flex-shrink-0">
        {fotos.length > 0 ? (
          <MiniSlider fotos={fotos} height="h-48" />
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-brand-dark to-brand-olive text-white text-lg font-semibold">
            No Image
          </div>
        )}
        {isBuffet ? (
          <div className="absolute top-4 right-4 bg-[var(--color-secundario)] text-white px-3 py-1.5 rounded-full shadow inline-flex items-center gap-1.5 text-sm font-semibold">
            🍽️ Buffet
          </div>
        ) : (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow inline-flex items-center gap-1.5 text-sm font-medium text-brand-dark">
            <Users className="w-4 h-4 text-brand-gold" />
            {paquete.personas_min} - {paquete.personas_max} personas
          </div>
        )}
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <h3 className="font-playfair text-2xl font-bold text-brand-dark mb-1">
          {paquete.nombre}
        </h3>

        {isBuffet && paquete.horario && (
          <p style={{ fontSize: '14px', color: 'var(--color-acento)', fontWeight: '500', marginBottom: '8px' }}>
            ☀️ {paquete.horario}
          </p>
        )}

        <p className="text-gray-600 mb-6 text-sm leading-relaxed min-h-[40px]">
          {paquete.descripcion}
        </p>

        <div className="mb-6 flex-grow">
          <h4 className="font-semibold text-brand-dark mb-3 text-sm uppercase tracking-wide">Incluye:</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {itemsIncluye.map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--color-secundario)', fontWeight: 'bold', flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: '14px', color: '#2B2B2B' }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {isBuffet ? (
          /* ── BUFFET: show adult/child prices ── */
          <div style={{ background: '#F7F5F2', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#2B2B2B' }}>👤 Adulto</span>
              <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-primario)' }}>
                {formatCurrency(paquete.precio_por_persona)} MXN
              </span>
            </div>
            {paquete.precio_nino && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#2B2B2B' }}>🧒 Niño (3-9 años)</span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-acento)' }}>
                  {formatCurrency(paquete.precio_nino)} MXN
                </span>
              </div>
            )}
          </div>
        ) : (
          /* ── EVENTO: calculator ── */
          <div className="bg-brand-bg rounded-lg p-4 mb-6 border border-brand-gold/20 shrink-0">
            <div className="mb-4">
              <label className="block text-sm text-brand-dark mb-2 font-medium">
                ¿Cuántas personas asistirán?
              </label>
              <input
                type="number"
                min={paquete.personas_min}
                max={paquete.personas_max}
                value={personas === '0' ? '' : personas}
                onChange={(e) => setPersonasInput(e.target.value)}
                onFocus={(e) => e.target.select()}
                onBlur={handleBlur}
                placeholder={`ej. ${minPersonas + 5}`}
                className="w-20 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none text-center"
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', color: '#6B7280' }}>Precio por persona:</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-primario)' }}>
                  {formatCurrency(paquete.precio_por_persona)} MXN
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#2B2B2B' }}>Total estimado:</span>
                <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-secundario)' }}>
                  {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 })
                    .format((parseFloat(paquete.precio_por_persona) || 0) * (parseInt(personas) || paquete.personas_min))} MXN
                </span>
              </div>
            </div>
          </div>
        )}

        {isBuffet ? (
          <button
            onClick={() => document.getElementById('reserva-mesa')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              width: '100%',
              padding: '12px',
              background: 'var(--color-primario)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Reservar Mesa
          </button>
        ) : (
          <button
            onClick={handleCotizar}
            className="w-full bg-brand-dark text-white hover:bg-brand-olive transition-colors py-3.5 rounded-lg font-medium shadow-md flex items-center justify-center gap-2 shrink-0 group"
          >
            Cotizar este paquete
          </button>
        )}
      </div>
    </div>
  )
}
