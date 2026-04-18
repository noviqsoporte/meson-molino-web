'use client'

import { useState, useEffect } from 'react'
import { Reserva, Configuracion } from '@/lib/types'

export default function DashboardHome() {
    const [reservas, setReservas] = useState<Reserva[]>([])
    const [config, setConfig] = useState<Configuracion | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resReservas, resConfig] = await Promise.all([
                    fetch('/api/reservas'),
                    fetch('/api/configuracion')
                ])

                if (resReservas.ok) setReservas(await resReservas.json())
                if (resConfig.ok) setConfig(await resConfig.json())
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return <div className="text-center py-12 font-inter text-[#5C5C5C]">Cargando dashboard...</div>
    }

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    // KPIs calculations
    const totalReservasMes = reservas.filter(
        (r) => r.tipo === 'Mesa' && new Date(r.fecha).getMonth() === currentMonth && new Date(r.fecha).getFullYear() === currentYear
    ).length

    const totalEventosMes = reservas.filter(
        (r) => r.tipo === 'Evento' && new Date(r.fecha).getMonth() === currentMonth && new Date(r.fecha).getFullYear() === currentYear
    ).length

    const ingresosEstimadosMes = reservas
        .filter(r => {
            const fecha = new Date(r.fecha)
            const ahora = new Date()
            return r.tipo === 'Evento' &&
                (r.estado === 'Agendada' || r.estado === 'Confirmada') &&
                fecha.getMonth() === ahora.getMonth() &&
                fecha.getFullYear() === ahora.getFullYear()
        })
        .reduce((sum, r) => {
            const precio = parseFloat(r.precio_estimado?.replace(/[^0-9.]/g, '') || '0')
            return sum + precio
        }, 0)

    const reservasPendientes = reservas.filter((r) => r.estado === 'Planeada').length

    const ultimasReservas = [...reservas].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 5)

    const getStatusBadge = (estado: string) => {
        const styles: Record<string, string> = {
            Planeada: 'bg-yellow-100 text-yellow-800',
            Confirmada: 'bg-blue-100 text-blue-800',
            Agendada: 'bg-green-100 text-green-800',
            Cancelada: 'bg-red-100 text-red-800'
        }
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[estado] || 'bg-gray-100 text-gray-800'}`}>{estado}</span>
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-playfair text-[var(--color-primario)] mb-2">¡Hola, {config?.nombre_negocio || 'Administrador'}!</h1>
                <p className="text-[#5C5C5C] font-inter">Resumen de actividad del mes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-[#E8E4DF] shadow-[0_2px_8px_rgba(31,61,43,0.08)]">
                    <p className="text-sm font-inter text-[#5C5C5C] mb-1">Cenas del Mes</p>
                    <p className="text-3xl font-playfair text-[var(--color-primario)]">{totalReservasMes}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-[#E8E4DF] shadow-[0_2px_8px_rgba(31,61,43,0.08)]">
                    <p className="text-sm font-inter text-[#5C5C5C] mb-1">Eventos del Mes</p>
                    <p className="text-3xl font-playfair text-[var(--color-primario)]">{totalEventosMes}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-[#E8E4DF] shadow-[0_2px_8px_rgba(31,61,43,0.08)]">
                    <p className="text-sm font-inter text-[#5C5C5C] mb-1">Ingresos Estimados (Mes)</p>
                    <p className="text-3xl font-playfair text-[var(--color-primario)]">${ingresosEstimadosMes.toLocaleString('es-MX')}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-[#E8E4DF] shadow-[0_2px_8px_rgba(31,61,43,0.08)]">
                    <p className="text-sm font-inter text-[#5C5C5C] mb-1">Pendientes de Confirmar</p>
                    <p className="text-3xl font-playfair text-[var(--color-primario)]">{reservasPendientes}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E8E4DF] shadow-[0_2px_8px_rgba(31,61,43,0.08)] overflow-hidden">
                <div className="p-6 border-b border-[#E8E4DF]">
                    <h2 className="text-xl font-playfair text-[var(--color-primario)]">Últimas Reservas / Eventos</h2>
                </div>

                {/* Tabla desktop */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left font-inter">
                        <thead className="bg-[#F7F5F2] text-[#5C5C5C] text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4 font-medium">Nombre</th>
                                <th className="px-6 py-4 font-medium">Tipo</th>
                                <th className="px-6 py-4 font-medium">Fecha</th>
                                <th className="px-6 py-4 font-medium">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8E4DF]">
                            {ultimasReservas.length > 0 ? (
                                ultimasReservas.map((reserva) => (
                                    <tr key={reserva.id} className="hover:bg-[#F7F5F2] transition-colors">
                                        <td className="px-6 py-4 font-medium text-[var(--color-primario)]">{reserva.nombre_cliente}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${reserva.tipo === 'Mesa' ? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800'}`}>
                                                {reserva.tipo}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[#5C5C5C]">{reserva.fecha} {reserva.hora}</td>
                                        <td className="px-6 py-4">{getStatusBadge(reserva.estado)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-[#5C5C5C]">No hay reservas recientes.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Cards móvil */}
                <div className="md:hidden divide-y divide-[#E8E4DF]">
                    {ultimasReservas.length > 0 ? (
                        ultimasReservas.map((reserva) => (
                            <div key={reserva.id} className="p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-[var(--color-primario)] font-inter">{reserva.nombre_cliente}</span>
                                    {getStatusBadge(reserva.estado)}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-[#5C5C5C] font-inter">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${reserva.tipo === 'Mesa' ? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800'}`}>
                                        {reserva.tipo}
                                    </span>
                                    <span>{reserva.fecha} {reserva.hora}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="px-4 py-8 text-center text-[#5C5C5C] font-inter">No hay reservas recientes.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
