'use client'

import { useState, useTransition } from 'react'

interface Props {
  clientId: string
  initialActive: boolean
}

export default function BotToggle({ clientId, initialActive }: Props) {
  const [active, setActive] = useState(initialActive)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')

  function toggle() {
    const next = !active
    setActive(next)
    setError('')

    startTransition(async () => {
      try {
        const res = await fetch(`/api/clients/${clientId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ active: next }),
        })
        if (!res.ok) {
          const json = (await res.json()) as { error?: string }
          setActive(!next)
          setError(json.error ?? 'Error al actualizar')
        }
      } catch {
        setActive(!next)
        setError('Error de red')
      }
    })
  }

  return (
    <div className="bot-toggle-wrap">
      <div className="bot-toggle-info">
        <span className={`bot-status-dot${active ? ' on' : ''}`} aria-hidden="true" />
        <div>
          <p className="bot-toggle-label">Estado del bot</p>
          <p className={`bot-toggle-state${active ? ' on' : ''}`}>
            {active ? 'Activo — respondiendo mensajes' : 'Inactivo — pausado'}
          </p>
        </div>
      </div>

      <button
        className={`bot-toggle-btn${active ? ' on' : ''}`}
        onClick={toggle}
        disabled={pending}
        aria-pressed={active}
        aria-label={active ? 'Desactivar bot' : 'Activar bot'}
      >
        <span className="bot-toggle-track">
          <span className="bot-toggle-thumb" />
        </span>
        <span className="bot-toggle-text">{active ? 'Activado' : 'Activar'}</span>
      </button>

      {error && <p className="bot-toggle-error" role="alert">{error}</p>}
    </div>
  )
}
