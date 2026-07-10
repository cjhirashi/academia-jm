export const dynamic = 'force-dynamic'

import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Music, Waves, Flame, Zap, Heart, Dumbbell, ArrowRight } from 'lucide-react'
import { SERVICIOS_DEFAULT } from '@/lib/types'
import type { Servicio } from '@/lib/types'

export const metadata = { title: 'Servicios — Academia JM' }

const iconMap: Record<string, React.ReactNode> = {
  Music: <Music className="h-10 w-10" />,
  Zap: <Zap className="h-10 w-10" />,
  Flame: <Flame className="h-10 w-10" />,
  Heart: <Heart className="h-10 w-10" />,
  Dumbbell: <Dumbbell className="h-10 w-10" />,
  Waves: <Waves className="h-10 w-10" />,
}

async function getServicios(): Promise<Servicio[]> {
  if (!isSupabaseConfigured()) return SERVICIOS_DEFAULT as Servicio[]
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('servicios')
      .select('*')
      .eq('activo', true)
      .order('orden')
    return data?.length ? data : (SERVICIOS_DEFAULT as Servicio[])
  } catch {
    return SERVICIOS_DEFAULT as Servicio[]
  }
}

export default async function ServiciosPage() {
  const servicios = await getServicios()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-[#0D0D0D] via-[#150510] to-[#0D0D0D]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-transparent to-transparent" />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--gold)] mb-4">Academia JM</p>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            Nuestros{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] to-[var(--blue-jm)]">
              Servicios
            </span>
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            Descubre todas las disciplinas que ofrecemos. Cada clase está diseñada para que disfrutes, aprendas y te superes.
          </p>
        </div>
      </section>

      {/* Grid de servicios */}
      <section className="py-20 px-4 bg-background">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicios.map((servicio, i) => (
              <ServicioCardLink key={servicio.id ?? servicio.nombre} servicio={servicio} index={i} iconMap={iconMap} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// Server-compatible card con link al detalle
function ServicioCardLink({
  servicio,
  index,
  iconMap,
}: {
  servicio: Servicio
  index: number
  iconMap: Record<string, React.ReactNode>
}) {
  const href = servicio.id ? `/servicios/${servicio.id}` : '#'

  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-border/60 hover:border-[var(--gold)]/50 bg-card overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Imagen o placeholder */}
      <div className="relative h-52 bg-gradient-to-br from-fuchsia-900/30 to-blue-900/30 flex items-center justify-center overflow-hidden">
        {servicio.imagen_url ? (
          <Image
            src={servicio.imagen_url}
            alt={servicio.nombre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-[var(--gold)]/70 group-hover:text-[var(--gold)] transition-colors">
            {servicio.icono && iconMap[servicio.icono]
              ? iconMap[servicio.icono]
              : <Music className="h-10 w-10" />}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="p-6">
        <h2 className="text-xl font-black mb-2 group-hover:text-[var(--gold)] transition-colors">{servicio.nombre}</h2>
        {servicio.descripcion && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{servicio.descripcion}</p>
        )}
        <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-[var(--gold)]">
          Ver más <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}
