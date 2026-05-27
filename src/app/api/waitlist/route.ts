import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest): Promise<NextResponse> {
  let email: string

  try {
    const body = await request.json()
    email = (body.email ?? '').trim().toLowerCase()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase.from('waitlist').insert({ email })

  if (error) {
    // Duplicate email → tratarlo como éxito para no revelar si ya existe
    if (error.code === '23505') {
      return NextResponse.json({ message: 'Registrado con éxito' }, { status: 200 })
    }
    console.error('[waitlist] Supabase error:', error.message)
    return NextResponse.json({ error: 'Error al registrar el email' }, { status: 500 })
  }

  return NextResponse.json({ message: 'Registrado con éxito' }, { status: 201 })
}
