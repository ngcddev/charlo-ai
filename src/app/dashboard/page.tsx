import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BotToggle from './_bot-toggle'

// Stat card component (server-only UI fragment)
function StatCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string | number
  sub?: string
}) {
  return (
    <div className="db-stat-card">
      <p className="db-stat-label">{label}</p>
      <p className="db-stat-value">{value}</p>
      {sub && <p className="db-stat-sub">{sub}</p>}
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Client record
  const { data: client } = await supabase
    .from('clients')
    .select('id, business_name, bot_name, active, created_at, welcome_message')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .single()

  if (!client) {
    // No client yet — nudge to onboarding
    return (
      <div className="db-empty">
        <div className="db-empty-inner">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <rect x="4" y="4" width="40" height="40" rx="10" stroke="#a78bfa" strokeWidth="1.5" />
            <path d="M24 16v16M16 24h16" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h2 className="db-empty-title">Configura tu bot</h2>
          <p className="db-empty-body">Completa el onboarding para activar tu asistente de WhatsApp.</p>
          <a href="/onboarding" className="btn btn-primary">Ir al onboarding</a>
        </div>
      </div>
    )
  }

  // Conversation stats (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const { count: totalConvos } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', client.id)

  const { count: recentConvos } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', client.id)
    .gte('created_at', thirtyDaysAgo)

  // Last 5 conversations
  const { data: lastConvos } = await supabase
    .from('conversations')
    .select('id, customer_phone, message, response, response_time_ms, created_at')
    .eq('client_id', client.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const avgMs =
    lastConvos && lastConvos.length > 0
      ? Math.round(
          lastConvos.reduce((acc, c) => acc + (c.response_time_ms ?? 0), 0) /
            lastConvos.length
        )
      : 0

  function formatDate(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function maskPhone(phone: string) {
    if (phone.length <= 4) return phone
    return '•••• ' + phone.slice(-4)
  }

  return (
    <div className="db-page">
      {/* Header */}
      <div className="db-page-header">
        <div>
          <h1 className="db-page-title">Panel</h1>
          <p className="db-page-sub">
            {client.business_name} · <span className="db-page-bot">{client.bot_name}</span>
          </p>
        </div>
        <a href="/dashboard/settings" className="btn btn-outline btn-sm">
          Configurar bot
        </a>
      </div>

      {/* Bot toggle */}
      <BotToggle clientId={client.id} initialActive={client.active ?? false} />

      {/* Stats */}
      <div className="db-stats-grid">
        <StatCard
          label="Conversaciones totales"
          value={(totalConvos ?? 0).toLocaleString('es-CO')}
          sub="desde el inicio"
        />
        <StatCard
          label="Últimos 30 días"
          value={(recentConvos ?? 0).toLocaleString('es-CO')}
          sub="conversaciones recientes"
        />
        <StatCard
          label="Tiempo medio de respuesta"
          value={avgMs > 0 ? `${(avgMs / 1000).toFixed(1)}s` : '—'}
          sub="últimas 5 conversaciones"
        />
      </div>

      {/* Recent conversations */}
      <section className="db-section">
        <h2 className="db-section-title">Conversaciones recientes</h2>

        {(!lastConvos || lastConvos.length === 0) ? (
          <div className="db-no-convos">
            <p>Aún no hay conversaciones. Cuando tu bot reciba mensajes aparecerán aquí.</p>
          </div>
        ) : (
          <div className="db-convo-list">
            {lastConvos.map(c => (
              <div key={c.id} className="db-convo-card">
                <div className="db-convo-meta">
                  <span className="db-convo-phone">{maskPhone(c.customer_phone)}</span>
                  <span className="db-convo-date">{formatDate(c.created_at)}</span>
                </div>
                <p className="db-convo-msg">
                  <span className="db-convo-role user">Cliente:</span> {c.message}
                </p>
                {c.response && (
                  <p className="db-convo-msg">
                    <span className="db-convo-role bot">Bot:</span> {c.response}
                  </p>
                )}
                {c.response_time_ms > 0 && (
                  <span className="db-convo-time">{(c.response_time_ms / 1000).toFixed(2)}s</span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
