'use client'

import { useState, useEffect } from 'react'
import { Configuracion } from '@/lib/types'
import { Save } from 'lucide-react'
import ImageUploader from './ImageUploader'

export default function ConfiguracionAdmin() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [config, setConfig] = useState<Configuracion | null>(null)

    // Toasts
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

    const showToast = (msg: string, type: 'success' | 'error') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch('/api/configuracion')
                if (res.ok) {
                    const data = await res.json()
                    setConfig(data)
                }
            } catch (error) {
                console.error('Error fetching config:', error)
                showToast('Error cargando configuración', 'error')
            } finally {
                setLoading(false)
            }
        }

        fetchConfig()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!config || !config.id) return

        setSaving(true)
        try {
            const res = await fetch('/api/configuracion', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            })

            if (res.ok) {
                showToast('Configuración guardada exitosamente', 'success')
            } else {
                throw new Error('Error al guardar')
            }
        } catch (error) {
            console.error('Error saving config:', error)
            showToast('Error al guardar configuración', 'error')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="text-center py-12 font-inter text-[#5C5C5C]">Cargando configuración...</div>
    if (!config) return <div className="text-center py-12 font-inter text-[#5C5C5C]">No se encontró información de configuración en la base de datos.</div>

    return (
        <div className="space-y-6 relative max-w-4xl">
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-inter transition-opacity duration-300 ${toast.type === 'success' ? 'bg-[var(--color-acento)]' : 'bg-red-500'}`}>
                    {toast.msg}
                </div>
            )}

            <div>
                <h1 className="text-3xl font-playfair text-[var(--color-primario)] mb-2">Configuración del Negocio</h1>
                <p className="text-[#5C5C5C] font-inter">Ajusta la información pública de tu restaurante que verán los clientes.</p>
            </div>

            <div className="bg-white rounded-[16px] border border-[#E8E4DF] shadow-[0_2px_8px_rgba(31,61,43,0.08)] p-8">
                <form onSubmit={handleSubmit} className="space-y-8 font-inter">

                    <div className="bg-[#F7F5F2] p-6 rounded-xl border border-[#E8E4DF]">
                        <h3 className="text-lg font-playfair text-[var(--color-primario)] mb-4">Información General</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Nombre del Negocio</label>
                                <input
                                    type="text"
                                    required
                                    value={config.nombre_negocio || ''}
                                    onChange={(e) => setConfig({ ...config, nombre_negocio: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)] bg-white"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Tagline / Descripción Corta</label>
                                <input
                                    type="text"
                                    value={config.tagline || ''}
                                    onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)] bg-white"
                                    placeholder="Ej. El mejor sabor de la ciudad"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#F7F5F2] p-6 rounded-xl border border-[#E8E4DF]">
                        <h3 className="text-lg font-playfair text-[var(--color-primario)] mb-4">Contacto y Ubicación</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Teléfono (WhatsApp)</label>
                                <input
                                    type="tel"
                                    required
                                    value={config.telefono_wa || ''}
                                    onChange={(e) => setConfig({ ...config, telefono_wa: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)] bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Enlace a Instagram</label>
                                <input
                                    type="url"
                                    value={config.instagram || ''}
                                    onChange={(e) => setConfig({ ...config, instagram: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)] bg-white"
                                    placeholder="https://instagram.com/tu_cuenta"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Dirección Completa</label>
                                <textarea
                                    rows={2}
                                    value={config.direccion || ''}
                                    onChange={(e) => setConfig({ ...config, direccion: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)] bg-white"
                                ></textarea>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">Horarios de Atención</label>
                                <input
                                    type="text"
                                    value={config.horarios || ''}
                                    onChange={(e) => setConfig({ ...config, horarios: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)] bg-white"
                                    placeholder="Ej. Lun-Sab: 1pm - 11pm | Dom: 1pm - 8pm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#F7F5F2] p-6 rounded-xl border border-[#E8E4DF]">
                        <h3 className="text-lg font-playfair text-[var(--color-primario)] mb-4">Identidad Visual</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Color Primario', key: 'color_primario' as const, desc: 'Navbar, botones, sidebar' },
                                { label: 'Color Secundario', key: 'color_secundario' as const, desc: 'Dorado, acentos, checkmarks' },
                                { label: 'Color Acento', key: 'color_acento' as const, desc: 'Hover, estados activos' },
                            ].map(({ label, key, desc }) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-[var(--color-primario)] mb-1">
                                        {label}
                                    </label>
                                    <p className="text-xs text-[#5C5C5C] mb-2">{desc}</p>
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="color"
                                            value={config[key] || '#000000'}
                                            onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                                            className="w-12 h-12 border-none rounded-lg cursor-pointer p-0.5 bg-white shadow-sm"
                                        />
                                        <input
                                            type="text"
                                            value={config[key] || ''}
                                            onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                                            placeholder="var(--color-primario)"
                                            className="flex-1 px-4 py-2 border border-[#E8E4DF] rounded-lg focus:ring-2 focus:ring-[var(--color-acento)] bg-white font-mono text-sm"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#F7F5F2] p-6 rounded-xl border border-[#E8E4DF]">
                        <h3 className="text-lg font-playfair text-[var(--color-primario)] mb-4">Multimedia (Imágenes)</h3>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <ImageUploader
                                    label="Logo del Restaurante"
                                    value={config.logo_url || ''}
                                    onChange={(url) => setConfig({ ...config, logo_url: url })}
                                />
                            </div>

                            <div>
                                <ImageUploader
                                    label="Foto Principal (Hero)"
                                    value={config.hero_foto_url || ''}
                                    onChange={(url) => setConfig({ ...config, hero_foto_url: url })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-[var(--color-primario)] hover:bg-[var(--color-acento)] text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors disabled:opacity-50"
                        >
                            <Save size={20} />
                            <span>{saving ? 'Guardando...' : 'Guardar Configuración'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
