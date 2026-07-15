'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'

const modes = [
  { key: 'light', Icon: Sun, label: 'Claro' },
  { key: 'dark', Icon: Moon, label: 'Oscuro' },
  { key: 'system', Icon: Monitor, label: 'Sistema' },
] as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return (
    <div className="h-8 w-[88px] rounded-full border border-foreground/20 bg-foreground/[0.06]" />
  )

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-foreground/25 bg-foreground/[0.06] p-0.5"
      title="Cambiar tema"
    >
      {modes.map(({ key, Icon, label }) => {
        const active = theme === key
        return (
          <button
            key={key}
            onClick={() => setTheme(key)}
            aria-label={label}
            title={label}
            className={`
              flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200
              ${active
                ? 'bg-[var(--gold)] text-white shadow-sm'
                : 'text-foreground/60 hover:bg-foreground/10 hover:text-foreground'
              }
            `}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        )
      })}
    </div>
  )
}
