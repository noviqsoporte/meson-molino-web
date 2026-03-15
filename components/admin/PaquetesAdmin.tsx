'use client'

import { useState, useEffect, useCallback } from 'react'
import { Paquete } from '@/lib/types'
import { Plus, Edit2, Trash2, X, Check, X as XIcon } from 'lucide-react'
import ImageUploader from './ImageUploader'

export default function PaquetesAdmin() {
    const [paquetes, setPaquetes] = useState<Paquete[]>([])
    const [loading, setLoading] = useState(true)

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
    const [editingId, setEditingId] = useState<string | null>(null)

    // Form State
    const [formData, setFormData] = useState<Partial<Paquete>>({
        nombre: '',
        descripcion: '',
        foto_url: '',
        precio_fijo: '',
        personas_min: 1,
        personas_max: 10,
        incluye: '',
        activo: true,
        orden: 0
    })

    // Toasts
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

    const showToast = (msg: string, type: 'success' | 'error') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    const fetchPaquetes = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/paquetes')
            if (res.ok) {
                // Paquetes API returns all now in admin dashboard
                setPaquetes(await res.json())
            }
        } catch (error) {
            console.error('Error fetching paquetes:', error)
            showToast('Error cargando paquetes', 'error')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchPaquetes()
    }, [fetchPaquetes])

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch('/api/paquetes', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, activo: !currentStatus })
            })
            if (res.ok) {
                setPaquetes(paquetes.map(p => p.id === id ? { ...p, activo: !currentStatus } : p))
                showToast(`Paquete ${!currentStatus ? 'activado' : 'desactivado'}`, 'success')
            } else {
                throw new Error('Error al actualizar')
            }
        } catch {
            showToast('Error al actualizar estado', 'error')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este paquete? Esta acción no se puede deshacer y podría afectar las reservaciones históricas.')) return

        try {
            const res = await fetch('/api/paquetes', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            if (res.ok) {
                setPaquetes(paquetes.filter(p => p.id !== id))
                showToast('Paquete eliminado', 'success')
            } else {
                throw new Error('Error al eliminar')
            }
        } catch {
            showToast('Error al eliminar paquete', 'error')
        }
    }

    const openModal = (mode: 'create' | 'edit', paquete?: Paquete) => {
        setModalMode(mode)
        if (mode === 'edit' && paquete) {
            setEditingId(paquete.id)
            setFormData({
                nombre: paquete.nombre,
                descripcion: paquete.descripcion,
                foto_url: paquete.foto_url,
                precio_fijo: paquete.precio_fijo?.replace(/[^0-9.]/g, '') || '',
                personas_min: paquete.personas_min,
                personas_max: paquete.personas_max,
                incluye: paquete.incluye,
                activo: paquete.activo,
                orden: paquete.orden
            })
        } else {
            setEditingId(null)
            setFormData({
                nombre: '',
                descripcion: '',
                foto_url: '',
                precio_fijo: '',
                personas_min: 1,
                personas_max: 10,
                incluye: '',
                activo: true,
                orden: paquetes.length + 1
            })
        }
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (modalMode === 'create') {
                const res = await fetch('/api/paquetes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                })
                if (res.ok) {
                    showToast('Paquete creado', 'success')
                    fetchPaquetes()
                } else {
                    throw new Error('Error al crear')
                }
            } else {
                const res = await fetch('/api/paquetes', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editingId, ...formData })
                })
                if (res.ok) {
                    showToast('Paquete actualizado', 'success')
                    fetchPaquetes()
                } else {
                    throw new Error('Error al actualizar')
                }
            }
            setIsModalOpen(false)
        } catch {
            showToast('Error al guardar paquete', 'error')
        }
    }

    if (loading) return <div className="text-center py-12 font-inter text-[#5C5C5C]">Cargando paquetes...</div>

    return (
        <div className="space-y-6 relative">
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-inter transition-opacity duration-300 ${toast.type === 'success' ? 'bg-[var(--color-acento)]' : 'bg-red-500'}`}>
                    {toast.msg}
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-3xl font-playfair text-[var(--color-primario)] mb-2">Paquetes para Eventos</h1>
                    <p className="text-[#5C5C5C] font-inter">Gestiona los paquetes disponibles para reservaciones tipo Evento</p>
                </div>
                <button
                    onClick={() => openModal('create')}
                    className="bg-[var(--color-primario)] hover:bg-[var(--color-acento)] text-white px-4 py-2 rounded-lg font-inter flex items-center space-x-2 transition-colors"
                >
                    <Plus size={20} />
                    <span>Nuevo Paquete</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paquetes.map((paquete) => {
                    const precioFormateado = new Intl.NumberFormat('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                        minimumFractionDigits: 0
                    }).format(parseFloat(paquete.precio_fijo?.replace(/[^0-9.]/g, '') || '0') || 0)

                    return (
                        <div key={paquete.id} className={`bg-white rounded-xl border ${paquete.activo ? 'border-[#E8E4DF]' : 'border-red-200'} shadow-[0_2px_8px_rgba(31,61,43,0.08)] overflow-hidden flex flex-col`}>
                            {paquete.foto_url ? (
                                <div className="h-48 w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${paquete.foto_url})` }}>
                                    {!paquete.activo && (
                                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold border border-red-200">
                                                Inactivo
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-48 w-full bg-[#F7F5F2] flex items-center justify-center relative">
                                    <span className="text-[#5C5C5C] font-inter">Sin imagen</span>
                                    {!paquete.activo && (
                                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold border border-red-200">
                                                Inactivo
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-playfair text-xl text-[var(--color-primario)] line-clamp-1">{paquete.nombre}</h3>
                                    <span className="font-inter font-semibold text-[var(--color-primario)]">{precioFormateado} MXN</span>
                                </div>
                                <p className="text-sm font-inter text-[#5C5C5C] mb-4 line-clamp-2 flex-1">{paquete.descripcion}</p>

                                <div className="flex items-center space-x-2 text-sm text-[#5C5C5C] font-inter mb-4">
                                    <span className="bg-[#F7F5F2] px-2 py-1 rounded">Min: {paquete.personas_min} pax</span>
                                    <span className="bg-[#F7F5F2] px-2 py-1 rounded">Max: {paquete.personas_max} pax</span>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-[#E8E4DF]">
                                    <button
                                        onClick={() => handleToggleActive(paquete.id, paquete.activo)}
                                        className={`flex items-center space-x-1 text-sm font-medium transition-colors ${paquete.activo ? 'text-green-600 hover:text-green-700' : 'text-red-500 hover:text-red-600'}`}
                                    >
                                        {paquete.activo ? (
                                            <><Check size={16} /> <span>Activo</span></>
                                        ) : (
                                            <><XIcon size={16} /> <span>Inactivo</span></>
                                        )}
                                    </button>

                                    <div className="flex space-x-3">
                                        <button onClick={() => openModal('edit', paquete)} className="text-[var(--color-acento)] hover:text-[var(--color-primario)] transition-colors" title="Editar">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(paquete.id)} className="text-red-500 hover:text-red-700 transition-colors" title="Eliminar">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
                {paquetes.length === 0 && (
                    <div className="col-span-full py-12 text-center text-[#5C5C5C] font-inter bg-white rounded-xl border border-[#E8E4DF]">
                        No se encontraron paquetes. Crea uno nuevo para empezar.
                    </div>
                )}
            </div>

            {
                isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-inter">
                        <div className="bg-white rounded-[16px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                            >
                                <X size={24} />
                            </button>

                            <div className="p-8">
                                <h2 className="text-2xl font-playfair text-[var(--color-primario)] mb-6">
                                    {modalMode === 'create' ? 'Nuevo Paquete' : 'Editar Paquete'}
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Nombre del Paquete *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.nombre}
                                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                                className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)]"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Descripción Corta *</label>
                                            <textarea
                                                required
                                                rows={2}
                                                value={formData.descripcion}
                                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                                className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)]"
                                            ></textarea>
                                        </div>

                                        <div className="md:col-span-2">
                                            <ImageUploader
                                                label="Foto del Paquete"
                                                value={formData.foto_url || ''}
                                                onChange={(url) => setFormData({ ...formData, foto_url: url })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Precio Fijo ($) *</label>
                                            <input
                                                type="number"
                                                required
                                                value={formData.precio_fijo}
                                                onChange={(e) => setFormData({ ...formData, precio_fijo: e.target.value })}
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

                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Personas Mínimas *</label>
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                value={formData.personas_min}
                                                onChange={(e) => setFormData({ ...formData, personas_min: parseInt(e.target.value) })}
                                                className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Personas Máximas *</label>
                                            <input
                                                type="number"
                                                required
                                                min={formData.personas_min}
                                                value={formData.personas_max}
                                                onChange={(e) => setFormData({ ...formData, personas_max: parseInt(e.target.value) })}
                                                className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)]"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">¿Qué incluye? (Opcional, markdown/texto libre)</label>
                                            <textarea
                                                rows={4}
                                                value={formData.incluye}
                                                onChange={(e) => setFormData({ ...formData, incluye: e.target.value })}
                                                className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)]"
                                            ></textarea>
                                        </div>

                                        <div className="md:col-span-2 flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="activo"
                                                checked={formData.activo}
                                                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                                                className="w-5 h-5 text-[var(--color-acento)] border-[#E8E4DF] rounded focus:ring-[var(--color-acento)] cursor-pointer"
                                            />
                                            <label htmlFor="activo" className="text-sm font-medium text-[var(--color-primario)] cursor-pointer">
                                                Paquete Activo (visible para clientes)
                                            </label>
                                        </div>
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
                                            {modalMode === 'create' ? 'Crear Paquete' : 'Guardar Cambios'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
