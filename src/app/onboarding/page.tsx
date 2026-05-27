"use client"

import React, { useState, useCallback } from 'react'

// ── Types ─────────────────────────────────────────────────
interface FAQ { question: string; answer: string }

interface FormData {
  businessName: string
  sector: string
  city: string
  whatsappNumber: string
  description: string
  schedule: string
  address: string
  website: string
  contactEmail: string
  botName: string
  tone: string
  welcomeMessage: string
  faqs: FAQ[]
}

type ScalarField = keyof Omit<FormData, 'faqs'>
type FormErrors = Partial<Record<ScalarField | 'form', string>>

interface StepProps {
  data: FormData
  errors: FormErrors
  set: (field: ScalarField, value: string) => void
}

interface Step3Props extends StepProps {
  setFaq: (idx: number, key: 'question' | 'answer', val: string) => void
  addFaq: () => void
  removeFaq: (idx: number) => void
}

// ── Constants ─────────────────────────────────────────────
const SECTORS = [
  'Restaurante', 'Clínica', 'Salón de belleza',
  'Comercio', 'Inmobiliaria', 'Otro',
]

const TONES = [
  { value: 'warm',         label: 'Amigable y cálido' },
  { value: 'professional', label: 'Profesional' },
  { value: 'fun',          label: 'Divertido' },
  { value: 'formal',       label: 'Formal' },
]

const STEP_LABELS = ['Negocio', 'Contacto', 'Bot', 'Confirmar']

const INITIAL: FormData = {
  businessName: '', sector: '', city: '', whatsappNumber: '', description: '',
  schedule: '', address: '', website: '', contactEmail: '',
  botName: '', tone: 'warm', welcomeMessage: '', faqs: [],
}

// ── Shared field wrapper ──────────────────────────────────
function OBField({
  label, error, children, hint,
}: {
  label: string
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="ob-field">
      <label className="ob-label">{label}</label>
      {children}
      {hint && !error && <span className="ob-hint">{hint}</span>}
      {error && <span className="ob-error-msg">{error}</span>}
    </div>
  )
}

// ── BrandMark ─────────────────────────────────────────────
function OBBrand() {
  return (
    <a href="/" className="ob-logo" aria-label="Charló AI inicio">
      <svg viewBox="0 0 24 32" fill="none" width="18" height="24" aria-hidden="true">
        <defs>
          <linearGradient id="ob-bm-g" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <path d="M5 24 L19 6" stroke="url(#ob-bm-g)" strokeWidth="5.5" strokeLinecap="round" />
      </svg>
      <span>Charló AI</span>
    </a>
  )
}

// ── Progress bar ──────────────────────────────────────────
function OBProgress({ step }: { step: number }) {
  return (
    <nav className="ob-progress" aria-label="Progreso del onboarding">
      <div className="ob-progress-track">
        {STEP_LABELS.map((label, i) => (
          <React.Fragment key={i}>
            <div className={`ob-dot-col${step > i ? ' done' : step === i ? ' active' : ''}`}>
              <div className="ob-dot" aria-label={`Paso ${i + 1}: ${label}`}>
                {step > i ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"
                    strokeLinecap="round" strokeLinejoin="round" width="11" height="11" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span className="ob-dot-label">{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`ob-connector${step > i ? ' done' : ''}`} aria-hidden="true" />
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  )
}

// ── STEP 1 — Datos del negocio ────────────────────────────
function Step1({ data, errors, set }: StepProps) {
  return (
    <div className="ob-card">
      <div className="ob-card-head">
        <span className="ob-step-tag">01 / 04</span>
        <h1 className="ob-card-title">Tu negocio</h1>
        <p className="ob-card-sub">
          Cuéntanos quiénes son para que Charló los represente a la perfección.
        </p>
      </div>

      <div className="ob-fields">
        <OBField label="Nombre del negocio" error={errors.businessName}>
          <input
            className={`ob-input${errors.businessName ? ' error' : ''}`}
            value={data.businessName}
            onChange={(e) => set('businessName', e.target.value)}
            placeholder="Ej: La Fogata Restaurante"
            autoComplete="organization"
          />
        </OBField>

        <OBField label="Sector" error={errors.sector}>
          <select
            className={`ob-select${errors.sector ? ' error' : ''}`}
            value={data.sector}
            onChange={(e) => set('sector', e.target.value)}
          >
            <option value="">Elige una categoría…</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </OBField>

        <div className="ob-row">
          <OBField label="Ciudad" error={errors.city}>
            <input
              className={`ob-input${errors.city ? ' error' : ''}`}
              value={data.city}
              onChange={(e) => set('city', e.target.value)}
              placeholder="Popayán"
              autoComplete="address-level2"
            />
          </OBField>

          <OBField
            label="Número de WhatsApp"
            error={errors.whatsappNumber}
            hint="Con código de país, ej: 573001234567"
          >
            <input
              className={`ob-input${errors.whatsappNumber ? ' error' : ''}`}
              value={data.whatsappNumber}
              onChange={(e) => set('whatsappNumber', e.target.value)}
              placeholder="573001234567"
              inputMode="tel"
            />
          </OBField>
        </div>

        <OBField
          label="Descripción del negocio"
          error={errors.description}
          hint="¿Qué ofreces? ¿Cuál es tu diferencial? (2-4 frases)"
        >
          <textarea
            className={`ob-textarea${errors.description ? ' error' : ''}`}
            value={data.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Somos un restaurante de comida típica colombiana fundado en 2018. Nuestro especialidad es el sancocho de gallina…"
            rows={3}
          />
        </OBField>
      </div>
    </div>
  )
}

// ── STEP 2 — Horarios y contacto ──────────────────────────
function Step2({ data, errors, set }: StepProps) {
  return (
    <div className="ob-card">
      <div className="ob-card-head">
        <span className="ob-step-tag">02 / 04</span>
        <h1 className="ob-card-title">Horarios y contacto</h1>
        <p className="ob-card-sub">
          Charló usará esta información para responder preguntas de tus clientes.
        </p>
      </div>

      <div className="ob-fields">
        <OBField
          label="Horario de atención"
          error={errors.schedule}
          hint="Ej: Lun–Sáb 8am–8pm, Dom 10am–4pm"
        >
          <input
            className={`ob-input${errors.schedule ? ' error' : ''}`}
            value={data.schedule}
            onChange={(e) => set('schedule', e.target.value)}
            placeholder="Lun–Sáb 8am–8pm"
          />
        </OBField>

        <OBField label="Dirección" error={errors.address}>
          <input
            className={`ob-input${errors.address ? ' error' : ''}`}
            value={data.address}
            onChange={(e) => set('address', e.target.value)}
            placeholder="Calle 5 #8-23, Popayán, Cauca"
            autoComplete="street-address"
          />
        </OBField>

        <OBField
          label="Sitio web"
          error={errors.website}
          hint="Opcional"
        >
          <input
            className={`ob-input${errors.website ? ' error' : ''}`}
            value={data.website}
            onChange={(e) => set('website', e.target.value)}
            placeholder="https://tuweb.com"
            type="url"
            autoComplete="url"
          />
        </OBField>

        <OBField label="Email de contacto" error={errors.contactEmail}>
          <input
            className={`ob-input${errors.contactEmail ? ' error' : ''}`}
            value={data.contactEmail}
            onChange={(e) => set('contactEmail', e.target.value)}
            placeholder="hola@turestaurante.com"
            type="email"
            autoComplete="email"
          />
        </OBField>
      </div>
    </div>
  )
}

// ── STEP 3 — Personalización del bot ─────────────────────
function Step3({ data, errors, set, setFaq, addFaq, removeFaq }: Step3Props) {
  return (
    <div className="ob-card">
      <div className="ob-card-head">
        <span className="ob-step-tag">03 / 04</span>
        <h1 className="ob-card-title">Tu bot</h1>
        <p className="ob-card-sub">
          Dale personalidad. Charló hablará exactamente como tú.
        </p>
      </div>

      <div className="ob-fields">
        <div className="ob-row">
          <OBField
            label="Nombre del bot"
            error={errors.botName}
            hint="El nombre con el que se presentará"
          >
            <input
              className={`ob-input${errors.botName ? ' error' : ''}`}
              value={data.botName}
              onChange={(e) => set('botName', e.target.value)}
              placeholder="Fogata IA"
            />
          </OBField>

          <OBField label="Tono de comunicación" error={errors.tone}>
            <select
              className={`ob-select${errors.tone ? ' error' : ''}`}
              value={data.tone}
              onChange={(e) => set('tone', e.target.value)}
            >
              {TONES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </OBField>
        </div>

        <OBField
          label="Mensaje de bienvenida"
          error={errors.welcomeMessage}
          hint="Lo que Charló dirá cuando un cliente escriba por primera vez"
        >
          <textarea
            className={`ob-textarea${errors.welcomeMessage ? ' error' : ''}`}
            value={data.welcomeMessage}
            onChange={(e) => set('welcomeMessage', e.target.value)}
            placeholder="¡Hola! Soy Fogata IA 🌮 ¿En qué puedo ayudarte hoy?"
            rows={2}
          />
        </OBField>

        {/* FAQs */}
        <div className="ob-faqs-section">
          <div className="ob-faqs-head">
            <div>
              <span className="ob-label">Preguntas frecuentes</span>
              <span className="ob-hint">Hasta 5 — Charló las responderá con exactitud</span>
            </div>
            {data.faqs.length < 5 && (
              <button type="button" className="ob-add-faq" onClick={addFaq}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" width="13" height="13" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Agregar FAQ
              </button>
            )}
          </div>

          {data.faqs.length === 0 && (
            <div className="ob-faqs-empty">
              Sin FAQs aún — son opcionales pero muy recomendadas.
            </div>
          )}

          <div className="ob-faqs-list">
            {data.faqs.map((faq, i) => (
              <div key={i} className="ob-faq-row">
                <div className="ob-faq-num">{i + 1}</div>
                <div className="ob-faq-inputs">
                  <input
                    className="ob-input"
                    value={faq.question}
                    onChange={(e) => setFaq(i, 'question', e.target.value)}
                    placeholder="¿A qué hora cierran?"
                  />
                  <input
                    className="ob-input"
                    value={faq.answer}
                    onChange={(e) => setFaq(i, 'answer', e.target.value)}
                    placeholder="Cerramos a las 10pm todos los días."
                  />
                </div>
                <button
                  type="button"
                  className="ob-faq-remove"
                  onClick={() => removeFaq(i)}
                  aria-label="Eliminar FAQ"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── STEP 4 — Confirmación ─────────────────────────────────
function Step4({ data }: { data: FormData }) {
  const toneLabel = TONES.find((t) => t.value === data.tone)?.label ?? data.tone
  const validFaqs = data.faqs.filter((f) => f.question.trim() && f.answer.trim())

  return (
    <div className="ob-card">
      <div className="ob-card-head">
        <span className="ob-step-tag">04 / 04</span>
        <h1 className="ob-card-title">¡Todo listo!</h1>
        <p className="ob-card-sub">
          Revisa la configuración y activa tu bot. Puedes modificarla después.
        </p>
      </div>

      <div className="ob-summary">
        <div className="ob-summary-section">
          <h2 className="ob-summary-title">Negocio</h2>
          <dl className="ob-summary-grid">
            <dt>Nombre</dt>       <dd>{data.businessName}</dd>
            <dt>Sector</dt>       <dd>{data.sector}</dd>
            <dt>Ciudad</dt>       <dd>{data.city}</dd>
            <dt>WhatsApp</dt>     <dd>+{data.whatsappNumber.replace(/^\+/, '')}</dd>
          </dl>
        </div>

        <div className="ob-summary-section">
          <h2 className="ob-summary-title">Horarios y contacto</h2>
          <dl className="ob-summary-grid">
            <dt>Horario</dt>      <dd>{data.schedule}</dd>
            <dt>Dirección</dt>    <dd>{data.address}</dd>
            {data.website && <><dt>Web</dt><dd>{data.website}</dd></>}
            <dt>Email</dt>        <dd>{data.contactEmail}</dd>
          </dl>
        </div>

        <div className="ob-summary-section">
          <h2 className="ob-summary-title">Bot</h2>
          <dl className="ob-summary-grid">
            <dt>Nombre</dt>       <dd>{data.botName}</dd>
            <dt>Tono</dt>         <dd>{toneLabel}</dd>
          </dl>
          <div className="ob-summary-welcome">
            <span className="ob-hint">Bienvenida</span>
            <p>{data.welcomeMessage}</p>
          </div>
        </div>

        {validFaqs.length > 0 && (
          <div className="ob-summary-section">
            <h2 className="ob-summary-title">FAQs configuradas</h2>
            <div className="ob-summary-faqs">
              {validFaqs.map((f, i) => (
                <div key={i} className="ob-summary-faq">
                  <span className="ob-summary-faq-q">P: {f.question}</span>
                  <span className="ob-summary-faq-a">R: {f.answer}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Success screen ────────────────────────────────────────
function SuccessScreen({ data }: { data: FormData }) {
  return (
    <div className="ob-wrap">
      <div className="ob-success">
        <div className="ob-success-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="ob-success-title">¡{data.botName} está configurado!</h1>
        <p className="ob-success-sub">
          Tu bot para <strong>{data.businessName}</strong> fue creado exitosamente.
          El próximo paso es conectar tu número de WhatsApp desde el dashboard.
        </p>
        <div className="ob-success-next">
          <div className="ob-next-step">
            <span className="ob-next-num">01</span>
            <div>
              <strong>Conecta WhatsApp Business API</strong>
              <p>Vincula tu número de WhatsApp en Meta for Developers.</p>
            </div>
          </div>
          <div className="ob-next-step">
            <span className="ob-next-num">02</span>
            <div>
              <strong>Prueba tu bot</strong>
              <p>Escríbete desde otro número y verifica que Charló responde.</p>
            </div>
          </div>
          <div className="ob-next-step">
            <span className="ob-next-num">03</span>
            <div>
              <strong>¡Listo para atender clientes!</strong>
              <p>Tu negocio ahora responde 24/7 de forma automática.</p>
            </div>
          </div>
        </div>
        <a href="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          Volver al inicio
        </a>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────
export default function OnboardingPage() {
  const [step, setStep]           = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [stepKey, setStepKey]     = useState(0)
  const [data, setData]           = useState<FormData>(INITIAL)
  const [errors, setErrors]       = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]           = useState(false)

  // Single field setter
  const set = useCallback((field: ScalarField, value: string) => {
    setData((d) => ({ ...d, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }, [])

  // FAQ helpers
  const setFaq = (idx: number, key: 'question' | 'answer', val: string) => {
    setData((d) => ({
      ...d,
      faqs: d.faqs.map((f, i) => (i === idx ? { ...f, [key]: val } : f)),
    }))
  }
  const addFaq = () => {
    if (data.faqs.length >= 5) return
    setData((d) => ({ ...d, faqs: [...d.faqs, { question: '', answer: '' }] }))
  }
  const removeFaq = (idx: number) => {
    setData((d) => ({ ...d, faqs: d.faqs.filter((_, i) => i !== idx) }))
  }

  // Validation per step
  const validate = (s: number): boolean => {
    const e: FormErrors = {}
    if (s === 0) {
      if (!data.businessName.trim())   e.businessName   = 'Campo requerido'
      if (!data.sector)                e.sector         = 'Elige un sector'
      if (!data.city.trim())           e.city           = 'Campo requerido'
      if (!data.whatsappNumber.trim()) e.whatsappNumber = 'Campo requerido'
      if (!data.description.trim())    e.description    = 'Campo requerido'
    }
    if (s === 1) {
      if (!data.schedule.trim())     e.schedule     = 'Campo requerido'
      if (!data.address.trim())      e.address      = 'Campo requerido'
      if (!data.contactEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail))
        e.contactEmail = 'Email inválido'
    }
    if (s === 2) {
      if (!data.botName.trim())       e.botName       = 'Campo requerido'
      if (!data.tone)                 e.tone          = 'Elige un tono'
      if (!data.welcomeMessage.trim()) e.welcomeMessage = 'Campo requerido'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const goNext = () => {
    if (!validate(step)) return
    setDirection('forward')
    setStepKey((k) => k + 1)
    setStep((s) => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goBack = () => {
    setErrors({})
    setDirection('back')
    setStepKey((k) => k + 1)
    setStep((s) => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setErrors({})
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName:   data.businessName,
          sector:         data.sector,
          city:           data.city,
          whatsappNumber: data.whatsappNumber,
          description:    data.description,
          schedule:       data.schedule,
          address:        data.address,
          website:        data.website,
          contactEmail:   data.contactEmail,
          botName:        data.botName,
          tone:           data.tone,
          welcomeMessage: data.welcomeMessage,
          faqs:           data.faqs.filter((f) => f.question.trim() && f.answer.trim()),
        }),
      })
      const result = await res.json() as { clientId?: string; error?: string }
      if (!res.ok) {
        setErrors({ form: result.error ?? 'Error al guardar la configuración' })
        return
      }
      setDone(true)
    } catch {
      setErrors({ form: 'Error de red. Intenta de nuevo.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (done) return <SuccessScreen data={data} />

  return (
    <div className="ob-wrap">
      {/* Header */}
      <header className="ob-header">
        <OBBrand />
        <span className="ob-header-tag">Configuración del bot</span>
      </header>

      {/* Progress */}
      <OBProgress step={step} />

      {/* Step card with slide animation */}
      <div className="ob-content">
        <div
          key={stepKey}
          className={`ob-step-anim${direction === 'back' ? ' back' : ''}`}
        >
          {step === 0 && <Step1 data={data} errors={errors} set={set} />}
          {step === 1 && <Step2 data={data} errors={errors} set={set} />}
          {step === 2 && (
            <Step3
              data={data} errors={errors} set={set}
              setFaq={setFaq} addFaq={addFaq} removeFaq={removeFaq}
            />
          )}
          {step === 3 && <Step4 data={data} />}
        </div>

        {/* Form-level error */}
        {errors.form && (
          <p className="ob-form-error" role="alert">{errors.form}</p>
        )}

        {/* Navigation */}
        <div className={`ob-nav${step === 0 ? ' single' : ''}`}>
          {step > 0 && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={goBack}
              disabled={submitting}
            >
              ← Volver
            </button>
          )}
          {step < 3 ? (
            <button type="button" className="btn btn-primary" onClick={goNext}>
              Continuar →
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary ob-submit"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="ob-spinner" aria-hidden="true" />
                  Activando…
                </>
              ) : (
                <>⚡ Activar mi bot</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
