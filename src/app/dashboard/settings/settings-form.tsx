'use client'

import { useState } from 'react'

// Mirror the columns we care about from the DB row
interface ClientRow {
  id: string
  business_name: string
  sector: string
  city: string
  description: string
  schedule: string
  address: string
  website: string | null
  contact_email: string
  bot_name: string
  tone: string
  welcome_message: string
  faqs: { question: string; answer: string }[] | null
}

interface Props {
  client: ClientRow
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

const TONES = [
  { value: 'warm',         label: 'Cercano y cálido' },
  { value: 'professional', label: 'Profesional' },
  { value: 'fun',          label: 'Divertido y casual' },
  { value: 'formal',       label: 'Formal' },
]

export default function SettingsForm({ client }: Props) {
  const [form, setForm] = useState({
    businessName:   client.business_name   ?? '',
    sector:         client.sector          ?? '',
    city:           client.city            ?? '',
    description:    client.description     ?? '',
    schedule:       client.schedule        ?? '',
    address:        client.address         ?? '',
    website:        client.website         ?? '',
    contactEmail:   client.contact_email   ?? '',
    botName:        client.bot_name        ?? '',
    tone:           client.tone            ?? 'warm',
    welcomeMessage: client.welcome_message ?? '',
    faqs:           (client.faqs ?? []) as { question: string; answer: string }[],
  })

  const [status, setStatus] = useState<SaveStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm(f => ({ ...f, [key]: val }))
    if (status === 'saved' || status === 'error') setStatus('idle')
  }

  function setFaqField(
    idx: number,
    field: 'question' | 'answer',
    val: string
  ) {
    setForm(f => {
      const faqs = [...f.faqs]
      faqs[idx] = { ...faqs[idx], [field]: val }
      return { ...f, faqs }
    })
    if (status === 'saved' || status === 'error') setStatus('idle')
  }

  function addFaq() {
    if (form.faqs.length >= 8) return
    setForm(f => ({ ...f, faqs: [...f.faqs, { question: '', answer: '' }] }))
  }

  function removeFaq(idx: number) {
    setForm(f => ({ ...f, faqs: f.faqs.filter((_, i) => i !== idx) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving')
    setErrorMsg('')

    try {
      const res = await fetch(`/api/clients/${client.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName:   form.businessName,
          sector:         form.sector,
          city:           form.city,
          description:    form.description,
          schedule:       form.schedule,
          address:        form.address,
          website:        form.website || null,
          contactEmail:   form.contactEmail,
          botName:        form.botName,
          tone:           form.tone,
          welcomeMessage: form.welcomeMessage,
          faqs:           form.faqs.filter(f => f.question.trim()),
        }),
      })

      if (!res.ok) {
        const json = (await res.json()) as { error?: string }
        setErrorMsg(json.error ?? 'Error al guardar')
        setStatus('error')
        return
      }

      setStatus('saved')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setErrorMsg('Error de red. Intenta de nuevo.')
      setStatus('error')
    }
  }

  const saving = status === 'saving'

  return (
    <form onSubmit={handleSubmit} className="sf-form" noValidate>
      {/* ── Negocio ──────────────────────────────────────── */}
      <section className="sf-section">
        <h2 className="sf-section-title">Información del negocio</h2>
        <div className="sf-grid2">
          <div className="sf-field">
            <label className="sf-label" htmlFor="sf-business-name">Nombre del negocio</label>
            <input
              id="sf-business-name"
              className="sf-input"
              value={form.businessName}
              onChange={e => set('businessName', e.target.value)}
              required
            />
          </div>
          <div className="sf-field">
            <label className="sf-label" htmlFor="sf-sector">Sector</label>
            <input
              id="sf-sector"
              className="sf-input"
              value={form.sector}
              onChange={e => set('sector', e.target.value)}
              required
            />
          </div>
          <div className="sf-field">
            <label className="sf-label" htmlFor="sf-city">Ciudad</label>
            <input
              id="sf-city"
              className="sf-input"
              value={form.city}
              onChange={e => set('city', e.target.value)}
              required
            />
          </div>
          <div className="sf-field">
            <label className="sf-label" htmlFor="sf-contact-email">Correo de contacto</label>
            <input
              id="sf-contact-email"
              type="email"
              className="sf-input"
              value={form.contactEmail}
              onChange={e => set('contactEmail', e.target.value)}
              required
            />
          </div>
          <div className="sf-field sf-full">
            <label className="sf-label" htmlFor="sf-description">Descripción del negocio</label>
            <textarea
              id="sf-description"
              className="sf-textarea"
              rows={3}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              required
            />
          </div>
          <div className="sf-field">
            <label className="sf-label" htmlFor="sf-address">Dirección</label>
            <input
              id="sf-address"
              className="sf-input"
              value={form.address}
              onChange={e => set('address', e.target.value)}
              required
            />
          </div>
          <div className="sf-field">
            <label className="sf-label" htmlFor="sf-schedule">Horario de atención</label>
            <input
              id="sf-schedule"
              className="sf-input"
              placeholder="Ej: Lun–Vie 8am–6pm"
              value={form.schedule}
              onChange={e => set('schedule', e.target.value)}
              required
            />
          </div>
          <div className="sf-field sf-full">
            <label className="sf-label" htmlFor="sf-website">
              Sitio web <span className="sf-optional">(opcional)</span>
            </label>
            <input
              id="sf-website"
              type="url"
              className="sf-input"
              placeholder="https://"
              value={form.website}
              onChange={e => set('website', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ── Bot ──────────────────────────────────────────── */}
      <section className="sf-section">
        <h2 className="sf-section-title">Personalidad del bot</h2>
        <div className="sf-grid2">
          <div className="sf-field">
            <label className="sf-label" htmlFor="sf-bot-name">Nombre del asistente</label>
            <input
              id="sf-bot-name"
              className="sf-input"
              value={form.botName}
              onChange={e => set('botName', e.target.value)}
              required
            />
          </div>
          <div className="sf-field">
            <label className="sf-label" htmlFor="sf-tone">Tono de comunicación</label>
            <select
              id="sf-tone"
              className="sf-select"
              value={form.tone}
              onChange={e => set('tone', e.target.value)}
            >
              {TONES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="sf-field sf-full">
            <label className="sf-label" htmlFor="sf-welcome">Mensaje de bienvenida</label>
            <textarea
              id="sf-welcome"
              className="sf-textarea"
              rows={3}
              value={form.welcomeMessage}
              onChange={e => set('welcomeMessage', e.target.value)}
              required
            />
          </div>
        </div>
      </section>

      {/* ── FAQs ─────────────────────────────────────────── */}
      <section className="sf-section">
        <div className="sf-section-head">
          <h2 className="sf-section-title">Preguntas frecuentes</h2>
          {form.faqs.length < 8 && (
            <button type="button" className="sf-add-faq" onClick={addFaq}>
              + Agregar pregunta
            </button>
          )}
        </div>
        {form.faqs.length === 0 && (
          <p className="sf-no-faqs">Sin preguntas frecuentes todavía.</p>
        )}
        <div className="sf-faqs">
          {form.faqs.map((faq, idx) => (
            <div key={idx} className="sf-faq-row">
              <div className="sf-faq-fields">
                <input
                  className="sf-input"
                  placeholder="Pregunta"
                  value={faq.question}
                  onChange={e => setFaqField(idx, 'question', e.target.value)}
                />
                <textarea
                  className="sf-textarea"
                  rows={2}
                  placeholder="Respuesta"
                  value={faq.answer}
                  onChange={e => setFaqField(idx, 'answer', e.target.value)}
                />
              </div>
              <button
                type="button"
                className="sf-remove-faq"
                onClick={() => removeFaq(idx)}
                aria-label="Eliminar pregunta"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Save bar ─────────────────────────────────────── */}
      <div className="sf-save-bar">
        {status === 'saved' && (
          <span className="sf-save-msg ok" role="status">
            ✓ Cambios guardados y prompt regenerado
          </span>
        )}
        {status === 'error' && (
          <span className="sf-save-msg err" role="alert">{errorMsg}</span>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
        >
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}
