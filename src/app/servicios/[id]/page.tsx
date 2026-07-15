export const dynamic = 'force-dynamic'

import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Music, Waves, Flame, Zap, Heart, Dumbbell, ArrowLeft, Clock, Star } from 'lucide-react'
import { HorariosTable } from '@/components/HorariosTable'
import type { Servicio, Profesor, ServicioGaleria } from '@/lib/types'

const iconMap: Record<string, React.ReactNode> = {
  Music: <Music className="h-12 w-12" />,
  Zap: <Zap className="h-12 w-12" />,
  Flame: <Flame className="h-12 w-12" />,
  Heart: <Heart className="h-12 w-12" />,
  Dumbbell: <Dumbbell className="h-12 w-12" />,
  Waves: <Waves className="h-12 w-12" />,
}

async function getData(id: string) {
  if (!isSupabaseConfigured()) return null
  try {
    const supabase = await createClient()
    const [servicioRes, profesoresRes, galeriaRes] = await Promise.all([
      supabase.from('servicios').select('*').eq('id', id).single(),
      supabase
        .from('servicio_profesores')
        .select('profesor:profesores(*)')
        .eq('servicio_id', id),
      supabase
        .from('servicio_galeria')
        .select('*')
        .eq('servicio_id', id)
        .order('orden'),
    ])

    if (servicioRes.error || !servicioRes.data) return null

    const profesores = (profesoresRes.data ?? [])
      .map((r: { profesor: Profesor | Profesor[] }) => Array.isArray(r.profesor) ? r.profesor[0] : r.profesor)
      .filter(Boolean) as Profesor[]

    return {
      servicio: servicioRes.data as Servicio,
      profesores,
      galeria: (galeriaRes.data ?? []) as ServicioGaleria[],
    }
  } catch {
    return null
  }
}

export default async function ServicioDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getData(id)

  if (!result || !result.servicio) notFound()

  const { servicio, profesores, galeria } = result

  return (
    <div className="min-h-screen">
      {/* Hero del servicio */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        {servicio.imagen_url ? (
          <Image src={servicio.imagen_url} alt={servicio.nombre} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--m3-bg)] via-[var(--m3-surface-container)] to-[var(--m3-bg)] flex items-center justify-center">
            <div className="text-[var(--gold)]/40">
              {servicio.icono && iconMap[servicio.icono] ? iconMap[servicio.icono] : <Music className="h-12 w-12" />}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 max-w-6xl mx-auto">
          <Link href="/servicios" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-[var(--gold)] transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" /> Todos los servicios
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">{servicio.nombre}</h1>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-20">

        {/* Descripción */}
        {servicio.descripcion && (
          <section>
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--gold)] mb-4">Sobre esta clase</p>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">{servicio.descripcion}</p>
          </section>
        )}

        {/* Galería de imágenes del servicio */}
        {galeria.length > 0 && (
          <section>
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--gold)] mb-4">Galería</p>
            <h2 className="text-3xl font-black mb-8">Fotos de la clase</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {galeria.map((img, i) => (
                <div
                  key={img.id}
                  className={`relative overflow-hidden rounded-xl bg-muted ${i === 0 ? 'col-span-2 row-span-2 aspect-video' : 'aspect-square'}`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? servicio.nombre}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </section>
        )}


        {/* Profesores */}
        {profesores.length > 0 && (
          <section>
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--gold)] mb-4">Instructores</p>
            <h2 className="text-3xl font-black mb-8">Conoce a tus profesores</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {profesores.map((p) => (
                <ProfesorCard key={p.id} profesor={p} />
              ))}
            </div>
          </section>
        )}

        {/* Horarios de esta clase */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--gold)] mb-4">Horarios</p>
          <h2 className="text-3xl font-black mb-4">Cuándo puedes tomar esta clase</h2>
          <p className="text-muted-foreground mb-8">Consulta el horario semanal completo y elige el día que mejor se adapte a ti.</p>
          <HorariosTable preview />
          <div className="mt-6">
            <Link href="/horarios" className="text-sm font-semibold text-[var(--gold)] hover:underline inline-flex items-center gap-1">
              Ver horario completo <ArrowLeft className="h-3 w-3 rotate-180" />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-gradient-to-br from-fuchsia-900/20 to-blue-900/20 border border-[var(--gold)]/20 p-10 text-center">
          <Star className="h-8 w-8 text-[var(--gold)] mx-auto mb-4" />
          <h2 className="text-3xl font-black mb-3">¿Listo para empezar {servicio.nombre}?</h2>
          <p className="text-muted-foreground mb-6">La primera clase de prueba es gratis. ¡Escríbenos y reserva tu lugar!</p>
          <a
            href="https://wa.me/5553465764"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-green-500 hover:bg-green-400 transition-colors px-6 py-3 text-white font-bold"
          >
            Reservar clase por WhatsApp
          </a>
        </section>
      </div>
    </div>
  )
}

function ProfesorCard({ profesor }: { profesor: Profesor }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
      {/* Foto */}
      <div className="relative h-56 bg-gradient-to-br from-fuchsia-900/20 to-blue-900/30 flex items-center justify-center">
        {profesor.foto_url ? (
          <Image src={profesor.foto_url} alt={profesor.nombre} fill className="object-cover object-top" />
        ) : (
          <div className="h-20 w-20 rounded-full bg-[var(--gold)]/20 flex items-center justify-center">
            <span className="text-3xl font-black text-[var(--gold)]">
              {profesor.nombre.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-black text-lg">{profesor.nombre}</h3>
        {profesor.especialidad && (
          <p className="text-sm font-semibold text-[var(--gold)] mb-2">{profesor.especialidad}</p>
        )}
        {profesor.bio && (
          <p className="text-sm text-muted-foreground leading-relaxed">{profesor.bio}</p>
        )}
      </div>
    </div>
  )
}
