import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dumbbell, Image, Calendar, Phone } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  if (!isSupabaseConfigured()) return { servicios: 0, galeria: 0, horarios: 0 }
  try {
    const supabase = await createClient()
    const [serviciosRes, galeriaRes, horariosRes] = await Promise.all([
      supabase.from('servicios').select('id', { count: 'exact', head: true }).eq('activo', true),
      supabase.from('galeria').select('id', { count: 'exact', head: true }),
      supabase.from('horarios').select('id', { count: 'exact', head: true }),
    ])
    return {
      servicios: serviciosRes.count ?? 0,
      galeria: galeriaRes.count ?? 0,
      horarios: horariosRes.count ?? 0,
    }
  } catch {
    return { servicios: 0, galeria: 0, horarios: 0 }
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    { title: 'Servicios activos', value: stats.servicios, icon: Dumbbell, href: '/admin/servicios', color: 'text-amber-500' },
    { title: 'Imágenes en galería', value: stats.galeria, icon: Image, href: '/admin/galeria', color: 'text-purple-500' },
    { title: 'Horarios registrados', value: stats.horarios, icon: Calendar, href: '/admin/horarios', color: 'text-rose-500' },
    { title: 'Información de contacto', value: '—', icon: Phone, href: '/admin/contacto', color: 'text-emerald-500' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Resumen del contenido de Academia JM</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href}>
            <Card className="hover:border-[var(--gold)]/40 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
                <c.icon className={`h-5 w-5 ${c.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-black">{c.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-border/60 p-6 bg-card">
        <h2 className="font-bold mb-3">Accesos rápidos</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>→ <Link href="/admin/servicios" className="hover:text-[var(--gold)] transition-colors">Administrar servicios y clases</Link></li>
          <li>→ <Link href="/admin/horarios" className="hover:text-[var(--gold)] transition-colors">Editar horarios semanales</Link></li>
          <li>→ <Link href="/admin/galeria" className="hover:text-[var(--gold)] transition-colors">Subir fotos a la galería</Link></li>
          <li>→ <Link href="/admin/contacto" className="hover:text-[var(--gold)] transition-colors">Actualizar información de contacto</Link></li>
          <li>→ <Link href="/" target="_blank" className="hover:text-[var(--gold)] transition-colors">Ver sitio público ↗</Link></li>
        </ul>
      </div>
    </div>
  )
}
