'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { Paquete } from '@/lib/types'

export default function ReservaMesaForm({ paquetes = [] }: { paquetes?: Paquete[] }) {
  const [formData, setFormData] = useState({
    nombre_cliente: '',
    telefono: '',
    fecha: '',
    hora: '13:00',
    personas: 2
  })

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [incluyeBuffet, setIncluyeBuffet] = useState<boolean>(false)
  const [buffetSeleccionado, setBuffetSeleccionado] = useState<string>('')

  const horas = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00'
  ]

  // Detectar si la fecha es fin de semana
  const esFindeSemana = (fechaStr: string): boolean => {
    if (!fechaStr) return false
    const fecha = new Date(fechaStr + 'T12:00:00') // evitar problemas de timezone
    const dia = fecha.getDay()
    return dia === 0 || dia === 6 // 0=domingo, 6=sábado
  }

  // Filtrar buffet según hora
  const getBuffetDisponible = (hora: string): Paquete | null => {
    if (!hora) return null
    const horaNum = parseInt(hora.split(':')[0])
    const buffets = paquetes.filter(p => p.tipo === 'Buffet' && p.activo)
    if (horaNum < 13) {
      return buffets.find(p => p.nombre.toLowerCase().includes('desayuno')) || null
    } else {
      return buffets.find(p => p.nombre.toLowerCase().includes('comida')) || null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const payload: Record<string, unknown> = {
        nombre_cliente: formData.nombre_cliente,
        telefono: formData.telefono,
        fecha: formData.fecha,
        hora: formData.hora,
        personas: Number(formData.personas),
        tipo: 'Mesa',
        estado: 'Planeada',
      }

      if (incluyeBuffet && buffetSeleccionado) {
        const buffetPaq = paquetes.find(p => p.id === buffetSeleccionado)
        payload.paquete_id = buffetSeleccionado
        payload.precio_estimado = (
          parseFloat(buffetPaq?.precio_por_persona || '0') * Number(formData.personas)
        ).toString()
      }

      const res = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error('Error al guardar reserva')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white rounded-xl shadow-[0_8px_32px_rgba(31,61,43,0.12)] p-8 md:p-12 text-center h-full flex flex-col items-center justify-center">
        <CheckCircle className="w-16 h-16 text-brand-olive mb-4" />
        <h3 className="font-playfair text-2xl text-brand-dark mb-2">¡Reserva confirmada!</h3>
        <p className="text-gray-600">Te esperamos el {formData.fecha} a las {formData.hora}. Nos pondremos en contacto pronto para reconfirmar tus detalles.</p>
        <button 
          onClick={() => { setStatus('idle'); setFormData({...formData, nombre_cliente: ''}) }}
          className="mt-8 text-sm font-medium text-brand-olive hover:text-brand-dark underline"
        >
          Hacer nueva reserva
        </button>
      </div>
    )
  }

  const buffetDisponible = esFindeSemana(formData.fecha) && formData.hora ? getBuffetDisponible(formData.hora) : null

  return (
    <div className="bg-white rounded-xl shadow-[0_8px_32px_rgba(31,61,43,0.12)] p-6 md:p-10">
      <h3 className="font-playfair text-3xl text-brand-dark mb-6 text-center">Reserva tu Mesa</h3>
      
      {status === 'error' && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
          Ocurrió un error al procesar tu reserva. Intenta nuevamente o contáctanos directamente.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1">Nombre completo *</label>
          <input 
            required
            type="text" 
            value={formData.nombre_cliente}
            onChange={e => setFormData({...formData, nombre_cliente: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all" 
            placeholder="Ej. María López"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1">Teléfono (WhatsApp) *</label>
          <input 
            required
            type="tel" 
            value={formData.telefono}
            onChange={e => setFormData({...formData, telefono: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all" 
            placeholder="Ej. 55 1234 5678"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">Fecha *</label>
            <input 
              required
              type="date" 
              value={formData.fecha}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => {
                setFormData({...formData, fecha: e.target.value})
                setIncluyeBuffet(false)
                setBuffetSeleccionado('')
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">Hora *</label>
            <select 
              value={formData.hora}
              onChange={e => {
                setFormData({...formData, hora: e.target.value})
                setIncluyeBuffet(false)
                setBuffetSeleccionado('')
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all bg-white"
            >
              {horas.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>

        {/* Buffet option — weekends only */}
        {buffetDisponible && (
          <div style={{
            background: 'color-mix(in srgb, var(--color-primario) 8%, transparent)',
            border: '1px solid var(--color-secundario)',
            borderRadius: '10px',
            padding: '14px 16px',
            marginTop: '4px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <input
                type="checkbox"
                id="buffet-check"
                checked={incluyeBuffet}
                onChange={(e) => {
                  setIncluyeBuffet(e.target.checked)
                  setBuffetSeleccionado(e.target.checked ? buffetDisponible.id : '')
                }}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--color-primario)' }}
              />
              <label htmlFor="buffet-check" style={{ fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: 'var(--color-primario)' }}>
                ¿Deseas incluir {buffetDisponible.nombre}?
              </label>
            </div>
            {incluyeBuffet && (
              <div style={{ fontSize: '13px', color: '#4B5563', paddingLeft: '28px' }}>
                {buffetDisponible.horario && (
                  <div style={{ marginBottom: '4px' }}>🕐 {buffetDisponible.horario}</div>
                )}
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span>👤 Adulto: <strong>${parseFloat(buffetDisponible.precio_por_persona).toLocaleString('es-MX')} MXN</strong></span>
                  {buffetDisponible.precio_nino && (
                    <span>🧒 Niño: <strong>${parseFloat(buffetDisponible.precio_nino).toLocaleString('es-MX')} MXN</strong></span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div>
           <label className="block text-sm font-medium text-brand-dark mb-1">Número de personas *</label>
           <input 
            required
            type="number" 
            min="1"
            max="20"
            value={formData.personas}
            onChange={e => setFormData({...formData, personas: Number(e.target.value)})}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all" 
          />
        </div>

        <button 
          disabled={status === 'loading'}
          type="submit" 
          className="w-full bg-brand-dark text-white hover:bg-brand-olive transition-colors py-4 rounded-lg font-medium shadow-md flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Procesando...' : 'Confirmar Reserva'}
        </button>
      </form>
    </div>
  )
}
