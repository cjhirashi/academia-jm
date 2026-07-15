'use client'

import { ThemeToggle } from '@/components/ThemeToggle'

export function AdminHeader({ email }: { email: string }) {
  return (
    <header className="flex items-center justify-between border-b border-border/60 px-6 py-3 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <p className="text-sm text-muted-foreground">Panel de administración</p>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">{email}</span>
        <ThemeToggle />
      </div>
    </header>
  )
}
