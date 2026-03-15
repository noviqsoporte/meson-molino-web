import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  if (password === process.env.ADMIN_PASSWORD) {
    const res = NextResponse.json({ success: true })
    res.cookies.set('admin_session', 'true', {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7 // 7 días
    })
    return res
  }
  return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete('admin_session')
  return res
}
