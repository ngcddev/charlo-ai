import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateSystemPrompt, type OnboardingConfig } from '@/lib/prompt-generator'

// ── Request body shape ────────────────────────────────────
interface OnboardingBody {
  businessName: string
  sector: string
  city: string
  whatsappNumber: string
  description: string
  schedule: string
  address: string
  website?: string
  contactEmail: string
  botName: string
  tone: string
  welcomeMessage: string
  faqs: { question: string; answer: string }[]
}

const REQUIRED: (keyof Omit<OnboardingBody, 'website' | 'faqs'>)[] = [
  'businessName',
  'sector',
  'city',
  'whatsappNumber',
  'description',
  'schedule',
  'address',
  'contactEmail',
  'botName',
  'tone',
  'welcomeMessage',
]

// ── POST /api/onboarding ──────────────────────────────────
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Parse body
  let body: OnboardingBody
  try {
    body = (await request.json()) as OnboardingBody
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  // Validate required fields
  for (const field of REQUIRED) {
    const val = body[field]
    if (!val || String(val).trim() === '') {
      return NextResponse.json(
        { error: `Campo requerido: ${field}` },
        { status: 400 }
      )
    }
  }

  // Build config
  const config: OnboardingConfig = {
    businessName:   body.businessName.trim(),
    sector:         body.sector.trim(),
    city:           body.city.trim(),
    whatsappNumber: body.whatsappNumber.trim(),
    description:    body.description.trim(),
    schedule:       body.schedule.trim(),
    address:        body.address.trim(),
    website:        body.website?.trim() ?? '',
    contactEmail:   body.contactEmail.trim(),
    botName:        body.botName.trim(),
    tone:           body.tone.trim(),
    welcomeMessage: body.welcomeMessage.trim(),
    faqs: (body.faqs ?? []).filter(
      (f) => f.question?.trim() && f.answer?.trim()
    ),
  }

  // Generate system prompt
  const systemPrompt = generateSystemPrompt(config)

  // Service-role client — bypasses RLS; server-side only
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from('clients')
    .insert({
      phone_number:             config.whatsappNumber,
      business_name:            config.businessName,
      sector:                   config.sector,
      city:                     config.city,
      description:              config.description,
      schedule:                 config.schedule,
      address:                  config.address,
      website:                  config.website || null,
      contact_email:            config.contactEmail,
      bot_name:                 config.botName,
      tone:                     config.tone,
      welcome_message:          config.welcomeMessage,
      faqs:                     config.faqs,
      system_prompt:            systemPrompt,
      // WhatsApp API credentials — set after connecting via Meta dashboard
      whatsapp_phone_number_id: '',
      whatsapp_access_token:    '',
      // Bot starts inactive until WhatsApp is connected
      active:                   false,
    })
    .select('id')
    .single()

  if (error) {
    // Duplicate phone_number
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Este número de WhatsApp ya está registrado.' },
        { status: 409 }
      )
    }
    console.error('[onboarding] Supabase error:', error.message)
    return NextResponse.json(
      { error: 'Error al guardar la configuración. Intenta de nuevo.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ clientId: data.id }, { status: 201 })
}
