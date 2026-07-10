import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { ServicioCard } from './ServicioCard'
import type { Servicio } from '@/lib/types'

async function getServicios(): Promise<Servicio[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('servicios')
      .select('*')
      .eq('activo', true)
      .order('orden')
    if (error) return []
    return data ?? []
  } catch {
    return []
  }
}

export async function ServiciosSection() {
  const servicios = await getServicios()

  return (
    <section id="servicios" className="section-geo py-28 px-4 bg-[#0d0d0d]">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)] mb-4">Nuestras Clases</p>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Lo que<br />ofrecemos
            </h2>
            <p className="text-sm text-white/40 max-w-xs leading-relaxed">
              Instructores certificados para todos los niveles. Elige la disciplina que más te apasione.
            </p>
          </div>
          <div className="mt-6 h-px bg-gradient-to-r from-[var(--gold)]/60 via-[var(--gold)]/20 to-transparent" />
        </div>

        {servicios.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {servicios.map((s, i) => (
              <ServicioCard key={s.id} servicio={s} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-white/30 text-sm">Próximamente...</p>
        )}
      </div>
    </section>
  )
}
