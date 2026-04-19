'use client'

import { useState, useEffect, useCallback } from 'react'
import { Promocion } from '@/lib/types'
import { Plus, Edit2, Trash2, X, Check, X as XIcon } from 'lucide-react'
import ImageUploader from './ImageUploader'

export default function PromocionesAdmin() {
  const [promociones, setPromociones] = useState<Promocion[]>([])
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState<Partial<Promocion>>({
    titulo: '',
    foto_url: '',
    vigencia_hasta: '',
    activo: true,
    orden: 0,
  })

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchPromociones = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/promociones/admin')
      if (res.ok) setPromociones(await res.json())
    } catch {
      showToast('Error cargando promociones', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPromociones()
  }, [fetchPromociones])

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/promociones/admin/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !currentStatus }),
      })
      if (res.ok) {
        setPromociones(promociones.map(p => p.id === id ? { ...p, activo: !currentStatus } : p))
        showToast(`Promoción ${!currentStatus ? 'activada' : 'desactivada'}`, 'success')
      } else throw new Error()
    } catch {
      showToast('Error al actualizar estado', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta promoción? Esta acción no se puede deshacer.')) return
    try {
      const res = await fetch(`/api/promociones/admin/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPromociones(promociones.filter(p => p.id !== id))
        showToast('Promoción eliminada', 'success')
      } else throw new Error()
    } catch {
      showToast('Error al eliminar promoción', 'error')
    }
  }

  const openModal = (mode: 'create' | 'edit', promo?: Promocion) => {
    setModalMode(mode)
    if (mode === 'edit' && promo) {
      setEditingId(promo.id)
      setFormData({
        titulo: promo.titulo,
        foto_url: promo.foto_url,
        vigencia_hasta: promo.vigencia_hasta,
        activo: promo.activo,
        orden: promo.orden,
      })
    } else {
      setEditingId(null)
      setFormData({ titulo: '', foto_url: '', vigencia_hasta: '', activo: true, orden: promociones.length + 1 })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (modalMode === 'create') {
        const res = await fetch('/api/promociones/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        if (res.ok) {
          showToast('Promoción creada', 'success')
          fetchPromociones()
        } else throw new Error()
      } else {
        const res = await fetch(`/api/promociones/admin/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        if (res.ok) {
          showToast('Promoción actualizada', 'success')
          fetchPromociones()
        } else throw new Error()
      }
      setIsModalOpen(false)
    } catch {
      showToast('Error al guardar promoción', 'error')
    }
  }

  const formatFecha = (iso: string) => {
    if (!iso) return '—'
    const [year, month, day] = iso.split('-')
    return `${day}/${month}/${year}`
  }

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  if (loading) return <div className="text-center py-12 font-inter text-[#5C5C5C]">Cargando promociones...</div>

  return (
    <div className="space-y-6 relative">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-inter transition-opacity duration-300 ${toast.type === 'success' ? 'bg-[var(--color-acento)]' : 'bg-red-500'}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-playfair text-[var(--color-primario)] mb-2">Promociones</h1>
          <p className="text-[#5C5C5C] font-inter">Gestiona las promociones visibles para clientes</p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="bg-[var(--color-primario)] hover:bg-[var(--color-acento)] text-white px-4 py-2 rounded-lg font-inter flex items-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>Nueva Promoción</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#E8E4DF] shadow-[0_2px_8px_rgba(31,61,43,0.08)] overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left font-inter">
            <thead className="bg-[#F7F5F2] text-[#5C5C5C] text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Título</th>
                <th className="px-6 py-4 font-medium">Vigencia</th>
                <th className="px-6 py-4 font-medium">Orden</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DF]">
              {promociones.length > 0 ? (
                promociones.map((promo) => {
                  const fechaVigencia = promo.vigencia_hasta ? new Date(promo.vigencia_hasta + 'T00:00:00') : null
                  const vencida = fechaVigencia ? fechaVigencia < hoy : false
                  return (
                    <tr key={promo.id} className="hover:bg-[#F7F5F2] transition-colors">
                      <td className="px-6 py-4 font-medium text-[var(--color-primario)]">{promo.titulo}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${vencida ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-800'}`}>
                          {promo.vigencia_hasta ? formatFecha(promo.vigencia_hasta) : '—'}
                          {vencida && ' (Vencida)'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#5C5C5C]">{promo.orden}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleActive(promo.id, promo.activo)}
                          className={`flex items-center space-x-1 text-sm font-medium transition-colors ${promo.activo ? 'text-green-600 hover:text-green-700' : 'text-red-500 hover:text-red-600'}`}
                        >
                          {promo.activo ? <><Check size={16} /><span>Activa</span></> : <><XIcon size={16} /><span>Inactiva</span></>}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-3">
                          <button onClick={() => openModal('edit', promo)} className="text-[var(--color-acento)] hover:text-[var(--color-primario)] transition-colors" title="Editar">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDelete(promo.id)} className="text-red-500 hover:text-red-700 transition-colors" title="Eliminar">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#5C5C5C]">No hay promociones. Crea una nueva para empezar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Cards móvil */}
        <div className="md:hidden divide-y divide-[#E8E4DF]">
          {promociones.length > 0 ? (
            promociones.map((promo) => {
              const fechaVigencia = promo.vigencia_hasta ? new Date(promo.vigencia_hasta + 'T00:00:00') : null
              const vencida = fechaVigencia ? fechaVigencia < hoy : false
              return (
                <div key={promo.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="font-medium text-[var(--color-primario)] font-inter">{promo.titulo}</span>
                    <div className="flex space-x-3 ml-2">
                      <button onClick={() => openModal('edit', promo)} className="text-[var(--color-acento)]"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(promo.id)} className="text-red-500"><Trash2 size={18} /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-inter flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${vencida ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-800'}`}>
                      {promo.vigencia_hasta ? formatFecha(promo.vigencia_hasta) : '—'}{vencida && ' (Vencida)'}
                    </span>
                    <button
                      onClick={() => handleToggleActive(promo.id, promo.activo)}
                      className={`flex items-center space-x-1 text-xs font-medium ${promo.activo ? 'text-green-600' : 'text-red-500'}`}
                    >
                      {promo.activo ? <><Check size={14} /><span>Activa</span></> : <><XIcon size={14} /><span>Inactiva</span></>}
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="px-4 py-8 text-center text-[#5C5C5C] font-inter">No hay promociones.</p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-inter">
          <div className="bg-white rounded-[16px] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
              <X size={24} />
            </button>
            <div className="p-8">
              <h2 className="text-2xl font-playfair text-[var(--color-primario)] mb-6">
                {modalMode === 'create' ? 'Nueva Promoción' : 'Editar Promoción'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Título *</label>
                  <input
                    type="text"
                    required
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)]"
                  />
                </div>

                <ImageUploader
                  label="Foto de la Promoción"
                  value={formData.foto_url || ''}
                  onChange={(url) => setFormData({ ...formData, foto_url: url })}
                />

                <div>
                  <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Válido hasta</label>
                  <input
                    type="date"
                    value={formData.vigencia_hasta}
                    onChange={(e) => setFormData({ ...formData, vigencia_hasta: e.target.value })}
                    className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Orden de visualización</label>
                  <input
                    type="number"
                    required
                    value={formData.orden}
                    onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)]"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="activo"
                    checked={formData.activo}
                    onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                    className="w-5 h-5 text-[var(--color-acento)] border-[#E8E4DF] rounded focus:ring-[var(--color-acento)] cursor-pointer"
                  />
                  <label htmlFor="activo" className="text-sm font-medium text-[var(--color-primario)] cursor-pointer">
                    Promoción activa (visible para clientes)
                  </label>
                </div>

                <div className="pt-6 flex justify-end space-x-4 border-t border-[#E8E4DF]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 border border-[#E8E4DF] text-[#5C5C5C] rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[var(--color-primario)] text-white rounded-lg hover:bg-[var(--color-acento)] transition-colors"
                  >
                    {modalMode === 'create' ? 'Crear Promoción' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
