/* eslint-disable @typescript-eslint/no-explicit-any */
import Airtable from 'airtable'
import { Paquete, Reserva, Configuracion } from './types'

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID!)

const tablaPaquetes = base(process.env.AIRTABLE_TABLE_PAQUETES!)
const tablaReservas = base(process.env.AIRTABLE_TABLE_RESERVAS!)
const tablaConfiguracion = base(process.env.AIRTABLE_TABLE_CONFIGURACION!)

// ─── PAQUETES ───────────────────────────────────────────

export async function getPaquetes(): Promise<Paquete[]> {
  const records = await tablaPaquetes.select({
    filterByFormula: '{Activo} = 1',
    sort: [{ field: 'Orden', direction: 'asc' }]
  }).all()

  return records.map(r => ({
    id: r.id,
    nombre: r.get('Nombre') as string || '',
    descripcion: r.get('Descripcion') as string || '',
    foto_url: r.get('Foto_URL') as string || '',
    precio_fijo: r.get('Precio_Fijo') as string || '0',
    personas_min: r.get('Personas_Min') as number || 0,
    personas_max: r.get('Personas_Max') as number || 0,
    incluye: r.get('Incluye') as string || '',
    activo: r.get('Activo') as boolean || false,
    orden: r.get('Orden') as number || 0,
  }))
}

export async function getAllPaquetes(): Promise<Paquete[]> {
  const records = await tablaPaquetes.select({
    sort: [{ field: 'Orden', direction: 'asc' }]
  }).all()

  return records.map(r => ({
    id: r.id,
    nombre: r.get('Nombre') as string || '',
    descripcion: r.get('Descripcion') as string || '',
    foto_url: r.get('Foto_URL') as string || '',
    precio_fijo: r.get('Precio_Fijo') as string || '0',
    personas_min: r.get('Personas_Min') as number || 0,
    personas_max: r.get('Personas_Max') as number || 0,
    incluye: r.get('Incluye') as string || '',
    activo: r.get('Activo') as boolean || false,
    orden: r.get('Orden') as number || 0,
  }))
}

export async function createPaquete(data: Omit<Paquete, 'id'>): Promise<Paquete> {
  const record = await tablaPaquetes.create({
    Nombre: data.nombre,
    Descripcion: data.descripcion,
    Foto_URL: data.foto_url,
    Precio_Fijo: data.precio_fijo,
    Personas_Min: data.personas_min,
    Personas_Max: data.personas_max,
    Incluye: data.incluye,
    Activo: data.activo,
    Orden: data.orden,
  })
  return { id: record.id, ...data }
}

export async function updatePaquete(id: string, data: Partial<Omit<Paquete, 'id'>>): Promise<void> {
  const fields: Record<string, any> = {}
  if (data.nombre !== undefined) fields['Nombre'] = data.nombre
  if (data.descripcion !== undefined) fields['Descripcion'] = data.descripcion
  if (data.foto_url !== undefined) fields['Foto_URL'] = data.foto_url
  if (data.precio_fijo !== undefined) fields['Precio_Fijo'] = data.precio_fijo
  if (data.personas_min !== undefined) fields['Personas_Min'] = data.personas_min
  if (data.personas_max !== undefined) fields['Personas_Max'] = data.personas_max
  if (data.incluye !== undefined) fields['Incluye'] = data.incluye
  if (data.activo !== undefined) fields['Activo'] = data.activo
  if (data.orden !== undefined) fields['Orden'] = data.orden
  await tablaPaquetes.update(id, fields)
}

export async function deletePaquete(id: string): Promise<void> {
  await tablaPaquetes.destroy(id)
}

// ─── RESERVAS ───────────────────────────────────────────

export async function getReservas(): Promise<Reserva[]> {
  const records = await tablaReservas.select({
    sort: [{ field: 'Fecha', direction: 'desc' }]
  }).all()

  return records.map(r => ({
    id: r.id,
    nombre_cliente: r.get('Nombre_Cliente') as string || '',
    telefono: r.get('Telefono') as string || '',
    fecha: r.get('Fecha') as string || '',
    hora: r.get('Hora') as string || '',
    personas: r.get('Personas') as number || 0,
    tipo: r.get('Tipo') as 'Mesa' | 'Evento',
    paquete_id: (r.get('Paquetes') as string[])?.[0] || undefined,
    precio_estimado: r.get('Precio_Estimado') as string || undefined,
    estado: r.get('Estado') as 'Planeada' | 'Confirmada' | 'Agendada' | 'Cancelada',
    notas_admin: r.get('Notas_Admin') as string || undefined,
    fecha_creacion: r.get('Fecha_Creacion') as string || undefined,
  }))
}

export async function createReserva(data: Omit<Reserva, 'id' | 'fecha_creacion'>): Promise<Reserva> {
  const fields: Record<string, any> = {
    Nombre_Cliente: data.nombre_cliente,
    Telefono: data.telefono,
    Fecha: data.fecha,
    Hora: data.hora,
    Personas: data.personas,
    Tipo: data.tipo,
    Estado: data.estado,
  }
  if (data.paquete_id) fields['Paquetes'] = [data.paquete_id]
  if (data.precio_estimado) fields['Precio_Estimado'] = data.precio_estimado
  if (data.notas_admin) fields['Notas_Admin'] = data.notas_admin

  console.log('Campos enviando a Airtable:', JSON.stringify(fields, null, 2))

  const record = await tablaReservas.create(fields)
  return { id: record.id, ...data }
}

export async function updateReserva(id: string, data: Partial<Omit<Reserva, 'id' | 'fecha_creacion'>>): Promise<void> {
  const fields: Record<string, any> = {}
  if (data.nombre_cliente !== undefined) fields['Nombre_Cliente'] = data.nombre_cliente
  if (data.telefono !== undefined) fields['Telefono'] = data.telefono
  if (data.fecha !== undefined) fields['Fecha'] = data.fecha
  if (data.hora !== undefined) fields['Hora'] = data.hora
  if (data.personas !== undefined) fields['Personas'] = data.personas
  if (data.tipo !== undefined) fields['Tipo'] = data.tipo
  if (data.paquete_id !== undefined) fields['Paquetes'] = [data.paquete_id]
  if (data.precio_estimado !== undefined) fields['Precio_Estimado'] = data.precio_estimado
  if (data.estado !== undefined) fields['Estado'] = data.estado
  if (data.notas_admin !== undefined) fields['Notas_Admin'] = data.notas_admin
  await tablaReservas.update(id, fields)
}

export async function deleteReserva(id: string): Promise<void> {
  await tablaReservas.destroy(id)
}

// ─── CONFIGURACION ──────────────────────────────────────

export async function getConfiguracion(): Promise<Configuracion | null> {
  const records = await tablaConfiguracion.select({ maxRecords: 1 }).all()
  if (records.length === 0) return null
  const r = records[0]
  return {
    id: r.id,
    nombre_negocio: r.get('Nombre_Negocio') as string || '',
    telefono_wa: r.get('Telefono_WA') as string || '',
    instagram: r.get('Instagram') as string || '',
    logo_url: r.get('Logo_URL') as string || '',
    hero_foto_url: r.get('Hero_Foto_URL') as string || '',
    tagline: r.get('Tagline') as string || '',
    direccion: r.get('Direccion') as string || '',
    horarios: r.get('Horarios') as string || '',
    color_primario: r.get('Color_Primario') as string || '#1F3D2B',
    color_secundario: r.get('Color_Secundario') as string || '#C9A227',
    color_acento: r.get('Color_Acento') as string || '#3F6F4E',
  }
}

export async function updateConfiguracion(id: string, data: Partial<Omit<Configuracion, 'id'>>): Promise<void> {
  const fields: Record<string, any> = {}
  if (data.nombre_negocio !== undefined) fields['Nombre_Negocio'] = data.nombre_negocio
  if (data.telefono_wa !== undefined) fields['Telefono_WA'] = data.telefono_wa
  if (data.instagram !== undefined) fields['Instagram'] = data.instagram
  if (data.logo_url !== undefined) fields['Logo_URL'] = data.logo_url
  if (data.hero_foto_url !== undefined) fields['Hero_Foto_URL'] = data.hero_foto_url
  if (data.tagline !== undefined) fields['Tagline'] = data.tagline
  if (data.direccion !== undefined) fields['Direccion'] = data.direccion
  if (data.horarios !== undefined) fields['Horarios'] = data.horarios
  if (data.color_primario !== undefined) fields['Color_Primario'] = data.color_primario
  if (data.color_secundario !== undefined) fields['Color_Secundario'] = data.color_secundario
  if (data.color_acento !== undefined) fields['Color_Acento'] = data.color_acento
  await tablaConfiguracion.update(id, fields)
}
