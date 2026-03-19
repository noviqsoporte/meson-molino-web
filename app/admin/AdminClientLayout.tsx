'use client'

import { useState } from 'react'
import LoginForm from '@/components/admin/LoginForm'
import Sidebar from '@/components/admin/Sidebar'
import DashboardHome from '@/components/admin/DashboardHome'
import ReservasAdmin from '@/components/admin/ReservasAdmin'
import EventosAdmin from '@/components/admin/EventosAdmin'
import PaquetesAdmin from '@/components/admin/PaquetesAdmin'
import ConfiguracionAdmin from '@/components/admin/ConfiguracionAdmin'
import type { Section } from '@/components/admin/Sidebar'
import { Paquete } from '@/lib/types'

interface AdminClientLayoutProps {
    hasSession: boolean
    paquetes: Paquete[]
}

export default function AdminClientLayout({ hasSession, paquetes }: AdminClientLayoutProps) {
    const [currentSection, setCurrentSection] = useState<Section>('dashboard')

    if (!hasSession) {
        return <LoginForm />
    }

    const renderSection = () => {
        switch (currentSection) {
            case 'dashboard':
                return <DashboardHome />
            case 'reservas':
                return <ReservasAdmin paquetes={paquetes} />
            case 'eventos':
                return <EventosAdmin />
            case 'paquetes':
                return <PaquetesAdmin />
            case 'configuracion':
                return <ConfiguracionAdmin />
            default:
                return <DashboardHome />
        }
    }

    return (
        <div className="flex min-h-screen bg-[#F7F5F2]">
            <Sidebar currentSection={currentSection} onNavClick={setCurrentSection} />
            <main className="flex-1 overflow-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    {renderSection()}
                </div>
            </main>
        </div>
    )
}
