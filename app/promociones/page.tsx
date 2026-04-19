'use client'

import { useState, useEffect } from 'react'
import { Promocion } from '@/lib/types'

export default function PromocionesPage() {
  const [acceso, setAcceso] = useState(false)
  const [correo, setCorreo] = useState('')
  const [loading, setLoading] = useState(false)
  const [promociones, setPromociones] = useState<Promocion[]>([])

  useEffect(() => {
    const fetchPromociones = async () => {
      try {
        const res = await fetch('/api/promociones')
        if (res.ok) setPromociones(await res.json())
      } catch (e) {
        console.error('Error cargando promociones:', e)
      }
    }
    fetchPromociones()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/suscriptores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo }),
      })
      setAcceso(true)
    } catch (e) {
      console.error('Error al registrar:', e)
      setAcceso(true)
    } finally {
      setLoading(false)
    }
  }

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const formatFecha = (iso: string) => {
    if (!iso) return ''
    const [year, month, day] = iso.split('-')
    return `${day}/${month}/${year}`
  }

  if (!acceso) {
    return (
      <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-[#E8E4DF]">
          <h1 className="font-playfair text-3xl text-[#1F3D2B] mb-2 text-center">Promociones Exclusivas</h1>
          <p className="font-inter text-[#5C5C5C] text-center mb-6 text-sm">
            Ingresa tu correo para acceder a nuestras promociones y ofertas especiales.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              placeholder="tucorreo@ejemplo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-4 py-3 border border-[#E8E4DF] rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-[#C9A227] text-[#2B2B2B]"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-inter font-semibold text-[#1F3D2B] transition-colors disabled:opacity-60"
              style={{ backgroundColor: '#C9A227' }}
            >
              {loading ? 'Un momento...' : 'Ver Promociones'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F5F2] px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-playfair text-4xl text-[#1F3D2B] mb-2 text-center">Promociones</h1>
        <p className="font-inter text-[#5C5C5C] text-center mb-10 text-sm">Ofertas y descuentos exclusivos para ti</p>

        {promociones.length === 0 ? (
          <p className="text-center font-inter text-[#5C5C5C]">No hay promociones disponibles por el momento.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promociones.map((promo) => {
              const fechaVigencia = promo.vigencia_hasta ? new Date(promo.vigencia_hasta + 'T00:00:00') : null
              const vencida = fechaVigencia ? fechaVigencia < hoy : false

              return (
                <div key={promo.id} className="bg-white rounded-xl border border-[#E8E4DF] shadow-[0_2px_8px_rgba(31,61,43,0.08)] overflow-hidden">
                  {promo.foto_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={promo.foto_url}
                      alt={promo.titulo}
                      className="w-full aspect-video object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-video bg-[#F7F5F2] flex items-center justify-center">
                      <span className="font-inter text-[#5C5C5C] text-sm">Sin imagen</span>
                    </div>
                  )}
                  <div className="p-5">
                    <h2 className="font-playfair text-xl text-[#1F3D2B] mb-3">{promo.titulo}</h2>
                    {fechaVigencia && (
                      <span
                        className={`inline-block text-xs font-inter font-semibold px-3 py-1 rounded-full ${
                          vencida
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-[#F7F5F2] text-[#1F3D2B] border border-[#E8E4DF]'
                        }`}
                      >
                        {vencida ? 'Vencida' : `Válido hasta: ${formatFecha(promo.vigencia_hasta)}`}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
