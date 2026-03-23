'use client'

import { useState, useEffect, useCallback } from 'react'
import { Espacio } from '@/lib/types'
import { Plus, Edit2, Trash2, X, Check, X as XIcon } from 'lucide-react'
import ImageUploader from './ImageUploader'

export default function EspaciosAdmin() {
    const [espacios, setEspacios] = useState<Espacio[]>([])
    const [loading, setLoading] = useState(true)

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
    const [editingId, setEditingId] = useState<string | null>(null)

    // Form State
    const [formData, setFormData] = useState<Partial<Espacio>>({
        nombre: '',
        descripcion: '',
        foto_url_1: '',
        foto_url_2: '',
        foto_url_3: '',
        seccion: 'Restaurante',
        orden: 0,
        activo: true
    })

    // Toasts
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

    const showToast = (msg: string, type: 'success' | 'error') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    const fetchEspacios = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/espacios')
            if (res.ok) {
                setEspacios(await res.json())
            }
        } catch (error) {
            console.error('Error fetching espacios:', error)
            showToast('Error cargando espacios', 'error')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchEspacios()
    }, [fetchEspacios])

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch('/api/espacios', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, activo: !currentStatus })
            })
            if (res.ok) {
                setEspacios(espacios.map(p => p.id === id ? { ...p, activo: !currentStatus } : p))
                showToast(`Espacio ${!currentStatus ? 'activado' : 'desactivado'}`, 'success')
            } else {
                throw new Error('Error al actualizar')
            }
        } catch {
            showToast('Error al actualizar estado', 'error')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este espacio? Esta acción no se puede deshacer.')) return

        try {
            const res = await fetch('/api/espacios', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            if (res.ok) {
                setEspacios(espacios.filter(p => p.id !== id))
                showToast('Espacio eliminado', 'success')
            } else {
                throw new Error('Error al eliminar')
            }
        } catch {
            showToast('Error al eliminar espacio', 'error')
        }
    }

    const openModal = (mode: 'create' | 'edit', espacio?: Espacio) => {
        setModalMode(mode)
        if (mode === 'edit' && espacio) {
            setEditingId(espacio.id)
            setFormData({
                nombre: espacio.nombre,
                descripcion: espacio.descripcion,
                foto_url_1: espacio.foto_url_1,
                foto_url_2: espacio.foto_url_2,
                foto_url_3: espacio.foto_url_3,
                seccion: espacio.seccion,
                orden: espacio.orden,
                activo: espacio.activo
            })
        } else {
            setEditingId(null)
            setFormData({
                nombre: '',
                descripcion: '',
                foto_url_1: '',
                foto_url_2: '',
                foto_url_3: '',
                seccion: 'Restaurante',
                orden: espacios.length + 1,
                activo: true
            })
        }
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (modalMode === 'create') {
                const res = await fetch('/api/espacios', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                })
                if (res.ok) {
                    showToast('Espacio creado', 'success')
                    fetchEspacios()
                } else {
                    throw new Error('Error al crear')
                }
            } else {
                const res = await fetch('/api/espacios', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editingId, ...formData })
                })
                if (res.ok) {
                    showToast('Espacio actualizado', 'success')
                    fetchEspacios()
                } else {
                    throw new Error('Error al actualizar')
                }
            }
            setIsModalOpen(false)
        } catch {
            showToast('Error al guardar espacio', 'error')
        }
    }

    if (loading) return <div className="text-center py-12 font-inter text-[#5C5C5C]">Cargando espacios...</div>

    return (
        <div className="space-y-6 relative">
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-inter transition-opacity duration-300 ${toast.type === 'success' ? 'bg-[var(--color-acento)]' : 'bg-red-500'}`}>
                    {toast.msg}
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-3xl font-playfair text-[var(--color-primario)] mb-2">Espacios</h1>
                    <p className="text-[#5C5C5C] font-inter">Gestiona los espacios de Restaurante y Salón de Eventos</p>
                </div>
                <button
                    onClick={() => openModal('create')}
                    className="bg-[var(--color-primario)] hover:bg-[var(--color-acento)] text-white px-4 py-2 rounded-lg font-inter flex items-center space-x-2 transition-colors"
                >
                    <Plus size={20} />
                    <span>Nuevo Espacio</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {espacios.map((espacio) => {
                    const typeColor = espacio.seccion === 'Restaurante' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'

                    return (
                        <div key={espacio.id} className={`bg-white rounded-xl border ${espacio.activo ? 'border-[#E8E4DF]' : 'border-red-200'} shadow-[0_2px_8px_rgba(31,61,43,0.08)] overflow-hidden flex flex-col`}>
                            {espacio.foto_url_1 ? (
                                <div className="h-48 w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${espacio.foto_url_1})` }}>
                                    {!espacio.activo && (
                                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold border border-red-200">
                                                Inactivo
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-48 w-full bg-[#F7F5F2] flex items-center justify-center relative">
                                    <span className="text-[#5C5C5C] font-inter">Sin imagen principal</span>
                                    {!espacio.activo && (
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
                                    <div className="flex flex-col gap-1 items-start">
                                        <h3 className="font-playfair text-xl text-[var(--color-primario)] line-clamp-1">{espacio.nombre}</h3>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${typeColor}`}>
                                            {espacio.seccion}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm font-inter text-[#5C5C5C] mb-4 line-clamp-2 flex-1 mt-2">{espacio.descripcion}</p>

                                <div className="flex items-center space-x-2 text-sm text-[#5C5C5C] font-inter mb-4">
                                    <div className="flex gap-2 h-12">
                                        {espacio.foto_url_2 && (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img src={espacio.foto_url_2} alt="" className="w-12 h-12 object-cover rounded border border-gray-200" />
                                        )}
                                        {espacio.foto_url_3 && (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img src={espacio.foto_url_3} alt="" className="w-12 h-12 object-cover rounded border border-gray-200" />
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-[#E8E4DF]">
                                    <button
                                        onClick={() => handleToggleActive(espacio.id, espacio.activo)}
                                        className={`flex items-center space-x-1 text-sm font-medium transition-colors ${espacio.activo ? 'text-green-600 hover:text-green-700' : 'text-red-500 hover:text-red-600'}`}
                                    >
                                        {espacio.activo ? (
                                            <><Check size={16} /> <span>Activo</span></>
                                        ) : (
                                            <><XIcon size={16} /> <span>Inactivo</span></>
                                        )}
                                    </button>

                                    <div className="flex space-x-3">
                                        <button onClick={() => openModal('edit', espacio)} className="text-[var(--color-acento)] hover:text-[var(--color-primario)] transition-colors" title="Editar">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(espacio.id)} className="text-red-500 hover:text-red-700 transition-colors" title="Eliminar">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
                {espacios.length === 0 && (
                    <div className="col-span-full py-12 text-center text-[#5C5C5C] font-inter bg-white rounded-xl border border-[#E8E4DF]">
                        No se encontraron espacios. Crea uno nuevo para empezar.
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
                                    {modalMode === 'create' ? 'Nuevo Espacio' : 'Editar Espacio'}
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Nombre del Espacio *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.nombre}
                                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                                className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Descripción *</label>
                                            <textarea
                                                required
                                                rows={3}
                                                value={formData.descripcion}
                                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                                className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)]"
                                            ></textarea>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Sección *</label>
                                                <select
                                                    value={formData.seccion || 'Restaurante'}
                                                    onChange={(e) => setFormData({ ...formData, seccion: e.target.value as 'Restaurante' | 'Salon' })}
                                                    className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)] bg-white cursor-pointer"
                                                >
                                                    <option value="Restaurante">Restaurante</option>
                                                    <option value="Salon">Salón de Eventos</option>
                                                </select>
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
                                        </div>

                                        <div>
                                            <ImageUploader
                                                label="Foto Principal (Obligatoria para galería)"
                                                value={formData.foto_url_1 || ''}
                                                onChange={(url) => setFormData({ ...formData, foto_url_1: url })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <ImageUploader
                                                    label="Foto Secundaria 2 (Opcional)"
                                                    value={formData.foto_url_2 || ''}
                                                    onChange={(url) => setFormData({ ...formData, foto_url_2: url })}
                                                />
                                            </div>
                                            <div>
                                                <ImageUploader
                                                    label="Foto Secundaria 3 (Opcional)"
                                                    value={formData.foto_url_3 || ''}
                                                    onChange={(url) => setFormData({ ...formData, foto_url_3: url })}
                                                />
                                            </div>
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
                                                Espacio Activo (visible para clientes)
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
                                            {modalMode === 'create' ? 'Crear Espacio' : 'Guardar Cambios'}
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
