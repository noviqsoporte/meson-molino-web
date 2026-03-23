'use client'

import { useState, useEffect } from 'react'
import { Paquete } from '@/lib/types'
import { CheckCircle, Info } from 'lucide-react'

export default function CotizarEventoForm({ paquetes }: { paquetes: Paquete[] }) {
  const paquetesEvento = paquetes.filter(p => p.tipo === 'Evento')

  const [formData, setFormData] = useState({
    nombre_cliente: '',
    telefono: '',
    fecha: '',
    paquete_id: paquetesEvento.length > 0 ? paquetesEvento[0].id : '',
    personas: paquetesEvento.length > 0 ? paquetesEvento[0].personas_min.toString() : '50'
  })

  useEffect(() => {
    // Escuchar el evento personalizado desde las tarjetas de paquete
    const handleSelectPaquete = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      const paqId = customEvent.detail
      const paq = paquetes.find(p => p.id === paqId && p.tipo === 'Evento')
      if (paq) {
        setFormData(prev => ({ ...prev, paquete_id: paqId, personas: paq.personas_min.toString() }))
      }
    }
    
    window.addEventListener('selectPaquete', handleSelectPaquete)
    return () => window.removeEventListener('selectPaquete', handleSelectPaquete)
  }, [paquetes])
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const paqueteSeleccionado = paquetesEvento.find(p => p.id === formData.paquete_id)
  
  const minPersonas = paqueteSeleccionado?.personas_min || 1
  const maxPersonas = paqueteSeleccionado?.personas_max || 500
  const precioPerPersona = paqueteSeleccionado ? parseFloat(paqueteSeleccionado.precio_por_persona) : 0
  
  const personasNum = parseInt(formData.personas) || 0
  const precioEstimadoTotal = precioPerPersona * (personasNum || minPersonas)

  const handlePaqueteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    const paq = paquetesEvento.find(p => p.id === id)
    setFormData(prev => ({
      ...prev,
      paquete_id: id,
      personas: paq ? paq.personas_min.toString() : prev.personas
    }))
  }

  const handleBlur = () => {
    let p = parseInt(formData.personas)
    if (isNaN(p)) p = minPersonas
    if (p < minPersonas) p = minPersonas
    if (p > maxPersonas) p = maxPersonas
    setFormData(prev => ({...prev, personas: p.toString()}))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (paqueteSeleccionado) {
      if (personasNum < minPersonas || personasNum > maxPersonas) {
        alert(`Las personas deben estar entre ${minPersonas} y ${maxPersonas} para este paquete.`)
        return
      }
    }
    
    setStatus('loading')

    try {
      const res = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_cliente: formData.nombre_cliente,
          telefono: formData.telefono,
          fecha: formData.fecha,
          paquete_id: formData.paquete_id,
          tipo: 'Evento',
          estado: 'Planeada',
          personas: personasNum,
          precio_estimado: precioEstimadoTotal.toString()
        })
      })

      if (!res.ok) throw new Error('Error al guardar cotización')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white rounded-xl shadow-[0_8px_32px_rgba(31,61,43,0.12)] p-8 md:p-12 text-center h-full flex flex-col items-center justify-center">
        <CheckCircle className="w-16 h-16 text-brand-olive mb-4" />
        <h3 className="font-playfair text-2xl text-brand-dark mb-2">¡Tu pre-cotización ha sido guardada!</h3>
        <p className="text-gray-600">Nos pondremos en contacto al {formData.telefono} a la brevedad para afinar detalles y confirmar fechas.</p>
        <button 
          onClick={() => { setStatus('idle'); setFormData({...formData, nombre_cliente: ''}) }}
          className="mt-8 text-sm font-medium text-brand-olive hover:text-brand-dark underline"
        >
          Cotizar otro evento
        </button>
      </div>
    )
  }

  return (
    <div id="cotizar-evento" className="bg-white rounded-xl shadow-[0_8px_32px_rgba(31,61,43,0.12)] overflow-hidden flex flex-col h-full">
      <div className="p-6 md:p-10 flex-grow">
        <h3 className="font-playfair text-3xl text-brand-dark mb-6 text-center">Cotiza tu Evento</h3>
        
        {status === 'error' && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
            Ocurrió un error al procesar tu cotización. Intenta nuevamente o contáctanos directamente.
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
              placeholder="Ej. Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">Teléfono (WhatsApp *</label>
            <input 
              required
              type="tel" 
              value={formData.telefono}
              onChange={e => setFormData({...formData, telefono: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Fecha Deseada *</label>
              <input 
                required
                type="date" 
                min={new Date().toISOString().split('T')[0]}
                value={formData.fecha}
                onChange={e => setFormData({...formData, fecha: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Paquete de interés *</label>
              <select 
                value={formData.paquete_id}
                onChange={handlePaqueteChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="" disabled>Selecciona un paquete</option>
                {paquetesEvento.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">Número de personas *</label>
            <div className="relative">
              <input 
                required
                type="number" 
                min={minPersonas}
                max={maxPersonas}
                value={formData.personas}
                onChange={e => setFormData({...formData, personas: e.target.value})}
                onFocus={(e) => e.target.select()}
                onBlur={handleBlur}
                placeholder={`ej. ${minPersonas + 5}`}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all" 
              />
              {paqueteSeleccionado && (
                <div className="absolute right-3 top-3 text-xs text-brand-olive font-medium bg-brand-bg px-2 rounded-md py-1 whitespace-nowrap hidden sm:block">
                  Rango: {minPersonas} a {maxPersonas}
                </div>
              )}
            </div>
          </div>

          {/* Resumen Visual */}
          {paqueteSeleccionado && (
            <div className="bg-brand-bg border border-brand-gold/30 rounded-lg p-5 mt-6 animate-slide-up-fade opacity-0-init delay-100">
              <div className="flex items-start gap-2 mb-3">
                <Info className="w-5 h-5 text-brand-olive shrink-0" />
                <h4 className="font-playfair text-lg text-brand-dark font-semibold">Resumen de Inversión</h4>
              </div>
              
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Paquete Seleccionado:</span>
                  <span className="font-medium text-brand-dark text-right ml-2">{paqueteSeleccionado.nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span>Precio por persona:</span>
                  <span className="font-medium text-brand-dark">${precioPerPersona.toLocaleString('es-MX')} MXN</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-brand-gold/20">
                  <span className="text-gray-500">Total estimado ({personasNum} personas):</span>
                  <span className="font-bold text-brand-olive text-base">
                    ${precioEstimadoTotal.toLocaleString('es-MX', { maximumFractionDigits: 0 })} MXN
                  </span>
                </div>
              </div>
            </div>
          )}

          <button 
            disabled={status === 'loading'}
            type="submit" 
            className="w-full bg-brand-dark text-white hover:bg-brand-olive transition-colors py-4 rounded-lg font-medium shadow-md flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Guardando...' : 'Guardar Precotización'}
          </button>
        </form>
      </div>
    </div>
  )
}

