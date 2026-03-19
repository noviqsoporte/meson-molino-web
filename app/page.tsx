import { Paquete, Configuracion } from '@/lib/types'
import { getPaquetes, getConfiguracion } from '@/lib/airtable'
import Navbar from '@/components/public/Navbar'
import HeroSection from '@/components/public/HeroSection'
import PaquetesSection from '@/components/public/PaquetesSection'
import ReservaMesaForm from '@/components/public/ReservaMesaForm'
import CotizarEventoForm from '@/components/public/CotizarEventoForm'
import Footer from '@/components/public/Footer'
import FloatingButtons from '@/components/public/FloatingButtons'

// Ensures the page is dynamically rendered for fresh data, equivalent to cache: 'no-store'
export const dynamic = 'force-dynamic'

export default async function Home() {
  let paquetes: Paquete[] = []
  let config: Configuracion | null = null

  try {
    // Usamos las funciones de lib/airtable directamente en lugar de un fetch con URL absoluta
    // para evitar problemas de resolución de host en diferentes entornos (dev vs prod).
    // getPaquetes() ya incluye el filtro `{Activo} = 1`.
    const [paqData, confData] = await Promise.all([
      getPaquetes(),
      getConfiguracion()
    ])
    paquetes = paqData
    config = confData
  } catch (error) {
    console.error('Error fetching data from Airtable:', error)
  }

  return (
    <>
      <Navbar config={config} />
      
      <main>
        <HeroSection config={config} />
        
        {paquetes.length > 0 ? (
          <PaquetesSection paquetes={paquetes} telefonoWa={config?.telefono_wa} />
        ) : (
          <div className="py-20 text-center bg-brand-bg">
            <p className="text-gray-500">No hay paquetes disponibles en este momento.</p>
          </div>
        )}
        
        <section id="reserva-mesa" className="py-20 md:py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
              
              {/* Formulario Reserva de Mesa */}
              <div className="opacity-0-init animate-slide-up-fade" style={{ animationDelay: '100ms' }}>
                <ReservaMesaForm />
              </div>
              
              {/* Formulario Cotizar Evento */}
              <div className="opacity-0-init animate-slide-up-fade" style={{ animationDelay: '300ms' }}>
                <CotizarEventoForm paquetes={paquetes} />
              </div>
              
            </div>
          </div>
        </section>
      </main>

      <Footer config={config} />
      <FloatingButtons config={config} />
    </>
  )
}
