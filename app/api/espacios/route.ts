import { NextRequest, NextResponse } from 'next/server'
import { getAllEspacios, createEspacio, updateEspacio, deleteEspacio } from '@/lib/airtable'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const espacios = await getAllEspacios()
    return NextResponse.json(espacios)
  } catch {
    return NextResponse.json({ error: 'Error al obtener espacios' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const espacio = await createEspacio(body)
    return NextResponse.json(espacio, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al crear espacio' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...data } = body
    await updateEspacio(id, data)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error al actualizar espacio' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    await deleteEspacio(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar espacio' }, { status: 500 })
  }
}
