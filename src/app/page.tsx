"use client"

import { useState } from "react"

// ── Icons ────────────────────────────────────────────────────
function MessageCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function CheckCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 7 17l-5-5" />
      <path d="m22 10-9.5 9.5L10 17" />
    </svg>
  )
}

// ── Navbar ───────────────────────────────────────────────────
function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md" role="navigation" aria-label="Navegación principal">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircleIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">Charló AI</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Precios
            </a>
            <a href="#contacto" className="text-muted-foreground hover:text-foreground transition-colors">
              Contacto
            </a>
            <a
              href="#pricing"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Empieza gratis
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Abrir menú"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Precios
              </a>
              <a href="#contacto" className="text-muted-foreground hover:text-foreground transition-colors">
                Contacto
              </a>
              <a
                href="#pricing"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors w-fit"
              >
                Empieza gratis
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// ── Trust Bar ────────────────────────────────────────────────
function TrustBar() {
  return (
    <div className="border-b border-[#2a2a2a] bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-xs text-[#a0a0a0]">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span>WhatsApp Business API</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span>Groq AI</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
            </svg>
            <span>Supabase</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <span>SSL Seguro</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── WhatsApp Chat Mockup ──────────────────────────────────────
function WhatsAppMockup() {
  return (
    <div className="w-full max-w-[380px] mx-auto" aria-label="Demo de conversación de WhatsApp">
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#0a0a0a] overflow-hidden shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="bg-[#111111] px-4 py-4 flex items-center gap-3 border-b border-[#1a1a1a]">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center" aria-hidden="true">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z"/>
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-white font-semibold text-base">La Fogata</div>
            <div className="text-[#6b7280] text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" aria-hidden="true"></span>
              en línea
            </div>
          </div>
          <div className="flex items-center gap-3 text-[#6b7280]">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
            </svg>
          </div>
        </div>

        {/* Chat Area */}
        <div className="bg-[#0a0a0a] px-3 py-4 space-y-3">
          <div className="flex justify-end">
            <div className="bg-[#1e1e1e] rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%]">
              <p className="text-[#e2e2e2] text-[14px] leading-relaxed">Hola, ¿a qué hora cierran hoy?</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[11px] text-[#6b7280]">10:22</span>
                <CheckCheckIcon className="w-4 h-4 text-[#6b7280]" />
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="bg-[#7C3AED]/20 border border-[#7C3AED]/30 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
              <p className="text-[#e2e2e2] text-[14px] leading-relaxed">¡Hola! Cerramos a las 10pm. ¿Te gustaría reservar una mesa?</p>
              <span className="text-[11px] text-[#6b7280] block text-right mt-1">10:22</span>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="bg-[#1e1e1e] rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%]">
              <p className="text-[#e2e2e2] text-[14px] leading-relaxed">Sí, para 2 personas a las 8pm</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[11px] text-[#6b7280]">10:23</span>
                <CheckCheckIcon className="w-4 h-4 text-[#6b7280]" />
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="bg-[#7C3AED]/20 border border-[#7C3AED]/30 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
              <p className="text-[#e2e2e2] text-[14px] leading-relaxed">¡Perfecto! Mesa para 2 a las 8pm. ¿A nombre de quién?</p>
              <span className="text-[11px] text-[#6b7280] block text-right mt-1">10:23</span>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="bg-[#1e1e1e] rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%]">
              <p className="text-[#e2e2e2] text-[14px] leading-relaxed">Carlos Martínez</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[11px] text-[#6b7280]">10:24</span>
                <CheckCheckIcon className="w-4 h-4 text-[#6b7280]" />
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="bg-[#7C3AED]/20 border border-[#7C3AED]/30 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
              <p className="text-[#e2e2e2] text-[14px] leading-relaxed">¡Reserva confirmada, Carlos!</p>
              <div className="mt-2 p-3 bg-[#1b1b1b] rounded-xl text-[13px] text-[#a0a0a0] space-y-1.5">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#7C3AED]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                  </svg>
                  <span>Hoy, 8:00 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#7C3AED]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  </svg>
                  <span>2 personas</span>
                </div>
              </div>
              <p className="text-[#e2e2e2] text-[14px] leading-relaxed mt-2">¡Te esperamos!</p>
              <span className="text-[11px] text-[#6b7280] block text-right mt-1">10:24</span>
            </div>
          </div>

          {/* Typing indicator */}
          <div className="flex justify-start">
            <div className="bg-[#1b1b1b] border border-[#2a2a2a] rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-1" aria-label="Escribiendo">
                <span className="w-2 h-2 bg-[#6b7280] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-[#6b7280] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-[#6b7280] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="bg-[#111111] px-3 py-3 flex items-center gap-2 border-t border-[#1a1a1a]">
          <div className="flex-1 bg-[#1e1e1e] border border-[#2a2a2a] rounded-full px-4 py-2.5 text-[14px] text-[#6b7280]">
            Escribe un mensaje...
          </div>
          <div className="w-10 h-10 rounded-full bg-[#7C3AED] flex items-center justify-center" aria-hidden="true">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Hero ─────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="demo" className="relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-6 anim-fade-up anim-delay-1">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              IA para negocios locales en Colombia
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground mb-6 text-balance anim-fade-up anim-delay-2">
              Tu negocio responde solo, 24/7
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl anim-fade-up anim-delay-3">
              El asistente de WhatsApp con IA para restaurantes, clínicas y negocios locales en Colombia. Configúralo en 5 minutos, sin código.
            </p>

            <div className="flex flex-wrap gap-4 anim-fade-up anim-delay-4">
              <a
                href="#pricing"
                className="rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Empieza gratis
              </a>
              <a
                href="#demo"
                className="rounded-lg border border-border px-6 py-3 text-base font-semibold text-foreground hover:bg-card transition-colors"
              >
                Ver demo
              </a>
            </div>
          </div>

          <div className="relative z-10 anim-fade-up anim-delay-5">
            <WhatsAppMockup />
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Stats (Problema) ─────────────────────────────────────────
function Stats() {
  const stats = [
    { value: "67%", label: "de clientes no regresan si no reciben respuesta rápida" },
    { value: "4h",  label: "tiempo promedio de respuesta de un negocio local" },
    { value: "24/7", label: "disponibilidad de Charló AI, sin descanso" },
  ]

  return (
    <section className="bg-[#0a0a0a] border-t border-[#2a2a2a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-foreground mb-12 anim-fade-up">
          Cada mensaje sin respuesta es un cliente perdido
        </h2>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className={`text-center anim-fade-up anim-delay-card-${i + 1}`}>
              <div className="text-5xl sm:text-6xl font-bold text-white mb-3">{stat.value}</div>
              <p className="text-[#7C3AED]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Features (Solución) ──────────────────────────────────────
function Features() {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      ),
      title: "Bot con tu identidad",
      description: "Nombre, tono y personalidad de tu negocio. Tu asistente habla exactamente como tú.",
    },
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      title: "Respuesta en segundos",
      description: "No en horas. Respuesta instantánea. Nunca pierdas un cliente por lentitud.",
    },
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" />
        </svg>
      ),
      title: "Sin código, en 5 minutos",
      description: "Onboarding guiado paso a paso. Listo para atender clientes hoy mismo.",
    },
  ]

  return (
    <section id="soluciones" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 anim-fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Todo lo que necesita tu negocio
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Automatiza tu atención al cliente sin perder el toque personal
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors anim-fade-up anim-delay-card-${i + 1}`}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Sectors ──────────────────────────────────────────────────
function Sectors() {
  const sectors = [
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z" />
        </svg>
      ),
      name: "Restaurantes",
      description: "Reservas, menú y horarios automáticos",
    },
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M8 2v4M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
        </svg>
      ),
      name: "Clínicas",
      description: "Citas, recordatorios y consultas",
    },
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="6" cy="6" r="3" /><path d="M6 9v12M13 6h3a2 2 0 0 1 2 2v3M18 22V11m-3 7 3 3 3-3" />
        </svg>
      ),
      name: "Salones de belleza",
      description: "Agenda turnos sin llamadas",
    },
    {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
      ),
      name: "Inmobiliarias",
      description: "Filtros y visitas automatizadas",
    },
  ]

  return (
    <section className="py-16 md:py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 anim-fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Funciona para tu negocio</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Soluciones adaptadas a las necesidades de cada sector
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sectors.map((sector, i) => (
            <div
              key={i}
              className={`rounded-xl border border-border bg-card p-6 text-center hover:border-primary/50 transition-colors anim-fade-up anim-delay-card-${i + 1}`}
            >
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                {sector.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{sector.name}</h3>
              <p className="text-sm text-muted-foreground">{sector.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Pricing ──────────────────────────────────────────────────
function Pricing() {
  const [annual, setAnnual] = useState(false)

  const plans = [
    {
      name: "Básico",
      monthlyPrice: "$19",
      annualPrice: "$15",
      period: "/mes",
      description: "Para empezar a automatizar",
      features: ["Widget web", "300 conversaciones/mes", "FAQs automáticas", "Soporte email"],
      featured: false,
    },
    {
      name: "Esencial",
      monthlyPrice: "$39",
      annualPrice: "$31",
      period: "/mes",
      description: "Lo más popular",
      features: [
        "Todo de Básico",
        "WhatsApp oficial",
        "1.000 conversaciones/mes",
        "Reservas automáticas",
        "Reporte mensual",
      ],
      featured: true,
      badge: "Más popular",
    },
    {
      name: "Pro",
      monthlyPrice: "$69",
      annualPrice: "$55",
      period: "/mes",
      description: "Para negocios en crecimiento",
      features: [
        "Todo de Esencial",
        "Conversaciones ilimitadas",
        "2 canales",
        "Dashboard analytics",
        "Soporte prioritario",
      ],
      featured: false,
    },
  ]

  return (
    <section id="pricing" className="py-16 md:py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 anim-fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Planes simples, sin sorpresas
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            Elige el plan que mejor se adapte a tu negocio
          </p>

          {/* Toggle mensual / anual */}
          <div className="inline-flex items-center gap-1 bg-card border border-border rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !annual ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                annual ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Anual
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${annual ? "bg-white/20 text-white" : "bg-primary/20 text-primary"}`}>
                -20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-xl border p-6 relative anim-fade-up anim-delay-card-${i + 1} ${
                plan.featured
                  ? "border-primary bg-[#1a0533] shadow-lg shadow-primary/10"
                  : "border-border bg-card"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    {annual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                {annual && (
                  <p className="text-xs text-primary mt-1">Facturado anualmente</p>
                )}
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <CheckIcon className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contacto"
                className={`block w-full text-center rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                  plan.featured
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border text-foreground hover:bg-muted"
                }`}
              >
                Empezar ahora
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Testimonials ─────────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    {
      quote: "Desde que usamos Charló AI, las reservas aumentaron un 40%. Los clientes aman poder escribir a cualquier hora.",
      author: "María González",
      role: "Restaurante La Fogata, Popayán",
    },
    {
      quote: "Antes perdíamos pacientes porque no contestábamos rápido. Ahora el bot agenda citas mientras dormimos.",
      author: "Dr. Andrés Mejía",
      role: "Clínica Odontológica Sonrisa, Cali",
    },
    {
      quote: "Mis clientas pueden agendar su cita en 30 segundos. Ya no necesito una recepcionista de tiempo completo.",
      author: "Laura Ríos",
      role: "Salón Glam, Medellín",
    },
  ]

  return (
    <section className="py-16 md:py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 anim-fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Lo que dicen nuestros clientes
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className={`rounded-xl border border-border bg-card p-6 anim-fade-up anim-delay-card-${i + 1}`}
            >
              <div className="flex gap-1 mb-4" aria-label="5 estrellas">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-muted-foreground mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
              <div>
                <div className="font-semibold text-foreground">{testimonial.author}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Final CTA ─────────────────────────────────────────────────
function FinalCTA() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email) return
    setStatus("loading")
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error()
      setStatus("success")
      setEmail("")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section id="contacto" className="py-16 md:py-24 bg-[#0d0618]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 anim-fade-up">
          Empieza hoy con 15 días gratis
        </h2>
        <p className="text-[#a0a0a0] text-lg mb-8 anim-fade-up anim-delay-1">
          Sin tarjeta de crédito. Cancela cuando quieras.
        </p>

        {status === "success" ? (
          <div className="inline-flex items-center gap-3 bg-primary/20 border border-primary/40 rounded-xl px-6 py-4 text-white anim-fade">
            <CheckIcon className="w-5 h-5 text-primary flex-shrink-0" />
            <span>¡Listo! Te avisaremos cuando estés activo.</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto anim-fade-up anim-delay-2"
          >
            <label htmlFor="waitlist-email" className="sr-only">Tu correo electrónico</label>
            <input
              id="waitlist-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={status === "loading"}
              className="flex-1 rounded-lg border border-[#2a2a2a] bg-[#1b1b1b] px-4 py-3 text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-lg bg-[#7C3AED] px-6 py-3 font-semibold text-white hover:bg-[#6d28d9] transition-colors whitespace-nowrap disabled:opacity-60"
            >
              {status === "loading" ? "Enviando..." : "Comenzar ahora"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-3 text-sm text-red-400">Algo salió mal. Inténtalo de nuevo.</p>
        )}
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MessageCircleIcon className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Charló AI</span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-muted-foreground" aria-label="Links del footer">
            <a href="#" className="hover:text-foreground transition-colors">Términos</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacidad</a>
            <a href="#contacto" className="hover:text-foreground transition-colors">Contacto</a>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Charló AI"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn de Charló AI"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          © 2026 Charló AI — Soluciones inteligentes para WhatsApp. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

// ── Page ──────────────────────────────────────────────────────
export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <TrustBar />
      <Hero />
      <Stats />
      <Features />
      <Sectors />
      <Pricing />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  )
}
