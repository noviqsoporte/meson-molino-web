import { Paquete } from '@/lib/types'
import PaqueteCard from './PaqueteCard'

export default function PaquetesSection({ paquetes, telefonoWa }: { paquetes: Paquete[]; telefonoWa?: string }) {
  if (!paquetes || paquetes.length === 0) return null

  return (
    <section id="paquetes" className="py-20 md:py-24 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 opacity-0-init animate-slide-up-fade">
          <h2 className="font-playfair text-4xl md:text-5xl text-brand-dark mb-4">
            Nuestros Paquetes
          </h2>
          <p className="text-brand-olive text-lg max-w-2xl mx-auto">
            Celebra con nosotros. Tenemos opciones diseñadas a la medida de tus eventos sociales y corporativos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-lg md:max-w-none mx-auto">
          {paquetes.map((paquete, idx) => (
            <div key={paquete.id} style={{ animationDelay: `${(idx % 3) * 100 + 100}ms` }} className="opacity-0-init animate-slide-up-fade h-full">
              <PaqueteCard paquete={paquete} telefonoWa={telefonoWa} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

