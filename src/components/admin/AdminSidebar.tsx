'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Star, LayoutDashboard, Dumbbell, Calendar, Image, Phone, LogOut, Users, X, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/servicios', label: 'Servicios', icon: Dumbbell },
  { href: '/admin/profesores', label: 'Profesores', icon: Users },
  { href: '/admin/beneficios', label: 'Beneficios', icon: Award },
  { href: '/admin/horarios', label: 'Horarios', icon: Calendar },
  { href: '/admin/galeria', label: 'Galería', icon: Image },
  { href: '/admin/contacto', label: 'Contacto', icon: Phone },
]

interface AdminSidebarProps {
  open?: boolean
  onClose?: () => void
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Sesión cerrada')
    router.push('/admin/login')
    router.refresh()
  }

  const handleNavClick = () => {
    onClose?.()
  }

  const sidebarContent = (
    <aside className="flex h-full flex-col border-r border-border/60 bg-card w-60 shrink-0">
      <div className="flex items-center justify-between px-6 py-5 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-[var(--gold)] text-[var(--gold)]" />
          <span className="font-black text-[var(--gold)]">Academia</span>
          <span className="font-black">JM</span>
        </div>
        {/* Botón cerrar — solo visible en móvil */}
        <button
          onClick={onClose}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors text-muted-foreground"
          aria-label="Cerrar menú"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-[var(--gold)]/10 text-[var(--gold)]'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-border/60">
        <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
          <LogOut className="mr-3 h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop: siempre visible */}
      <div className="hidden md:flex h-full">
        {sidebarContent}
      </div>

      {/* Móvil: drawer flotante con overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Overlay oscuro */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Panel del sidebar */}
          <div className="relative h-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
