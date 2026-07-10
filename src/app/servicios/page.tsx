export const dynamic = 'force-dynamic'

import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Music, Waves, Flame, Zap, Heart, Dumbbell, ArrowRight } from 'lucide-react'
import type { Servicio, Profesor } from '@/lib/types'

export const metadata = { title: 'Servicios — Academia JM' }

const iconMap: Record<string, React.ReactNode> = {
  Music: <Music className="h-8 w-8" />,
  Zap: <Zap className="h-8 w-8" />,
  Flame: <Flame className="h-8 w-8" />,
  Heart: <Heart className="h-8 w-8" />,
  Dumbbell: <Dumbbell className="h-8 w-8" />,
  Waves: <Waves className="h-8 w-8" />,
}

async function getServicios(): Promise<Servicio[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('servicios').select('*').eq('activo', true).order('orden')
    return data ?? []
  } catch { return [] }
}

async function getProfesores(): Promise<Profesor[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('profesores').select('*').eq('activo', true).order('orden')
    return data ?? []
  } catch { return [] }
}

export default async function ServiciosPage() {
  const [servicios, profesores] = await Promise.all([getServicios(), getProfesores()])

  return (
    <div className="min-h-screen bg-[#0F0D13]">
      {/* M3 Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-[12px] font-medium tracking-[0.5px] uppercase text-[var(--gold)] mb-3">Academia JM</p>
          <h1 className="text-[45px] md:text-[57px] font-normal leading-[52px] md:leading-[64px] text-[#E6E0E9] mb-4">
            Nuestros Servicios
          </h1>
          <p className="text-[16px] leading-[24px] tracking-[0.5px] text-[#CAC4D0] max-w-xl">
            Descubre todas las disciplinas que ofrecemos. Cada clase está diseñada para que disfrutes, aprendas y te superes.
          </p>
        </div>
      </section>

      {/* M3 Divider */}
      <div className="h-px bg-[#49454F] mx-4" />

      {/* Grid de servicios */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-6xl">
          {servicios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {servicios.map((servicio, i) => (
                <ServicioCardLink key={servicio.id} servicio={servicio} index={i} />
              ))}
            </div>
          ) : (
            <p className="text-[#938F99] text-[14px] py-8">Próximamente...</p>
          )}
        </div>
      </section>

      {/* Instructores */}
      <section className="py-16 px-4 bg-[#141218]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <p className="text-[12px] font-medium tracking-[0.5px] uppercase text-[var(--gold)] mb-3">Equipo</p>
            <h2 className="text-[32px] font-normal leading-[40px] text-[#E6E0E9]">Nuestros instructores</h2>
          </div>

          {profesores.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profesores.map((p) => <ProfesorCard key={p.id} profesor={p} />)}
            </div>
          ) : (
            <p className="text-[#938F99] text-[14px]">Próximamente...</p>
          )}
        </div>
      </section>
    </div>
  )
}

function ServicioCardLink({ servicio, index }: { servicio: Servicio; index: number }) {
  const href = servicio.id ? `/servicios/${servicio.id}` : '#'

  return (
    <Link
      href={href}
      className="group block bg-[#211F26] rounded-[28px] overflow-hidden hover:bg-[#2B2930] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.3),0_2px_6px_2px_rgba(0,0,0,0.15)]"
    >
      <div className="relative h-48 bg-[#2B2930] flex items-center justify-center overflow-hidden">
        {servicio.imagen_url ? (
          <Image src={servicio.imagen_url} alt={servicio.nombre} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="text-[var(--gold)]/50 group-hover:text-[var(--gold)] transition-colors">
            {servicio.icono && iconMap[servicio.icono] ? iconMap[servicio.icono] : <Music className="h-8 w-8" />}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#211F26] via-transparent to-transparent" />
      </div>
      <div className="p-6">
        <h2 className="text-[22px] font-normal leading-[28px] text-[#E6E0E9] mb-2 group-hover:text-[var(--gold)] transition-colors">{servicio.nombre}</h2>
        {servicio.descripcion && (
          <p className="text-[14px] leading-[20px] tracking-[0.25px] text-[#CAC4D0] line-clamp-2 mb-4">{servicio.descripcion}</p>
        )}
        <div className="inline-flex items-center gap-1 text-[14px] font-medium text-[var(--gold)]">
          Ver más <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  )
}

function ProfesorCard({ profesor }: { profesor: Profesor }) {
  return (
    <div className="bg-[#211F26] rounded-[28px] overflow-hidden border border-[#49454F] hover:border-[var(--gold)]/40 transition-colors">
      <div className="relative h-56 bg-[#2B2930] flex items-center justify-center">
        {profesor.foto_url ? (
          <Image src={profesor.foto_url} alt={profesor.nombre} fill className="object-cover object-top" />
        ) : (
          <div className="h-20 w-20 rounded-full bg-[var(--gold)]/12 flex items-center justify-center">
            <span className="text-[28px] font-medium text-[var(--gold)]">{profesor.nombre.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#211F26] via-transparent to-transparent" />
      </div>
      <div className="p-6">
        <h3 className="text-[22px] font-normal leading-[28px] text-[#E6E0E9] mb-1">{profesor.nombre}</h3>
        {profesor.especialidad && (
          <p className="text-[12px] font-medium tracking-[0.5px] uppercase text-[var(--gold)] mb-3">{profesor.especialidad}</p>
        )}
        {profesor.bio && (
          <p className="text-[14px] leading-[20px] tracking-[0.25px] text-[#CAC4D0]">{profesor.bio}</p>
        )}
      </div>
    </div>
  )
}
