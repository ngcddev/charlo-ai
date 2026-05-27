import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardSidebar from './_sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch client record for sidebar header
  const { data: client } = await supabase
    .from('clients')
    .select('id, business_name, bot_name, active')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .single()

  return (
    <div className="db-shell">
      <DashboardSidebar
        clientId={client?.id ?? null}
        businessName={client?.business_name ?? 'Mi negocio'}
        botName={client?.bot_name ?? 'Bot'}
        userEmail={user.email ?? ''}
      />
      <main className="db-main">{children}</main>
    </div>
  )
}
