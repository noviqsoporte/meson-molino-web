export interface Paquete {
  id: string
  nombre: string
  descripcion: string
  foto_url: string
  foto_url_2?: string
  foto_url_3?: string
  precio_por_persona: string
  tipo: 'Evento' | 'Buffet'
  precio_nino?: string
  horario?: string
  personas_min: number
  personas_max: number
  incluye: string
  activo: boolean
  orden: number
}

export interface Espacio {
  id: string
  nombre: string
  descripcion: string
  foto_url_1: string
  foto_url_2: string
  foto_url_3: string
  seccion: 'Restaurante' | 'Salon'
  orden: number
  activo: boolean
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

export interface Promocion {
  id: string
  titulo: string
  foto_url: string
  vigencia_hasta: string
  activo: boolean
  orden: number
}

export interface Suscriptor {
  id: string
  correo: string
  fecha_registro: string
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
  color_primario?: string
  color_secundario?: string
  color_acento?: string
  correo_contacto?: string
}
