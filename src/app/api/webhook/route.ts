import type { NextRequest } from 'next/server'
import { getClientConfig } from '@/lib/supabase'
import { generateResponse } from '@/lib/groq'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

function buildSystemPrompt(config: Awaited<ReturnType<typeof getClientConfig>> & object): string {
  const faqsText = config.faqs
    .map((f) => `P: ${f.question}\nR: ${f.answer}`)
    .join('\n\n')

  return `Eres el asistente virtual de ${config.business_name}, un negocio del sector ${config.sector} en Colombia.

Tono: ${config.tone}
Horario de atención: ${config.schedule}

Preguntas frecuentes:
${faqsText}

Instrucciones:
- Responde siempre en español colombiano, de forma clara y concisa.
- Si no conoces la respuesta, invita al usuario a comunicarse en horario de atención.
- No inventes información que no esté en las FAQ o el contexto dado.
- Mantén el tono indicado en todo momento.`
}

interface WhatsAppMessage {
  from: string
  text?: { body: string }
  type: string
}

interface WebhookEntry {
  changes: {
    value: {
      messages?: WhatsAppMessage[]
      metadata?: { phone_number_id: string }
    }
  }[]
}

interface WebhookPayload {
  object: string
  entry: WebhookEntry[]
}

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = request.nextUrl

  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 })
  }

  return new Response('Forbidden', { status: 403 })
}

export async function POST(request: NextRequest): Promise<Response> {
  let payload: WebhookPayload

  try {
    payload = await request.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  if (payload.object !== 'whatsapp_business_account') {
    return new Response('Not a WhatsApp event', { status: 400 })
  }

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value
      const messages = value.messages ?? []

      for (const msg of messages) {
        if (msg.type !== 'text' || !msg.text?.body) continue

        const userPhone = msg.from
        const userText = msg.text.body
        const phoneNumberId = value.metadata?.phone_number_id

        if (!phoneNumberId) {
          console.warn('Webhook message missing metadata.phone_number_id — skipping')
          continue
        }

        try {
          const config = await getClientConfig(phoneNumberId)

          if (!config) {
            console.warn(`No client config found for phone_number_id: ${phoneNumberId}`)
            continue
          }

          const systemPrompt = buildSystemPrompt(config)

          const reply = await generateResponse(systemPrompt, userText, [])

          console.log('Groq response:', reply)

          console.log('Token prefix:', process.env.META_WHATSAPP_TOKEN?.substring(0, 20))
          await sendWhatsAppMessage(
            userPhone,
            reply,
            config.whatsapp_phone_number_id,
            config.whatsapp_access_token
          )
        } catch (err) {
          console.error(`Error processing message from ${userPhone}:`, err)
        }
      }
    }
  }

  return new Response('OK', { status: 200 })
}
