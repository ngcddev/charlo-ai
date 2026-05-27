import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { generateSystemPrompt, type OnboardingConfig } from '@/lib/prompt-generator'

type Params = { id: string }

// ── GET /api/clients/[id] ────────────────────────────────
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<Params> }
): Promise<NextResponse> {
  const { id } = await params
  const supabase = await createServerSupabase()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id) // ownership check in addition to RLS
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
  }

  return NextResponse.json(data)
}

// ── PUT /api/clients/[id] ────────────────────────────────
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<Params> }
): Promise<NextResponse> {
  const { id } = await params
  const supabase = await createServerSupabase()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  // Parse body
  let body: Partial<OnboardingConfig> & { active?: boolean }
  try {
    body = await request.json() as Partial<OnboardingConfig> & { active?: boolean }
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  // Verify ownership before mutating — use service_role to bypass RLS for the check
  const service = createServiceSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: existing } = await service
    .from('clients')
    .select('id, user_id')
    .eq('id', id)
    .single()

  if (!existing || existing.user_id !== user.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  // Build update payload
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }

  if (body.businessName !== undefined)   updates.business_name    = body.businessName.trim()
  if (body.sector        !== undefined)   updates.sector           = body.sector.trim()
  if (body.city          !== undefined)   updates.city             = body.city.trim()
  if (body.description   !== undefined)   updates.description      = body.description.trim()
  if (body.schedule      !== undefined)   updates.schedule         = body.schedule.trim()
  if (body.address       !== undefined)   updates.address          = body.address.trim()
  if (body.website       !== undefined)   updates.website          = body.website?.trim() || null
  if (body.contactEmail  !== undefined)   updates.contact_email    = body.contactEmail.trim()
  if (body.botName       !== undefined)   updates.bot_name         = body.botName.trim()
  if (body.tone          !== undefined)   updates.tone             = body.tone.trim()
  if (body.welcomeMessage !== undefined)  updates.welcome_message  = body.welcomeMessage.trim()
  if (body.faqs          !== undefined)   updates.faqs             = body.faqs
  if (body.active        !== undefined)   updates.active           = body.active

  // Regenerate system_prompt if any bot config changed
  const configFields: (keyof OnboardingConfig)[] = [
    'businessName', 'sector', 'city', 'description', 'schedule',
    'address', 'website', 'contactEmail', 'botName', 'tone', 'welcomeMessage', 'faqs',
  ]
  const shouldRegenerate = configFields.some((f) => body[f] !== undefined)

  if (shouldRegenerate) {
    // Fetch the full current record to merge with updates
    const { data: current } = await service
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()

    if (current) {
      const config: OnboardingConfig = {
        businessName:   (updates.business_name   as string)  ?? current.business_name   ?? '',
        sector:         (updates.sector          as string)  ?? current.sector           ?? '',
        city:           (updates.city            as string)  ?? current.city             ?? '',
        whatsappNumber: current.phone_number,
        description:    (updates.description     as string)  ?? current.description      ?? '',
        schedule:       (updates.schedule        as string)  ?? current.schedule         ?? '',
        address:        (updates.address         as string)  ?? current.address          ?? '',
        website:        (updates.website         as string)  ?? current.website          ?? '',
        contactEmail:   (updates.contact_email   as string)  ?? current.contact_email    ?? '',
        botName:        (updates.bot_name        as string)  ?? current.bot_name         ?? '',
        tone:           (updates.tone            as string)  ?? current.tone             ?? 'warm',
        welcomeMessage: (updates.welcome_message as string)  ?? current.welcome_message  ?? '',
        faqs:           (updates.faqs            as OnboardingConfig['faqs']) ?? current.faqs ?? [],
      }
      updates.system_prompt = generateSystemPrompt(config)
    }
  }

  const { data: updated, error: updateError } = await service
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (updateError) {
    console.error('[clients PUT] Supabase error:', updateError.message)
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }

  return NextResponse.json(updated)
}
