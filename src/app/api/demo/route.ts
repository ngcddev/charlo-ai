import { NextRequest, NextResponse } from 'next/server'
import { generateResponse, type Message } from '@/lib/groq'

interface DemoRequestBody {
  messages: { role: string; content: string }[]
  system: string
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: DemoRequestBody
  try {
    body = await request.json() as DemoRequestBody
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const { messages, system } = body
  if (!messages?.length || !system) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  // The last message is always the user's current message
  const last = messages[messages.length - 1]
  if (!last || last.role !== 'user') {
    return NextResponse.json({ error: 'El último mensaje debe ser del usuario' }, { status: 400 })
  }

  // Build history (everything except the last user message)
  const history: Message[] = messages.slice(0, -1).map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content,
  }))

  try {
    const reply = await generateResponse(system, last.content, history)
    return NextResponse.json({ reply })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
