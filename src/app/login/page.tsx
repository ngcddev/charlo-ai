'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  // If already logged in, redirect immediately
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/dashboard')
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: signInError } = await signIn(email.trim(), password)

    if (signInError) {
      setError('Correo o contraseña incorrectos.')
      setLoading(false)
      return
    }

    router.replace('/dashboard')
  }

  return (
    <div className="login-wrap">
      <div className="login-bg-grid" aria-hidden="true" />

      <div className="login-card">
        {/* Logo */}
        <a href="/" className="login-brand">
          <svg width="26" height="32" viewBox="0 0 26 32" fill="none" aria-hidden="true">
            <path d="M13 2L24 8V20L13 26L2 20V8L13 2Z" stroke="#a78bfa" strokeWidth="1.5" fill="none" />
            <circle cx="13" cy="14" r="3.5" fill="#a78bfa" />
            <path d="M13 17.5V22" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>Charló</span>
        </a>

        <h1 className="login-title">Bienvenido de vuelta</h1>
        <p className="login-sub">Accede a tu panel de control</p>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="lf-field">
            <label className="lf-label" htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="lf-input"
              placeholder="tu@empresa.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="lf-field">
            <label className="lf-label" htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="lf-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="lf-error" role="alert">{error}</p>}

          <button type="submit" className="lf-submit" disabled={loading}>
            {loading ? (
              <span className="lf-spinner" aria-label="Cargando…" />
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <p className="login-footer">
          ¿No tienes cuenta?{' '}
          <a href="/onboarding" className="login-footer-link">Regístrate gratis</a>
        </p>
      </div>
    </div>
  )
}
