import { NextRequest, NextResponse } from 'next/server'
import { findSuscriptor, createSuscriptor, getSuscriptoresCount } from '@/lib/airtable'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const count = await getSuscriptoresCount()
    return NextResponse.json({ count })
  } catch {
    return NextResponse.json({ error: 'Error al obtener suscriptores' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { correo } = await req.json()
    if (!correo) return NextResponse.json({ error: 'Correo requerido' }, { status: 400 })

    const existe = await findSuscriptor(correo)
    if (!existe) await createSuscriptor(correo)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error al registrar suscriptor' }, { status: 500 })
  }
}
