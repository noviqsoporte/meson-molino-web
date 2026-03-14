import { NextRequest, NextResponse } from 'next/server'
import { getConfiguracion, updateConfiguracion } from '@/lib/airtable'

export async function GET() {
  try {
    const config = await getConfiguracion()
    return NextResponse.json(config)
  } catch {
    return NextResponse.json({ error: 'Error al obtener configuración' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...data } = body
    await updateConfiguracion(id, data)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error al actualizar configuración' }, { status: 500 })
  }
}
