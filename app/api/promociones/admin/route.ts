import { NextRequest, NextResponse } from 'next/server'
import { getAllPromociones, createPromocion } from '@/lib/airtable'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const promociones = await getAllPromociones()
    return NextResponse.json(promociones)
  } catch {
    return NextResponse.json({ error: 'Error al obtener promociones' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const promocion = await createPromocion(body)
    return NextResponse.json(promocion, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al crear promocion' }, { status: 500 })
  }
}
