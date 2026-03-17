import { NextRequest, NextResponse } from 'next/server'
import { getConfiguracion, updateConfiguracion } from '@/lib/airtable'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const config = await getConfiguracion()
    return NextResponse.json(config)
  } catch {
    return NextResponse.json({ error: 'Error al obtener configuración' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }
    await updateConfiguracion(id, data)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Error actualizando configuración:', e)
    return NextResponse.json({ error: 'Error al actualizar configuración' }, { status: 500 })
  }
}
