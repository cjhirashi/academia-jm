'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Home, Music, Clock, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './ThemeToggle'

const links = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/servicios', label: 'Clases', icon: Music },
  { href: '/horarios', label: 'Horarios', icon: Clock },
  { href: '/contacto', label: 'Contacto', icon: Mail },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Hooks SIEMPRE antes de cualquier return condicional
  useEffect(() => {
    if (pathname?.startsWith('/admin')) return
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  if (pathname?.startsWith('/admin')) return null

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-[var(--m3-nav-bg)]/95 backdrop-blur-md shadow-[0_2px_4px_0_rgba(0,0,0,0.15)]'
        : 'bg-transparent'
    )}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            'font-[family-name:var(--font-script)] text-xl transition-colors hover:text-[var(--gold)]',
            scrolled ? 'text-[var(--m3-on-surface)]' : 'text-white drop-shadow'
          )}
        >
          Academia JM
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium tracking-[0.1px] transition-colors',
                  active
                    ? 'text-[var(--gold)] bg-[var(--gold)]/20'
                    : scrolled
                      ? 'text-[var(--m3-on-surface-v)] hover:text-[var(--m3-on-surface)] hover:bg-[var(--m3-surface-high)]'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
                {active && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--gold)]" />
                )}
              </Link>
            )
          })}
          <div className={cn('ml-2 pl-2 border-l', scrolled ? 'border-[var(--m3-outline-v)]' : 'border-white/20')}>
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile: theme + menu */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className={cn(
              'w-10 h-10 flex items-center justify-center rounded-full transition-colors',
              scrolled
                ? 'text-[var(--m3-on-surface-v)] hover:bg-[var(--m3-surface-high)]'
                : 'text-white/80 hover:bg-white/10'
            )}
            aria-label="Menú"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav className="md:hidden bg-[var(--m3-surface-container)] border-t border-[var(--m3-outline-v)] px-4 py-3 flex flex-col gap-1">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium tracking-[0.1px] transition-colors',
                  active
                    ? 'text-[var(--gold)] bg-[var(--gold)]/10'
                    : 'text-[var(--m3-on-surface-v)] hover:text-[var(--m3-on-surface)] hover:bg-[var(--m3-surface-high)]'
                )}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            )
          })}
        </nav>
      )}
    </header>
  )
}
