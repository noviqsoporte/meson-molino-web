'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

export default function ReservaMesaForm() {
  const [formData, setFormData] = useState({
    nombre_cliente: '',
    telefono: '',
    fecha: '',
    hora: '13:00',
    personas: 2
  })
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const horas = Array.from({ length: 9 }, (_, i) => `${i + 13}:00`)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tipo: 'Mesa',
          estado: 'Planeada',
          personas: Number(formData.personas)
        })
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
              onChange={e => setFormData({...formData, fecha: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">Hora *</label>
            <select 
              value={formData.hora}
              onChange={e => setFormData({...formData, hora: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all bg-white"
            >
              {horas.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>

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
