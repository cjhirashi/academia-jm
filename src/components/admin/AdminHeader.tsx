'use client'

import { ThemeToggle } from '@/components/ThemeToggle'
import { Menu } from 'lucide-react'

interface AdminHeaderProps {
  email: string
  onToggleSidebar?: () => void
}

export function AdminHeader({ email, onToggleSidebar }: AdminHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border/60 px-4 py-3 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {/* Botón hamburguesa — solo en móvil */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors text-muted-foreground"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>
        <p className="text-sm text-muted-foreground">Panel de administración</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-xs text-muted-foreground">{email}</span>
        <ThemeToggle />
      </div>
    </header>
  )
}
