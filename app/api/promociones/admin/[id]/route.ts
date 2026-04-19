import { NextRequest, NextResponse } from 'next/server'
import { updatePromocion, deletePromocion } from '@/lib/airtable'

export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    await updatePromocion(params.id, body)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error al actualizar promocion' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deletePromocion(params.id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar promocion' }, { status: 500 })
  }
}
