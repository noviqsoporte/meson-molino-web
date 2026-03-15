'use client'

import { useState, useEffect, useCallback } from 'react'
import { Reserva, Paquete } from '@/lib/types'
import { Plus, Edit2, Trash2, X } from 'lucide-react'

type StatusOption = 'Planeada' | 'Confirmada' | 'Agendada' | 'Cancelada'

export default function EventosAdmin() {
    const [reservas, setReservas] = useState<Reserva[]>([])
    const [paquetes, setPaquetes] = useState<Paquete[]>([])
    const [loading, setLoading] = useState(true)

    // Filters
    const [filterEstado, setFilterEstado] = useState<'Todos' | StatusOption>('Todos')
    const [searchTerm, setSearchTerm] = useState('')

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
    const [editingId, setEditingId] = useState<string | null>(null)

    // Form State
    const [formData, setFormData] = useState<Partial<Reserva>>({
        nombre_cliente: '',
        telefono: '',
        fecha: '',
        hora: '12:00', // Default hidden hour
        personas: 10,
        tipo: 'Evento',
        estado: 'Planeada',
        paquete_id: '',
        precio_estimado: '',
        notas_admin: ''
    })

    // Toasts
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

    const showToast = (msg: string, type: 'success' | 'error') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const [resReservas, resPaquetes] = await Promise.all([
                fetch('/api/reservas'),
                fetch('/api/paquetes')
            ])
            if (resReservas.ok) {
                const allReservas: Reserva[] = await resReservas.json()
                setReservas(allReservas.filter(r => r.tipo === 'Evento'))
            }
            if (resPaquetes.ok) setPaquetes(await resPaquetes.json())
        } catch (error) {
            console.error('Error fetching data:', error)
            showToast('Error cargando eventos', 'error')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])



    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este evento? Esta acción no se puede deshacer.')) return

        try {
            const res = await fetch('/api/reservas', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            if (res.ok) {
                setReservas(reservas.filter(r => r.id !== id))
                showToast('Evento eliminado', 'success')
            } else {
                throw new Error('Error al eliminar')
            }
        } catch {
            showToast('Error al eliminar evento', 'error')
        }
    }

    const openModal = (mode: 'create' | 'edit', reserva?: Reserva) => {
        setModalMode(mode)
        if (mode === 'edit' && reserva) {
            setEditingId(reserva.id || null)
            setFormData({
                nombre_cliente: reserva.nombre_cliente,
                telefono: reserva.telefono,
                fecha: reserva.fecha,
                hora: reserva.hora,
                personas: reserva.personas,
                tipo: 'Evento',
                estado: reserva.estado,
                paquete_id: reserva.paquete_id || '',
                precio_estimado: reserva.precio_estimado || '',
                notas_admin: reserva.notas_admin || ''
            })
        } else {
            setEditingId(null)
            setFormData({
                nombre_cliente: '',
                telefono: '',
                fecha: '',
                hora: '12:00',
                personas: 10,
                tipo: 'Evento',
                estado: 'Planeada',
                paquete_id: '',
                precio_estimado: '',
                notas_admin: ''
            })
        }
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            if (modalMode === 'create') {
                const res = await fetch('/api/reservas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                })
                if (res.ok) {
                    showToast('Evento creado', 'success')
                    fetchData()
                } else {
                    throw new Error('Error al crear')
                }
            } else {
                const res = await fetch('/api/reservas', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editingId, ...formData })
                })
                if (res.ok) {
                    showToast('Evento actualizado', 'success')
                    fetchData()
                } else {
                    throw new Error('Error al actualizar')
                }
            }
            setIsModalOpen(false)
        } catch {
            showToast('Error al guardar evento', 'error')
        }
    }

    const filteredReservas = reservas.filter(r => {
        const matchEstado = filterEstado === 'Todos' || r.estado === filterEstado
        const matchSearch = r.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.telefono?.includes(searchTerm)
        return matchEstado && matchSearch
    })

    if (loading) return <div className="text-center py-12 font-inter text-[#5C5C5C]">Cargando eventos...</div>

    return (
        <div className="space-y-6 relative">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-inter transition-opacity duration-300 ${toast.type === 'success' ? 'bg-[var(--color-acento)]' : 'bg-red-500'}`}>
                    {toast.msg}
                </div>
            )}

            {/* Header and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-3xl font-playfair text-[var(--color-primario)] mb-2">Eventos</h1>
                    <p className="text-[#5C5C5C] font-inter">Gestiona todas las solicitudes de eventos</p>
                </div>
                <button
                    onClick={() => openModal('create')}
                    className="bg-[var(--color-primario)] hover:bg-[var(--color-acento)] text-white px-4 py-2 rounded-lg font-inter flex items-center space-x-2 transition-colors"
                >
                    <Plus size={20} />
                    <span>Nuevo Evento</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-[#E8E4DF] shadow-[0_2px_8px_rgba(31,61,43,0.08)] flex flex-col md:flex-row gap-4 font-inter">
                <input
                    type="text"
                    placeholder="Buscar por nombre o teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-[#E8E4DF] focus:outline-none focus:ring-2 focus:ring-[var(--color-acento)]"
                />
                <select
                    value={filterEstado}
                    onChange={(e) => setFilterEstado(e.target.value as StatusOption)}
                    className="px-4 py-2 rounded-lg border border-[#E8E4DF] focus:outline-none focus:ring-2 focus:ring-[var(--color-acento)] bg-white cursor-pointer"
                >
                    <option value="Todos">Estado: Todos</option>
                    <option value="Planeada">Planeada</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="Agendada">Agendada</option>
                    <option value="Cancelada">Cancelada</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-[#E8E4DF] shadow-[0_2px_8px_rgba(31,61,43,0.08)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-inter whitespace-nowrap">
                        <thead className="bg-[#F7F5F2] text-[#5C5C5C] text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4 font-medium">Cliente</th>
                                <th className="px-6 py-4 font-medium">Contacto</th>
                                <th className="px-6 py-4 font-medium">Fecha Deseada</th>
                                <th className="px-6 py-4 font-medium text-center">Pax</th>
                                <th className="px-6 py-4 font-medium">Paquete</th>
                                <th className="px-6 py-4 font-medium">Precio Est.</th>
                                <th className="px-6 py-4 font-medium">Estado</th>
                                <th className="px-6 py-4 font-medium text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8E4DF]">
                            {filteredReservas.map((reserva) => (
                                <tr key={reserva.id} className="hover:bg-[#F7F5F2] transition-colors">
                                    <td className="px-6 py-4 text-[var(--color-primario)] font-medium">{reserva.nombre_cliente}</td>
                                    <td className="px-6 py-4 text-[#5C5C5C]">{reserva.telefono}</td>
                                    <td className="px-6 py-4 text-[#5C5C5C]">{reserva.fecha}</td>
                                    <td className="px-6 py-4 text-center text-[#5C5C5C]">{reserva.personas}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col space-y-1">
                                            {reserva.paquete_id && (
                                                <span className="text-sm font-medium text-[var(--color-primario)] truncate max-w-[150px]">
                                                    {paquetes.find(p => p.id === reserva.paquete_id)?.nombre || 'Paquete Desconocido'}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[#5C5C5C] font-medium">
                                        {reserva.precio_estimado ? `$${reserva.precio_estimado}` : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={reserva.estado}
                                            onChange={async (e) => {
                                                const nuevoEstado = e.target.value
                                                if (!reserva.id) return
                                                try {
                                                    const res = await fetch('/api/reservas', {
                                                        method: 'PUT',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ id: reserva.id, estado: nuevoEstado })
                                                    })
                                                    if (res.ok) {
                                                        showToast('Estado actualizado', 'success')
                                                        await fetchData()
                                                    } else {
                                                        showToast('Error al actualizar estado', 'error')
                                                    }
                                                } catch {
                                                    showToast('Error al actualizar estado', 'error')
                                                }
                                            }}
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                border: '1px solid #E8E4DF',
                                                fontSize: '13px',
                                                fontFamily: 'Inter, sans-serif',
                                                cursor: 'pointer',
                                                backgroundColor: reserva.estado === 'Planeada' ? '#FEF3C7' :
                                                    reserva.estado === 'Confirmada' ? '#DBEAFE' :
                                                        reserva.estado === 'Agendada' ? '#D1FAE5' : '#FEE2E2',
                                                color: reserva.estado === 'Planeada' ? '#92400E' :
                                                    reserva.estado === 'Confirmada' ? '#1E40AF' :
                                                        reserva.estado === 'Agendada' ? '#065F46' : '#991B1B',
                                            }}
                                        >
                                            <option value="Planeada">Planeada</option>
                                            <option value="Confirmada">Confirmada</option>
                                            <option value="Agendada">Agendada</option>
                                            <option value="Cancelada">Cancelada</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center space-x-3">
                                            <button onClick={() => openModal('edit', reserva)} className="text-[var(--color-acento)] hover:text-[var(--color-primario)] transition-colors" title="Editar">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => reserva.id && handleDelete(reserva.id)} className="text-red-500 hover:text-red-700 transition-colors" title="Eliminar">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredReservas.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-[#5C5C5C]">No se encontraron eventos.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
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
                                {modalMode === 'create' ? 'Nuevo Evento' : 'Editar Evento'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Nombre Completo *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.nombre_cliente}
                                            onChange={(e) => setFormData({ ...formData, nombre_cliente: e.target.value })}
                                            className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Teléfono (WhatsApp) *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.telefono}
                                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                            className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Fecha Deseada *</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.fecha}
                                            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                                            className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Número de Personas *</label>
                                        <input
                                            type="number"
                                            min="1"
                                            required
                                            value={formData.personas}
                                            onChange={(e) => setFormData({ ...formData, personas: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Estado *</label>
                                        <select
                                            value={formData.estado}
                                            onChange={(e) => setFormData({ ...formData, estado: e.target.value as StatusOption })}
                                            className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)] bg-white cursor-pointer"
                                        >
                                            <option value="Planeada">Planeada</option>
                                            <option value="Confirmada">Confirmada</option>
                                            <option value="Agendada">Agendada</option>
                                            <option value="Cancelada">Cancelada</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F7F5F2] p-4 rounded-lg border border-[#E8E4DF]">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Paquete de Evento *</label>
                                            <select
                                                required
                                                value={formData.paquete_id}
                                                onChange={(e) => setFormData({ ...formData, paquete_id: e.target.value })}
                                                className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)] bg-white cursor-pointer"
                                            >
                                                <option value="">Selecciona un paquete...</option>
                                                {paquetes.map(p => (
                                                    <option key={p.id} value={p.id}>{p.nombre}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Precio Estimado ($)</label>
                                            <input
                                                type="number"
                                                value={formData.precio_estimado}
                                                onChange={(e) => setFormData({ ...formData, precio_estimado: e.target.value })}
                                                className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)]"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Notas Administrativas</label>
                                        <textarea
                                            rows={3}
                                            value={formData.notas_admin}
                                            onChange={(e) => setFormData({ ...formData, notas_admin: e.target.value })}
                                            className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)]"
                                            placeholder="Alergias, peticiones especiales, etc. Solo visible para admins."
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="pt-6 flex justify-end space-x-4">
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
                                        {modalMode === 'create' ? 'Crear Evento' : 'Guardar Cambios'}
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
