import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SettingsForm from './settings-form'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .single()

  if (!client) {
    return (
      <div className="db-page">
        <div className="db-page-header">
          <h1 className="db-page-title">Configuración</h1>
        </div>
        <div className="db-empty">
          <div className="db-empty-inner">
            <p className="db-empty-body">No tienes un bot configurado todavía.</p>
            <a href="/onboarding" className="btn btn-primary">Completar onboarding</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="db-page">
      <div className="db-page-header">
        <div>
          <h1 className="db-page-title">Configuración</h1>
          <p className="db-page-sub">Ajusta los datos y personalidad de tu bot</p>
        </div>
      </div>

      <SettingsForm client={client} />
    </div>
  )
}
