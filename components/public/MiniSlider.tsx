'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function MiniSlider({ fotos, height = 'h-48' }: { fotos: string[]; height?: string }) {
  const [index, setIndex] = useState(0)

  if (fotos.length === 0) return null

  const handlePrev = () => setIndex((prev) => (prev === 0 ? fotos.length - 1 : prev - 1))
  const handleNext = () => setIndex((prev) => (prev === fotos.length - 1 ? 0 : prev + 1))

  return (
    <div className={`relative w-full ${height} bg-gray-100 overflow-hidden group`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={fotos[index]}
        alt={`Foto ${index + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
      />
      {fotos.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-brand-dark p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-brand-dark p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {fotos.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${i === index ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
