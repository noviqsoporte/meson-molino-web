import { NextResponse } from 'next/server'
import { getPromociones } from '@/lib/airtable'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const promociones = await getPromociones()
    return NextResponse.json(promociones)
  } catch {
    return NextResponse.json({ error: 'Error al obtener promociones' }, { status: 500 })
  }
}
