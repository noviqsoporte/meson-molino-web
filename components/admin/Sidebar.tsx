import { LayoutDashboard, CalendarDays, PartyPopper, Package, Settings, LogOut } from 'lucide-react'

export type Section = 'dashboard' | 'reservas' | 'eventos' | 'paquetes' | 'configuracion'

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
        { id: 'reservas', label: 'Reservas de Mesa', icon: CalendarDays },
        { id: 'eventos', label: 'Eventos', icon: PartyPopper },
        { id: 'paquetes', label: 'Paquetes', icon: Package },
        { id: 'configuracion', label: 'Configuración', icon: Settings },
    ] as const

    return (
        <div className="w-64 bg-[var(--color-primario)] text-white flex flex-col h-screen sticky top-0">
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
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-inter ${isActive ? 'bg-[var(--color-acento)] text-white' : 'text-[#E8E4DF] hover:bg-[var(--color-acento)] hover:text-white'
                                        }`}
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
    )
}
