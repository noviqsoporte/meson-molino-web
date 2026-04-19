'use client'

import { LayoutDashboard, CalendarDays, PartyPopper, Package, Settings, LogOut, Landmark, Tag } from 'lucide-react'

export type Section = 'dashboard' | 'reservas' | 'eventos' | 'paquetes' | 'espacios' | 'promociones' | 'configuracion'

interface SidebarProps {
    currentSection: Section
    onNavClick: (section: Section) => void
}

export default function Sidebar({ currentSection, onNavClick }: SidebarProps) {
    const handleLogout = async () => {
        try {
            await fetch('/api/auth', { method: 'DELETE' })
            window.location.reload()
        } catch (e) {
            console.error('Error al cerrar sesión', e)
        }
    }

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'reservas', label: 'Reservas', icon: CalendarDays },
        { id: 'eventos', label: 'Eventos', icon: PartyPopper },
        { id: 'paquetes', label: 'Paquetes', icon: Package },
        { id: 'espacios', label: 'Espacios', icon: Landmark },
        { id: 'promociones', label: 'Promociones', icon: Tag },
        { id: 'configuracion', label: 'Config', icon: Settings },
    ] as const

    return (
        <>
            {/* Sidebar desktop */}
            <div className="hidden md:flex w-64 bg-[var(--color-primario)] text-white flex-col h-screen sticky top-0">
                <div className="p-6">
                    <h2 className="font-playfair text-2xl mb-1">Mesón del Molino</h2>
                    <p className="font-inter text-sm text-[#E8E4DF] opacity-80">Panel Administrativo</p>
                </div>

                <nav className="flex-1 px-4 mt-6">
                    <ul className="space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = currentSection === item.id
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => onNavClick(item.id)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-inter ${isActive ? 'bg-[var(--color-acento)] text-white' : 'text-[#E8E4DF] hover:bg-[var(--color-acento)] hover:text-white'}`}
                                    >
                                        <Icon size={20} />
                                        <span>{item.label}</span>
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                <div className="p-4 border-t border-[var(--color-acento)]">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-[#E8E4DF] hover:bg-[var(--color-acento)] hover:text-white transition-colors font-inter"
                    >
                        <LogOut size={20} />
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            </div>

            {/* Top bar móvil */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[var(--color-primario)] text-white flex items-center justify-between px-4 py-3 shadow-md">
                <h2 className="font-playfair text-lg">Mesón del Molino</h2>
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-[#E8E4DF] text-sm font-inter"
                >
                    <LogOut size={18} />
                    <span>Salir</span>
                </button>
            </div>

            {/* Bottom nav móvil */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-primario)] text-white border-t border-[var(--color-acento)]">
                <ul className="flex items-center justify-around">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = currentSection === item.id
                        return (
                            <li key={item.id} className="flex-1">
                                <button
                                    onClick={() => onNavClick(item.id)}
                                    className={`w-full flex flex-col items-center py-2 px-1 transition-colors font-inter text-[10px] gap-0.5 ${isActive ? 'text-[var(--color-dorado,#C9A84C)]' : 'text-[#E8E4DF]'}`}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </>
    )
}
