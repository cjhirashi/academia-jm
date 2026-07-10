'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios', label: 'Clases' },
  { href: '/horarios', label: 'Horarios' },
  { href: '/contacto', label: 'Contacto' },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  if (pathname?.startsWith('/admin')) return null

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-[#1D1B20]/95 backdrop-blur-md shadow-[0_2px_4px_0_rgba(0,0,0,0.3)]'
        : 'bg-transparent'
    )}>
      {/* M3 Top App Bar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Leading: logo */}
        <Link
          href="/"
          className="font-[family-name:var(--font-script)] text-xl text-[#E6E0E9] hover:text-[var(--gold)] transition-colors"
        >
          Academia JM
        </Link>

        {/* Trailing: nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'relative px-4 py-2 rounded-full text-sm font-medium tracking-[0.1px] transition-colors',
                  active
                    ? 'text-[var(--gold)] bg-[var(--gold)]/10'
                    : 'text-[#CAC4D0] hover:text-[#E6E0E9] hover:bg-white/8'
                )}
              >
                {l.label}
                {active && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--gold)]" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Mobile menu button — M3 Icon Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-[#CAC4D0] hover:bg-white/8 transition-colors"
          aria-label="Menú"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav — M3 Modal Navigation Drawer simplified */}
      {open && (
        <nav className="md:hidden bg-[#211F26] border-t border-[#49454F] px-4 py-3 flex flex-col gap-1">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-4 px-4 py-4 rounded-full text-sm font-medium tracking-[0.1px] transition-colors',
                  active
                    ? 'text-[var(--gold)] bg-[var(--gold)]/10'
                    : 'text-[#CAC4D0] hover:text-[#E6E0E9] hover:bg-white/8'
                )}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>
      )}
    </header>
  )
}
