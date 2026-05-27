"use client"

import React, { useState, useEffect, useRef, useId, useCallback } from 'react'

// ── JSON-LD schemas ───────────────────────────────────────
const SCHEMA_APP = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Charló AI",
  "url": "https://www.charloai.com/",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "description": "Asistente virtual de WhatsApp con IA para restaurantes, clínicas, salones e inmobiliarias en Colombia.",
  "offers": [
    { "@type": "Offer", "name": "Plan Básico",   "price": "19", "priceCurrency": "USD" },
    { "@type": "Offer", "name": "Plan Esencial", "price": "39", "priceCurrency": "USD" },
    { "@type": "Offer", "name": "Plan Pro",       "price": "69", "priceCurrency": "USD" },
  ],
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "127" },
  "publisher": {
    "@type": "Organization", "name": "Charló AI", "url": "https://www.charloai.com/",
    "telephone": "+573044843308",
    "address": { "@type": "PostalAddress", "addressLocality": "Popayán", "addressRegion": "Cauca", "addressCountry": "CO" },
    "sameAs": ["https://www.instagram.com/charloai", "https://www.linkedin.com/company/charloai"],
  },
}

const SCHEMA_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "¿Cuánto tiempo toma configurarlo?", "acceptedAnswer": { "@type": "Answer", "text": "Menos de 5 minutos. Conectas tu WhatsApp Business, eliges una plantilla por industria y Charló queda activo. Sin código, sin instalaciones." } },
    { "@type": "Question", "name": "¿Necesito tener WhatsApp Business API?", "acceptedAnswer": { "@type": "Answer", "text": "No. Te ayudamos a obtenerla gratis durante el onboarding. También puedes usar Charló con un número de WhatsApp Business tradicional para empezar." } },
    { "@type": "Question", "name": "¿Qué pasa si la IA no sabe responder algo?", "acceptedAnswer": { "@type": "Answer", "text": "Charló escala automáticamente a un humano cuando detecta una pregunta fuera de su contexto. Tú recibes una notificación y respondes desde la app." } },
    { "@type": "Question", "name": "¿Puedo cancelar cuando quiera?", "acceptedAnswer": { "@type": "Answer", "text": "Claro. Cancelas con un clic, sin penalizaciones. Los 15 días de prueba son completamente gratis y sin tarjeta de crédito." } },
    { "@type": "Question", "name": "¿Mis datos están seguros?", "acceptedAnswer": { "@type": "Answer", "text": "Encriptación end-to-end, hosting en Colombia, cumplimiento de la Ley 1581 de Habeas Data. Tus conversaciones nunca se usan para entrenar modelos externos." } },
  ],
}

// ── Icons ─────────────────────────────────────────────────
type SvgProps = React.SVGProps<SVGSVGElement>

const ICheck    = (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12" /></svg>
const IXMark    = (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
const IPlus     = (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
const IArrow    = (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
const IBolt     = (p: SvgProps) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M13 2L4.5 13.5h6L9.5 22L18 10.5h-6L13 2z" /></svg>
const IShield   = (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
const IClock    = (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
const IStar     = (p: SvgProps) => <svg viewBox="0 0 24 24" {...p}><path d="M12 .587l3.668 7.568L24 9.75l-6 5.847 1.416 8.253L12 19.771l-7.416 3.897L6 15.597 0 9.75l8.332-1.595z" /></svg>
const ICal      = (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
const IUser     = (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
const IFork     = (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="6" cy="3" r="3" /><circle cx="6" cy="21" r="3" /><circle cx="18" cy="12" r="3" /><path d="M6 6v3a3 3 0 003 3h6" /><path d="M6 12v6" /></svg>
const IHome     = (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
const IUtensils = (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 2v6a2 2 0 002 2h0a2 2 0 002-2V2" /><path d="M5 10v12" /><path d="M19 2v20" /><path d="M19 7c-2 0-3 1-3 3v4c0 1 1 2 2 2h1" /></svg>
const IScissors = (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" /></svg>
const ISteth    = (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 0012 0V4a2 2 0 00-2-2h-1a.2.2 0 100 .3" /><path d="M8 15a6 6 0 006-6" /><circle cx="20" cy="10" r="2" /></svg>
const IWa       = (p: SvgProps) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.521 5.265l-.999 3.648 3.967-.612zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" /></svg>
const ILayers   = (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
const ILock     = (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
const ISpark    = (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" /></svg>
const IBrain    = (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96.44 2.5 2.5 0 01-2.96-3.08 3 3 0 01-.34-5.58 2.5 2.5 0 011.32-4.24 2.5 2.5 0 014.44-1.04z" /><path d="M14.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 004.96.44 2.5 2.5 0 002.96-3.08 3 3 0 00.34-5.58 2.5 2.5 0 00-1.32-4.24 2.5 2.5 0 00-4.44-1.04z" /></svg>
const ISend     = (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
const IInsta    = (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
const ILinkedin = (p: SvgProps) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.778 13.019H3.555V9h3.56v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>

// ── BrandMark ─────────────────────────────────────────────
function BrandMark({ size = 32 }: { size?: number }) {
  const id = useId().replace(/:/g, '')
  return (
    <span className="brand-mark" style={{ width: size * 0.82, height: size }}>
      <svg viewBox="0 0 24 32" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={`bm-${id}`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <path d="M5 24 L19 6" stroke={`url(#bm-${id})`} strokeWidth="5.5" strokeLinecap="round" />
      </svg>
    </span>
  )
}

// ── useReveal hook ────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

// ── CursorGlow ────────────────────────────────────────────
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let rafId: number
    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let cx = tx
    let cy = ty
    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
      el.classList.add('active')
    }
    const onLeave = () => el.classList.remove('active')
    const tick = () => {
      cx += (tx - cx) * 0.12
      cy += (ty - cy) * 0.12
      el.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`
      rafId = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    rafId = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(rafId)
    }
  }, [])
  return <div ref={ref} className="cursor-glow" />
}

// ── Nav ───────────────────────────────────────────────────
function Nav({ onCtaClick }: { onCtaClick: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Navegación principal">
      <div className="nav-inner">
        <a className="brand" href="#hero" aria-label="Charló AI inicio">
          <BrandMark size={32} />
          Charló AI
        </a>
        <div className="nav-links">
          <a className="nav-link" href="#features">Producto</a>
          <a className="nav-link" href="#pricing">Precios</a>
          <a className="nav-link" href="#demo">Demo</a>
          <a className="nav-link" href="#faq">Preguntas</a>
          <a className="nav-link" href="mailto:hola@charloai.com">Contacto</a>
          <button className="btn btn-primary ml-2" onClick={onCtaClick}>
            Empieza gratis
          </button>
        </div>
      </div>
    </nav>
  )
}

// ── HeroChat ─────────────────────────────────────────────
type HeroMsg = { who: 'in' | 'out'; text?: string; time: string; isCard?: boolean }

const HERO_SCRIPT: HeroMsg[] = [
  { who: 'in',  text: 'Hola, ¿a qué hora cierran hoy?', time: '10:22' },
  { who: 'out', text: '¡Hola! Cerramos a las 10pm. ¿Te gustaría reservar una mesa?', time: '10:22' },
  { who: 'in',  text: 'Sí, para 2 personas a las 8pm', time: '10:23' },
  { who: 'out', text: '¡Perfecto! Mesa para 2 a las 8pm. ¿A nombre de quién?', time: '10:23' },
  { who: 'in',  text: 'Carlos Martínez', time: '10:24' },
  { who: 'out', isCard: true, time: '10:24' },
]

function HeroChat() {
  const [visible, setVisible] = useState(0)
  const [typing, setTyping] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    let timerId: ReturnType<typeof setTimeout>

    const step = (idx: number) => {
      if (cancelled) return
      if (idx >= HERO_SCRIPT.length) {
        timerId = setTimeout(() => {
          if (!cancelled) {
            setVisible(0)
            setTyping(false)
            timerId = setTimeout(() => step(0), 600)
          }
        }, 3500)
        return
      }
      const msg = HERO_SCRIPT[idx]
      if (msg.who === 'out') {
        setTyping(true)
        timerId = setTimeout(() => {
          if (cancelled) return
          setTyping(false)
          setVisible(idx + 1)
          timerId = setTimeout(() => step(idx + 1), 1100)
        }, 1100)
      } else {
        setVisible(idx + 1)
        timerId = setTimeout(() => step(idx + 1), 1400)
      }
    }

    timerId = setTimeout(() => step(0), 600)
    return () => {
      cancelled = true
      clearTimeout(timerId)
    }
  }, [])

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [visible, typing])

  return (
    <div className="phone-wrap">
      <div className="float-chip fc-1"><ICal className="w-4 h-4" /> Reserva agendada</div>
      <div className="float-chip fc-2"><IBolt className="w-4 h-4" /> Respuesta en 1.2s</div>
      <div className="float-chip fc-3"><IBrain className="w-4 h-4" /> IA + tu identidad</div>

      <div className="phone">
        <div className="phone-screen">
          <header className="chat-header">
            <div className="avatar"><IUtensils className="w-[18px] h-[18px]" /></div>
            <div>
              <div className="chat-name">La Fogata</div>
              <div className="chat-status"><span className="dot" /> en línea</div>
            </div>
            <div className="chat-icons">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
              </svg>
            </div>
          </header>

          <div className="chat-body" ref={bodyRef}>
            {HERO_SCRIPT.slice(0, visible).map((m, i) => (
              <div key={i} className={`msg ${m.who}`}>
                {m.isCard ? (
                  <div>
                    <div className="msg-card-title">¡Reserva confirmada, Carlos!</div>
                    <div className="msg-card">
                      <div className="row"><ICal className="w-[13px] h-[13px]" /> Hoy, 8:00 PM</div>
                      <div className="row"><IUser className="w-[13px] h-[13px]" /> 2 personas</div>
                    </div>
                    <div className="msg-card-footer">¡Te esperamos!<span className="msg-time">{m.time}</span></div>
                  </div>
                ) : (
                  <>{m.text}<span className="msg-time">{m.time}</span></>
                )}
              </div>
            ))}
            {typing && <div className="typing"><span /><span /><span /></div>}
          </div>

          <div className="chat-input">
            <div className="field">Escribe un mensaje…</div>
            <button className="send" aria-label="Enviar"><ISend className="icon-send-offset" /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Hero ──────────────────────────────────────────────────
function Hero({ onCtaClick }: { onCtaClick: () => void }) {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <div className="hero-grid" />
      </div>
      <div className="container">
        <div className="hero-inner">
          <div className="hero-left">
            <span className="eyebrow"><span className="dot" /> IA para negocios locales en Colombia</span>
            <h1 className="hero-title">
              <span className="gradient-text">Tu negocio responde</span>{' '}
              <span className="violet-text">solo, 24/7.</span>
            </h1>
            <p className="hero-sub">
              El asistente de WhatsApp con IA para restaurantes, clínicas, salones e inmobiliarias.
              Configúralo en 5 minutos, sin código. Mientras tú duermes, Charló reserva, agenda y vende.
            </p>
            <div className="hero-cta">
              <button className="btn btn-primary btn-lg" onClick={onCtaClick}>
                Empieza gratis <IArrow className="w-4 h-4" />
              </button>
              <a className="btn btn-ghost btn-lg" href="#demo">
                Probar el bot en vivo
              </a>
            </div>
            <div className="hero-meta">
              <span className="item"><span className="check"><ICheck className="w-[10px] h-[10px]" /></span> 15 días gratis</span>
              <span className="item"><span className="check"><ICheck className="w-[10px] h-[10px]" /></span> Sin tarjeta de crédito</span>
              <span className="item"><span className="check"><ICheck className="w-[10px] h-[10px]" /></span> Listo en 5 minutos</span>
            </div>
          </div>
          <div className="hero-right">
            <HeroChat />
          </div>
        </div>
      </div>
    </section>
  )
}

// ── TrustStrip ────────────────────────────────────────────
function TrustStrip() {
  return (
    <div className="trust-strip">
      <div className="container trust-strip-inner">
        <div className="trust-label">CONSTRUIDO SOBRE</div>
        <div className="trust-logos">
          <span className="logo"><IWa className="trust-icon" /> WhatsApp Business API</span>
          <span className="logo"><ILayers className="trust-icon" /> Groq AI</span>
          <span className="logo">
            <svg viewBox="0 0 24 24" fill="currentColor" className="trust-icon-lg" aria-hidden="true">
              <path d="M11.9 1.6L1.4 13.3a1.4 1.4 0 001 2.3h7.4l-1.7 6.9a.5.5 0 00.9.4l10.5-11.7a1.4 1.4 0 00-1-2.3h-7.4l1.7-6.9a.5.5 0 00-.9-.4z" />
            </svg>
            Supabase
          </span>
          <span className="logo"><ILock className="trust-icon" /> SSL Seguro</span>
        </div>
      </div>
    </div>
  )
}

// ── CustomerLogos ─────────────────────────────────────────
function CustomerLogos() {
  const ITEMS = [
    'La Fogata · Popayán', 'Sonrisa Dental · Cali', 'Salón Glam · Medellín',
    'Inmob. Andina · Bogotá', 'Café del Valle · Pasto', 'Vet Animalia · Manizales',
    'Estética Lúa · Cartagena', 'Pizzería Nona · Pereira',
  ]
  return (
    <div className="customer-logos-wrap">
      <div className="container">
        <p className="trust-label center mb-6">
          +200 NEGOCIOS LOCALES AUTOMATIZANDO CON CHARLÓ
        </p>
      </div>
      <div className="customer-logos-mask">
        <div className="logo-marquee">
          {[...ITEMS, ...ITEMS].map((label, i) => (
            <span key={i} className="marquee-item">{label}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── CountUp ───────────────────────────────────────────────
function CountUp({ to, suffix = '', duration = 1600 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let started = false
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true
          const start = performance.now()
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / duration)
            const eased = 1 - Math.pow(1 - p, 3)
            setN(Math.round(to * eased))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      })
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [to, duration])
  return <span ref={ref}>{n}{suffix}</span>
}

// ── Stats ─────────────────────────────────────────────────
function Stats() {
  const ref = useReveal()
  return (
    <section className="section">
      <div className="container">
        <div ref={ref} className="reveal section-head">
          <span className="eyebrow"><span className="dot" /> El problema</span>
          <h2 className="section-title gradient-text">Cada mensaje sin respuesta<br />es un cliente perdido.</h2>
          <p className="section-sub">Tu cliente no espera. Si no respondes en minutos, te reemplazan con un solo tap.</p>
        </div>
        <div className="stats">
          <div className="stat">
            <div className="stat-num"><CountUp to={67} suffix="%" /></div>
            <div className="stat-label">de clientes no regresan si no reciben respuesta rápida</div>
          </div>
          <div className="stat">
            <div className="stat-num"><CountUp to={4} suffix="h" /></div>
            <div className="stat-label">tiempo promedio de respuesta de un negocio local</div>
          </div>
          <div className="stat">
            <div className="stat-num">24/7</div>
            <div className="stat-label">disponibilidad de Charló AI, sin descanso</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Pipeline ─────────────────────────────────────────────
function Pipeline() {
  const [active, setActive] = useState(0)
  const ref = useReveal()
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % 3), 1900)
    return () => clearInterval(id)
  }, [])
  const nodes = [
    { tag: '01 · ENTRADA',  title: 'Mensaje en WhatsApp',   sub: 'Cliente escribe a tu número como siempre.' },
    { tag: '02 · CHARLÓ AI', title: 'Entiende e identifica', sub: 'Detecta intención: reserva, consulta, queja, compra.' },
    { tag: '03 · SALIDA',   title: 'Responde y agenda',     sub: 'Confirma, registra en tu calendario, te notifica.' },
  ]
  return (
    <section className="section">
      <div className="container">
        <div ref={ref} className="reveal section-head">
          <span className="eyebrow"><span className="dot" /> Cómo funciona</span>
          <h2 className="section-title gradient-text">Automatización que se siente humana.</h2>
          <p className="section-sub">Tres pasos. Cero código. Tu negocio nunca duerme.</p>
        </div>
        <div className="pipeline-wrap">
          <div className="pipeline">
            {nodes.map((n, i) => (
              <React.Fragment key={i}>
                <div className={`node${active === i ? ' active' : ''}`}>
                  <div className="node-tag">{n.tag}</div>
                  <div className="node-title">{n.title}</div>
                  <div className="node-sub">{n.sub}</div>
                </div>
                {i < nodes.length - 1 && (
                  <div className="pipeline-arrow"><div className="pipeline-line" /></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Features ──────────────────────────────────────────────
function Features() {
  const headRef = useReveal()
  const gridRef = useReveal()
  const cards = [
    { icon: <IUser />,     title: 'Bot con tu identidad',    desc: 'Nombre, tono y personalidad de tu negocio. Tu asistente habla exactamente como tú.' },
    { icon: <IClock />,    title: 'Respuesta en segundos',   desc: 'No en horas. Respuesta instantánea, 24/7. Nunca pierdas un cliente por lentitud.' },
    { icon: <ISpark />,    title: 'Sin código, en 5 minutos', desc: 'Onboarding guiado paso a paso. Listo para atender clientes hoy mismo.' },
    { icon: <ICal />,      title: 'Reservas y agenda',       desc: 'Charló agenda mesas, citas y turnos directamente en tu calendario.' },
    { icon: <IFork />,     title: 'Flujos personalizados',   desc: 'Define preguntas frecuentes, menús, precios y respuestas automáticas.' },
    { icon: <IShield />,   title: 'Datos seguros',           desc: 'Encriptación end-to-end, hosting en Colombia, conforme a la Ley 1581.' },
  ]
  return (
    <section className="section" id="features">
      <div className="container">
        <div ref={headRef} className="reveal section-head">
          <span className="eyebrow"><span className="dot" /> Todo lo que necesitas</span>
          <h2 className="section-title gradient-text">Todo lo que necesita tu negocio.</h2>
          <p className="section-sub">Automatiza tu atención al cliente sin perder el toque personal que te hace único.</p>
        </div>
        <div ref={gridRef} className="features-grid reveal-stagger">
          {cards.map((c, i) => (
            <article
              key={i}
              className="feature-card"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
                e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
              }}
            >
              <div className="feature-icon">{c.icon}</div>
              <h3 className="feature-title">{c.title}</h3>
              <p className="feature-desc">{c.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Industries ────────────────────────────────────────────
function Industries() {
  const headRef = useReveal()
  const gridRef = useReveal()
  const items = [
    { icon: <IUtensils />, title: 'Restaurantes',      desc: 'Reservas, menú y horarios automáticos.',        tag: '+30 negocios' },
    { icon: <ISteth />,    title: 'Clínicas',           desc: 'Citas, recordatorios y consultas.',             tag: '+45 clínicas' },
    { icon: <IScissors />, title: 'Salones de belleza', desc: 'Agenda turnos sin llamadas.',                   tag: '+60 salones' },
    { icon: <IHome />,     title: 'Inmobiliarias',      desc: 'Filtros y visitas automatizadas.',              tag: '+25 agencias' },
  ]
  return (
    <section className="section industries-section">
      <div className="container">
        <div ref={headRef} className="reveal section-head">
          <span className="eyebrow"><span className="dot" /> Por industria</span>
          <h2 className="section-title gradient-text">Funciona para tu negocio.</h2>
          <p className="section-sub">Plantillas pre-configuradas por sector. Cero configuración manual.</p>
        </div>
        <div ref={gridRef} className="industries reveal-stagger">
          {items.map((it, i) => (
            <article key={i} className="industry-card">
              <div className="industry-icon">{it.icon}</div>
              <h3 className="industry-title">{it.title}</h3>
              <p className="industry-desc">{it.desc}</p>
              <span className="industry-tag">{it.tag}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Comparison ────────────────────────────────────────────
function Comparison() {
  const ref = useReveal()
  const bad  = ['Clientes esperan horas por una respuesta', 'Pierdes reservas cuando duermes o estás ocupado', 'Contratar recepcionista cuesta $1.5M COP/mes', 'Olvidos, errores humanos, vacaciones', 'Sin reportes ni métricas claras']
  const good = ['Respuesta instantánea, en segundos, siempre', 'Reservas 24/7 — incluso a las 3am', 'Desde $19/mes. Sin contratar a nadie', 'Cero olvidos: integrado a tu calendario', 'Dashboard con métricas y conversaciones']
  return (
    <section className="section">
      <div className="container">
        <div ref={ref} className="reveal section-head">
          <span className="eyebrow"><span className="dot" /> El antes y el después</span>
          <h2 className="section-title gradient-text">Con Charló, juegas otra liga.</h2>
          <p className="section-sub">La diferencia entre perder clientes y convertirlos en habituales.</p>
        </div>
        <div className="compare">
          <div className="compare-card bad">
            <div className="compare-head">
              <span className="compare-badge bad">Sin Charló</span>
              <h3 className="compare-title">Atención manual</h3>
            </div>
            <ul className="compare-list bad">
              {bad.map((t, i) => (
                <li key={i}><span className="icon"><IXMark className="w-3 h-3" /></span>{t}</li>
              ))}
            </ul>
          </div>
          <div className="compare-card good">
            <div className="compare-head">
              <span className="compare-badge good">Con Charló</span>
              <h3 className="compare-title">Atención automatizada con IA</h3>
            </div>
            <ul className="compare-list good">
              {good.map((t, i) => (
                <li key={i}><span className="icon"><ICheck className="w-3 h-3" /></span>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── DemoChat ──────────────────────────────────────────────
const PRESETS = ['¿A qué hora abren?', 'Quiero reservar mesa para 4', '¿Cuánto cuesta una limpieza dental?', '¿Tienen turnos disponibles mañana?']

const DEMO_SYSTEM = `Eres "Charló", el asistente virtual de WhatsApp de un restaurante colombiano llamado "La Fogata" en Popayán. Eres amable, breve, y hablas en español con un toque colombiano natural. NUNCA respondas más de 2-3 frases. Si te preguntan por reservas, ofrece confirmar fecha y hora. Si te preguntan por horarios, di "Abrimos de 12pm a 10pm todos los días". Si te preguntan por el menú, menciona platos típicos colombianos (bandeja paisa, sancocho, ajiaco). Siempre termina con una pregunta breve si tiene sentido. Usa emojis con moderación (1 max).`

type ChatMsg = { who: 'user' | 'bot'; text: string }

function DemoChat() {
  const ref = useReveal()
  const bodyRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<ChatMsg[]>([
    { who: 'bot', text: '¡Hola! Soy Charló, el asistente virtual de La Fogata 🌮 ¿En qué puedo ayudarte hoy?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [messages, loading])

  const send = useCallback(async (text?: string) => {
    const userText = (text ?? input).trim()
    if (!userText || loading) return
    setInput('')
    const next: ChatMsg[] = [...messages, { who: 'user', text: userText }]
    setMessages(next)
    setLoading(true)
    try {
      const history = next.map((m) => ({ role: m.who === 'bot' ? 'assistant' : 'user', content: m.text }))
      const res = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, system: DEMO_SYSTEM }),
      })
      const data = await res.json() as { reply?: string; error?: string }
      const reply = data.reply ?? 'Uy, parece que perdí señal un momento. ¿Puedes intentar de nuevo?'
      setMessages((m) => [...m, { who: 'bot', text: reply }])
    } catch {
      setMessages((m) => [...m, { who: 'bot', text: 'Uy, parece que perdí señal un momento. ¿Puedes intentar de nuevo?' }])
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages])

  return (
    <section className="section" id="demo">
      <div className="container">
        <div ref={ref} className="reveal section-head demo-section-head">
          <span className="eyebrow"><span className="dot" /> Demo en vivo</span>
          <h2 className="section-title gradient-text">Pruébalo ahora.<br />Habla con Charló.</h2>
          <p className="section-sub">Esta es una demo real de cómo respondería Charló en tu restaurante. Pregúntale lo que quieras.</p>
        </div>
        <div className="demo-wrap">
          <div className="demo-copy">
            <span className="eyebrow"><IBrain className="w-[13px] h-[13px]" /> IA conversacional</span>
            <h3>Responde como un humano,<br />aprende como una máquina.</h3>
            <p>Charló entiende contexto, recuerda la conversación y se adapta al tono de tu negocio. Pruébalo con una pregunta real — o usa una de las sugeridas.</p>
            <div className="demo-presets">
              {PRESETS.map((p, i) => (
                <button key={i} className="demo-preset" onClick={() => void send(p)} disabled={loading}>{p}</button>
              ))}
            </div>
          </div>
          <div className="demo-chat">
            <div className="demo-chat-head">
              <div className="avatar"><IUtensils className="w-[18px] h-[18px]" /></div>
              <div>
                <div className="chat-name">La Fogata · Demo</div>
                <div className="chat-status"><span className="dot" /> {loading ? 'escribiendo…' : 'en línea'}</div>
              </div>
            </div>
            <div className="demo-chat-body" ref={bodyRef}>
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.who === 'user' ? 'in' : 'out'}`}>{m.text}</div>
              ))}
              {loading && <div className="typing"><span /><span /><span /></div>}
            </div>
            <form className="demo-chat-input" onSubmit={(e) => { e.preventDefault(); void send() }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe un mensaje…"
                disabled={loading}
                aria-label="Mensaje para Charló"
              />
              <button type="submit" disabled={loading || !input.trim()} aria-label="Enviar">
                <ISend className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────
function Testimonials() {
  const headRef = useReveal()
  const gridRef = useReveal()
  const items = [
    { quote: 'Desde que usamos Charló AI, las reservas aumentaron un 40%. Los clientes aman poder escribir a cualquier hora.', name: 'María González', meta: 'Restaurante La Fogata · Popayán', avatar: 'MG', color: 'linear-gradient(135deg, #fb923c, #ea580c)' },
    { quote: 'Antes perdíamos pacientes porque no contestábamos rápido. Ahora el bot agenda citas mientras dormimos.', name: 'Dr. Andrés Mejía', meta: 'Clínica Odontológica Sonrisa · Cali', avatar: 'AM', color: 'linear-gradient(135deg, #22d3ee, #0891b2)' },
    { quote: 'Mis clientas pueden agendar su cita en 30 segundos. Ya no necesito una recepcionista de tiempo completo.', name: 'Laura Ríos', meta: 'Salón Glam · Medellín', avatar: 'LR', color: 'linear-gradient(135deg, #ec4899, #be185d)' },
  ]
  return (
    <section className="section">
      <div className="container">
        <div ref={headRef} className="reveal section-head">
          <span className="eyebrow"><span className="dot" /> Historias reales</span>
          <h2 className="section-title gradient-text">Negocios que ya respiran mejor.</h2>
          <p className="section-sub">Pequeños negocios colombianos que pasaron de perseguir mensajes a vender mientras duermen.</p>
        </div>
        <div ref={gridRef} className="testimonials reveal-stagger">
          {items.map((t, i) => (
            <article key={i} className="test-card">
              <div className="stars">
                {[0,1,2,3,4].map((s) => <IStar key={s} />)}
              </div>
              <p className="quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="who">
                <div className="avatar" style={{ background: t.color, width: 38, height: 38, fontSize: 14 }}>{t.avatar}</div>
                <div>
                  <div className="who-name">{t.name}</div>
                  <div className="who-meta">{t.meta}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Integrations ──────────────────────────────────────────
function Integrations() {
  const ref = useReveal()
  type Tile = { name: string; featured?: boolean; glyph: React.ReactNode }
  const tiles: Tile[] = [
    { name: 'WhatsApp', featured: true, glyph: <IWa className="int-icon" /> },
    { name: 'Google Calendar', glyph: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="int-icon">
        <rect x="3" y="4.5" width="18" height="17" rx="2.2" />
        <line x1="3" y1="9.5" x2="21" y2="9.5" /><line x1="8" y1="2.5" x2="8" y2="6.5" /><line x1="16" y1="2.5" x2="16" y2="6.5" />
        <text x="12" y="17.5" textAnchor="middle" fontSize="6" fontFamily="monospace" fontWeight="700" fill="currentColor" stroke="none">31</text>
      </svg>
    )},
    { name: 'Instagram', glyph: <IInsta className="int-icon" /> },
    { name: 'Stripe', glyph: (
      <svg viewBox="0 0 60 24" fill="currentColor" className="int-icon-stripe">
        <path d="M59.64 14.28c0-4.13-2-7.39-5.82-7.39s-6.12 3.26-6.12 7.35c0 4.85 2.74 7.32 6.66 7.32a8.97 8.97 0 0 0 4.45-1.05v-3.24a8.5 8.5 0 0 1-3.94.9c-1.56 0-2.94-.55-3.12-2.43h7.86c0-.21.03-1.04.03-1.46zm-7.94-1.54c0-1.81 1.11-2.56 2.12-2.56.98 0 2.02.75 2.02 2.56zm-10.21-5.85c-1.62 0-2.66.76-3.24 1.29l-.21-1.02h-3.64v18.84l4.13-.88.01-4.57c.6.43 1.48 1.05 2.94 1.05 2.97 0 5.68-2.4 5.68-7.45 0-4.62-2.74-7.26-5.67-7.26zm-.99 11.16a2.2 2.2 0 0 1-1.74-.7l-.03-5.45c.39-.36.94-.71 1.77-.71 1.35 0 2.29 1.52 2.29 3.42 0 1.94-.92 3.44-2.29 3.44zm-9.91-12.6 4.14-.9V1.2l-4.14.89zm0 1.32h4.14v14.05h-4.14zm-4.44 1.23-.27-1.22h-3.56v14.05h4.13v-9.52c.97-1.27 2.62-1.04 3.13-.86V7.21c-.53-.2-2.46-.55-3.43 1.59zm-8.27-4.71-4.03.86-.02 13.25c0 2.45 1.84 4.25 4.29 4.25 1.35 0 2.34-.25 2.89-.55v-3.37c-.52.21-3.13.98-3.13-1.45V10.83h3.13V7.31h-3.13zm-9.36 7.86c0-.65.53-.9 1.4-.9 1.24 0 2.83.38 4.08 1.06v-3.94a10.8 10.8 0 0 0-4.07-.75c-3.34 0-5.57 1.75-5.57 4.66 0 4.55 6.25 3.82 6.25 5.78 0 .77-.66 1.02-1.59 1.02-1.36 0-3.1-.56-4.48-1.32v3.99a11.4 11.4 0 0 0 4.48.94c3.43 0 5.78-1.7 5.78-4.65 0-4.9-6.28-4.02-6.28-5.89z" />
      </svg>
    )},
    { name: 'Wompi', glyph: <span className="int-icon-wompi">wompi</span> },
    { name: 'Google Sheets', glyph: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="int-icon">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" /><line x1="12" y1="11" x2="12" y2="19" />
      </svg>
    )},
    { name: 'Webhooks', glyph: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="int-icon">
        <path d="M10.46 13.36a1 1 0 0 1 .26 1.39l-2.8 4.18a2.99 2.99 0 1 1-2.49-1.66l1.92-2.87a1 1 0 0 1 1.66 1.11l-1.46 2.18A1 1 0 1 0 8.5 18l3.04-4.54a1 1 0 0 1 .92-.1zM8.08 7.4a3 3 0 0 1 5.84.9 3 3 0 0 1-.13.88l2.34 4.04A3 3 0 1 1 14.4 14.3l-3.04-5.25a1 1 0 0 1 .15-1.21A1 1 0 1 0 9.95 6.3a1 1 0 0 1-1.87 1.1zm10.49 9.5a3 3 0 1 1-2.69-4.34h4.2a1 1 0 0 1 0 2H15.9a1 1 0 0 0 0 1.07c.2.36.6.6 1.04.6a1 1 0 0 1 1 1c0 .12-.02.24-.07.35a1 1 0 0 1 .7-.68z" />
      </svg>
    )},
    { name: 'Zapier', glyph: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="int-icon">
        <path d="M14.04 12a8.04 8.04 0 0 1-.52 2.83 8.04 8.04 0 0 1-2.83.52 8.04 8.04 0 0 1-2.84-.52 8.04 8.04 0 0 1-.51-2.83c0-1 .18-1.95.51-2.83a8.04 8.04 0 0 1 2.83-.52c1 0 1.96.18 2.84.52.33.88.51 1.83.51 2.83zM23.32 10.4h-7.83l5.54-5.53a11.96 11.96 0 0 0-2.26-2.27l-5.54 5.54V.32a11.96 11.96 0 0 0-1.59-.11h-.01c-.55 0-1.08.03-1.6.11v7.83L4.48 2.6a11.96 11.96 0 0 0-2.27 2.27l5.54 5.53H.32S.21 11.45.21 12c0 .55.04 1.08.11 1.6h7.83L2.6 19.13a11.96 11.96 0 0 0 2.27 2.26l5.53-5.53v7.82c.51.08 1.04.11 1.59.12h.02c.55 0 1.08-.04 1.6-.12v-7.82l5.53 5.53a11.96 11.96 0 0 0 2.27-2.26l-5.54-5.54h7.83c.07-.51.11-1.04.11-1.59v-.02c0-.55-.04-1.08-.11-1.6z" />
      </svg>
    )},
    { name: 'Tu sistema', glyph: <IPlus className="int-icon int-icon-dim" /> },
  ]
  return (
    <section className="section integrations-section">
      <div className="container">
        <div className="integrations-wrap">
          <div ref={ref} className="reveal">
            <span className="eyebrow"><span className="dot" /> Integraciones</span>
            <h2 className="section-title gradient-text text-left">Se conecta<br />con lo que ya usas.</h2>
            <p className="section-sub integrations-sub">WhatsApp, Instagram, tu calendario, tu pasarela de pagos. Charló habla con todo.</p>
            <a className="btn btn-ghost" href="#features">
              Ver todas las integraciones <IArrow className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="integration-grid">
            {tiles.map((t, i) => (
              <div key={i} className={`int-tile${t.featured ? ' featured' : ''}`}>
                <span className="glyph">{t.glyph}</span>
                <span>{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Pricing ───────────────────────────────────────────────
function Pricing({ onSelect }: { onSelect: () => void }) {
  const [annual, setAnnual] = useState(false)
  const ref = useReveal()
  const plans = [
    { name: 'Básico',   price: 19, desc: 'Para empezar a automatizar', features: ['Widget web', '300 conversaciones/mes', 'FAQs automáticas', 'Soporte email', '1 canal'] },
    { name: 'Esencial', price: 39, desc: 'El más popular', featured: true, features: ['Todo de Básico', 'WhatsApp oficial', '1.000 conversaciones/mes', 'Reservas automáticas', 'Reporte mensual'] },
    { name: 'Pro',      price: 69, desc: 'Para negocios en crecimiento', features: ['Todo de Esencial', 'Conversaciones ilimitadas', '2 canales', 'Dashboard analytics', 'Soporte prioritario'] },
  ]
  return (
    <section className="section" id="pricing">
      <div className="container">
        <div ref={ref} className="reveal section-head">
          <span className="eyebrow"><span className="dot" /> Precios</span>
          <h2 className="section-title gradient-text">Planes simples, sin sorpresas.</h2>
          <p className="section-sub">Elige el plan que mejor se adapta a tu negocio. Cancela cuando quieras.</p>
          <div className="mt-7 flex justify-center">
            <div className="pricing-toggle" role="tablist">
              <button role="tab" aria-selected={!annual} className={!annual ? 'active' : ''} onClick={() => setAnnual(false)}>Mensual</button>
              <button role="tab" aria-selected={annual} className={annual ? 'active' : ''} onClick={() => setAnnual(true)}>
                Anual <span className="save-badge">-20%</span>
              </button>
            </div>
          </div>
        </div>
        <div className="plans">
          {plans.map((p, i) => {
            const price = annual ? Math.round(p.price * 0.8) : p.price
            return (
              <article key={i} className={`plan${p.featured ? ' featured' : ''}`}>
                {p.featured && <div className="plan-label-popular">Más popular</div>}
                <div className="plan-name">{p.name}</div>
                <div className="plan-price">
                  <span className="num">${price}</span>
                  <span className="per">/mes{annual ? ' (facturado anual)' : ''}</span>
                </div>
                <div className="plan-desc">{p.desc}</div>
                <ul className="plan-list">
                  {p.features.map((f, j) => (
                    <li key={j}><span className="tick"><ICheck className="w-3.5 h-3.5" /></span>{f}</li>
                  ))}
                </ul>
                <button
                  className={`${p.featured ? 'btn btn-primary' : 'btn btn-ghost'} justify-center`}
                  onClick={onSelect}
                >
                  Empezar ahora
                </button>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ── FAQ ───────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState(0)
  const ref = useReveal()
  const items = [
    { q: '¿Cuánto tiempo toma configurarlo?',       a: 'Menos de 5 minutos. Conectas tu WhatsApp Business, eliges una plantilla por industria y Charló queda activo. Sin código, sin instalaciones.' },
    { q: '¿Necesito tener WhatsApp Business API?',  a: 'No. Te ayudamos a obtenerla gratis durante el onboarding. También puedes usar Charló con un número de WhatsApp Business tradicional para empezar.' },
    { q: '¿Mis clientes notarán que es un bot?',    a: 'Charló habla con el tono y personalidad que tú defines. Puedes presentarlo como tu asistente virtual o como una extensión natural de tu negocio. Tú decides.' },
    { q: '¿Qué pasa si la IA no sabe responder algo?', a: 'Charló escala automáticamente a un humano cuando detecta una pregunta fuera de su contexto. Tú recibes una notificación y respondes desde la app.' },
    { q: '¿Funciona en otros países además de Colombia?', a: 'Sí. Aunque estamos enfocados en LATAM, funciona en cualquier país. El soporte y onboarding están en español.' },
    { q: '¿Puedo cancelar cuando quiera?',          a: 'Claro. Cancelas con un clic, sin penalizaciones ni preguntas. Los 15 días de prueba son completamente gratis y sin tarjeta de crédito.' },
    { q: '¿Mis datos están seguros?',               a: 'Encriptación end-to-end, hosting en Colombia, cumplimiento de la Ley 1581 de Habeas Data. Tus conversaciones nunca se usan para entrenar modelos externos.' },
  ]
  return (
    <section className="section" id="faq">
      <div className="container">
        <div ref={ref} className="reveal section-head">
          <span className="eyebrow"><span className="dot" /> Preguntas frecuentes</span>
          <h2 className="section-title gradient-text">Lo que todos preguntan.</h2>
          <p className="section-sub">¿Algo más? <a href="mailto:hola@charloai.com" className="faq-email-link">Escríbenos</a> — respondemos en segundos (cómo no).</p>
        </div>
        <div className="faq">
          {items.map((it, i) => (
            <div key={i} className={`faq-item${open === i ? ' open' : ''}`}>
              <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                <span>{it.q}</span>
                <span className="icon"><IPlus className="w-3.5 h-3.5" /></span>
              </button>
              <div className="faq-a" role="region">
                <div className="faq-a-inner">
                  <div className="faq-a-inner-pad">{it.a}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FinalCTA ──────────────────────────────────────────────
function FinalCTA() {
  const ref = useReveal()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="final-cta" id="signup">
      <div className="grid-bg" />
      <div className="container center" ref={ref}>
        <span className="eyebrow"><span className="dot" /> Empieza hoy</span>
        <h2>
          <span className="gradient-text">Mientras dudas,</span><br />
          <span className="violet-text">otro negocio ya respondió.</span>
        </h2>
        <p>15 días gratis. Sin tarjeta de crédito. Cancela cuando quieras.</p>
        {status === 'success' ? (
          <p className="cta-success">✓ ¡Listo! Revisa tu correo para continuar.</p>
        ) : (
          <form className="cta-form" onSubmit={(e) => void handleSubmit(e)}>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Tu correo electrónico"
            />
            <button className="btn btn-primary" type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Enviando…' : 'Comenzar ahora'}
              {status !== 'loading' && <IArrow className="w-3.5 h-3.5" />}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="cta-error">Algo salió mal. Intenta de nuevo.</p>
        )}
        <div className="cta-tagline">
          ✦ Más de 200 negocios en Colombia ya automatizan con Charló
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="brand">
              <BrandMark size={32} />
              Charló AI
            </div>
            <p className="footer-brand-desc">El asistente de WhatsApp con IA para negocios locales en Colombia y LATAM.</p>
          </div>
          <div className="footer-col">
            <h4>Producto</h4>
            <ul>
              <li><a href="#features">Características</a></li>
              <li><a href="#pricing">Precios</a></li>
              <li><a href="#demo">Demo en vivo</a></li>
              <li><a href="#faq">Preguntas</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Industrias</h4>
            <ul>
              <li><a href="#features">Restaurantes</a></li>
              <li><a href="#features">Clínicas</a></li>
              <li><a href="#features">Salones de belleza</a></li>
              <li><a href="#features">Inmobiliarias</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Términos</a></li>
              <li><a href="#">Privacidad</a></li>
              <li><a href="#">Habeas Data</a></li>
              <li><a href="mailto:hola@charloai.com">Contacto</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 Charló AI — Soluciones inteligentes para WhatsApp. Hecho en Popayán, Colombia.</div>
          <div className="footer-social">
            <a href="https://www.instagram.com/charloai" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><IInsta /></a>
            <a href="https://www.linkedin.com/company/charloai" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><ILinkedin /></a>
          </div>
        </div>
        <p className="footer-legal">
          Charló AI es un producto de GAVIRIA CERON NICOLAS · NIT 1059236708 · Popayán, Colombia
        </p>
      </div>
    </footer>
  )
}

// ── Page ──────────────────────────────────────────────────
export default function Home() {
  const scrollToSignup = () => {
    const el = document.getElementById('signup')
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - 40
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_APP) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_FAQ) }}
      />

      <CursorGlow />
      <Nav onCtaClick={scrollToSignup} />
      <main>
        <Hero onCtaClick={scrollToSignup} />
        <TrustStrip />
        <Stats />
        <Pipeline />
        <Features />
        <Industries />
        <Comparison />
        <DemoChat />
        <CustomerLogos />
        <Testimonials />
        <Integrations />
        <Pricing onSelect={scrollToSignup} />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
