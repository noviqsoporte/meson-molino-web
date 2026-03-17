import { NextRequest, NextResponse } from 'next/server'
import { getAllPaquetes, createPaquete, updatePaquete, deletePaquete } from '@/lib/airtable'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const paquetes = await getAllPaquetes()
    return NextResponse.json(paquetes)
  } catch {
    return NextResponse.json({ error: 'Error al obtener paquetes' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const paquete = await createPaquete(body)
    return NextResponse.json(paquete, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al crear paquete' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...data } = body
    await updatePaquete(id, data)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error al actualizar paquete' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    await deletePaquete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar paquete' }, { status: 500 })
  }
}
