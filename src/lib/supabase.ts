import { createClient } from '@supabase/supabase-js'

// DEBUG TEMPORAL — eliminar antes de hacer deploy
console.log('[supabase debug] URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 20))
console.log('[supabase debug] SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 20))

export interface ClientConfig {
  id: string
  phone_number: string
  business_name: string
  sector: string
  tone: string
  faqs: { question: string; answer: string }[]
  schedule: string
  whatsapp_phone_number_id: string
  whatsapp_access_token: string
}

// Service-role client: bypasses RLS — solo usar en server-side (webhook, jobs)
// Nunca exponer SUPABASE_SERVICE_ROLE_KEY en variables NEXT_PUBLIC_
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function getClientConfig(phoneNumber: string): Promise<ClientConfig | null> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('phone_number', phoneNumber)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`Supabase error: ${error.message}`)
  }

  return data as ClientConfig
}
