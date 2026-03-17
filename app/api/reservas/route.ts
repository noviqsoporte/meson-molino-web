import { NextRequest, NextResponse } from 'next/server'
import { getReservas, createReserva, updateReserva, deleteReserva } from '@/lib/airtable'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const reservas = await getReservas()
    return NextResponse.json(reservas)
  } catch {
    return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    if (body.tipo === 'Evento' && !body.paquete_id) {
      return NextResponse.json({ error: 'paquete_id es obligatorio para tipo Evento' }, { status: 400 })
    }
    
    const reserva = await createReserva(body)
    return NextResponse.json(reserva, { status: 201 })
  } catch (e: unknown) {
    console.error('Error detallado:', e)
    return NextResponse.json({ error: 'Error al crear reserva' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...data } = body
    await updateReserva(id, data)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error al actualizar reserva' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    await deleteReserva(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar reserva' }, { status: 500 })
  }
}
