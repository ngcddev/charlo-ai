'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth'

interface Props {
  clientId: string | null
  businessName: string
  botName: string
  userEmail: string
}

const NAV = [
  {
    href: '/dashboard',
    label: 'Panel',
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
        <rect x="1.5" y="1.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="9.5" y="1.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1.5" y="9.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="9.5" y="9.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    href: '/dashboard/settings',
    label: 'Configuración',
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
        <circle cx="8.5" cy="8.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8.5 1.5V3M8.5 14V15.5M1.5 8.5H3M14 8.5H15.5M3.55 3.55L4.6 4.6M12.4 12.4L13.45 13.45M3.55 13.45L4.6 12.4M12.4 4.6L13.45 3.55"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
]

export default function DashboardSidebar({ clientId, businessName, botName, userEmail }: Props) {
  const pathname = usePathname()
  const router   = useRouter()
  const [open, setOpen]     = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    await signOut()
    router.replace('/login')
  }

  // Initials avatar from business name
  const initials = businessName
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  return (
    <>
      {/* Mobile top bar */}
      <header className="db-topbar">
        <a href="/" className="db-topbar-brand">
          <svg width="20" height="24" viewBox="0 0 26 32" fill="none" aria-hidden="true">
            <path d="M13 2L24 8V20L13 26L2 20V8L13 2Z" stroke="#a78bfa" strokeWidth="1.5" fill="none" />
            <circle cx="13" cy="14" r="3.5" fill="#a78bfa" />
            <path d="M13 17.5V22" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>Charló</span>
        </a>
        <button
          className="db-topbar-toggle"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen(v => !v)}
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="db-overlay"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`db-sidebar${open ? ' open' : ''}`}>
        {/* Logo */}
        <a href="/" className="db-sidebar-brand">
          <svg width="22" height="27" viewBox="0 0 26 32" fill="none" aria-hidden="true">
            <path d="M13 2L24 8V20L13 26L2 20V8L13 2Z" stroke="#a78bfa" strokeWidth="1.5" fill="none" />
            <circle cx="13" cy="14" r="3.5" fill="#a78bfa" />
            <path d="M13 17.5V22" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>Charló</span>
        </a>

        {/* Business pill */}
        <div className="db-biz-pill">
          <span className="db-biz-avatar">{initials}</span>
          <div className="db-biz-info">
            <span className="db-biz-name">{businessName}</span>
            <span className="db-biz-bot">{botName}</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="db-nav" aria-label="Navegación del panel">
          {NAV.map(item => {
            const active =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href)
            return (
              <a
                key={item.href}
                href={item.href}
                className={`db-nav-link${active ? ' active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            )
          })}
        </nav>

        {/* Bottom: user + sign out */}
        <div className="db-sidebar-foot">
          <div className="db-user-row">
            <div className="db-user-dot" aria-hidden="true" />
            <span className="db-user-email">{userEmail}</span>
          </div>
          <button
            className="db-signout-btn"
            onClick={handleSignOut}
            disabled={signingOut}
            aria-label="Cerrar sesión"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {signingOut ? 'Saliendo…' : 'Cerrar sesión'}
          </button>
        </div>
      </aside>
    </>
  )
}
