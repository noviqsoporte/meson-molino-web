'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Configuracion } from '@/lib/types'

export default function Navbar({ config }: { config: Configuracion | null }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const nombreRestaurante = config?.nombre_negocio || 'El Mesón del Molino'

  return (
    <nav
      className={`fixed w-full z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-brand-dark shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <a href="#" className="font-playfair text-white text-2xl font-bold tracking-wider">
              {nombreRestaurante}
            </a>
          </div>
          
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
            <a href="#paquetes" className="text-white hover:text-brand-gold px-3 py-2 text-sm font-medium transition-colors">
              Paquetes
            </a>
            <a href="#reserva-mesa" className="text-white hover:text-brand-gold px-3 py-2 text-sm font-medium transition-colors">
              Reservar Mesa
            </a>
          </div>
          
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-brand-gold focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-dark shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#paquetes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-brand-gold block px-3 py-2 rounded-md text-base font-medium"
            >
              Paquetes
            </a>
            <a
              href="#reserva-mesa"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-brand-gold block px-3 py-2 rounded-md text-base font-medium"
            >
              Reservar Mesa
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
