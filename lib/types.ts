export interface Paquete {
  id: string
  nombre: string
  descripcion: string
  foto_url: string
  precio_fijo: string
  personas_min: number
  personas_max: number
  incluye: string
  activo: boolean
  orden: number
}

export interface Reserva {
  id?: string
  nombre_cliente: string
  telefono: string
  fecha: string
  hora: string
  personas: number
  tipo: 'Mesa' | 'Evento'
  paquete_id?: string
  precio_estimado?: string
  estado: 'Planeada' | 'Confirmada' | 'Agendada' | 'Cancelada'
  notas_admin?: string
  fecha_creacion?: string
}

export interface Configuracion {
  id: string
  nombre_negocio: string
  telefono_wa: string
  instagram: string
  logo_url: string
  hero_foto_url: string
  tagline: string
  direccion: string
  horarios: string
}
