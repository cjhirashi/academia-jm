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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      scrolled
        ? 'bg-black/80 backdrop-blur-md border-b border-white/5'
        : 'bg-transparent border-b border-transparent'
    )}>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo en script */}
        <Link href="/" className="font-[family-name:var(--font-script)] text-2xl text-white hover:text-[var(--gold)] transition-colors">
          Academia JM
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'text-sm font-medium tracking-wide transition-colors',
                pathname === l.href
                  ? 'text-[var(--gold)]'
                  : 'text-white/70 hover:text-white'
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 text-white/70 hover:text-white transition-colors"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden bg-black/95 border-t border-white/5 px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                'text-sm font-medium tracking-wide transition-colors',
                pathname === l.href ? 'text-[var(--gold)]' : 'text-white/70 hover:text-white'
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
