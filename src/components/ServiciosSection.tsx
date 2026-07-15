import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { ServicioCard } from './ServicioCard'
import type { Servicio } from '@/lib/types'

async function getServicios(): Promise<Servicio[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('servicios').select('*').eq('activo', true).order('orden')
    if (error) return []
    return data ?? []
  } catch {
    return []
  }
}

export async function ServiciosSection() {
  const servicios = await getServicios()

  return (
    <section id="servicios" className="py-20 px-4 bg-[var(--m3-bg)]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <p className="text-[12px] font-medium tracking-[0.5px] uppercase text-[var(--gold)] mb-3">Nuestras Clases</p>
          <h2 className="text-[32px] font-normal leading-[40px] text-[var(--m3-on-surface)] mb-1">Lo que ofrecemos</h2>
          <p className="text-[14px] leading-[20px] tracking-[0.25px] text-[var(--m3-on-surface-v)] max-w-md">
            Instructores certificados para todos los niveles. Elige la disciplina que más te apasione.
          </p>
        </div>

        {servicios.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {servicios.map((s, i) => (
              <ServicioCard key={s.id} servicio={s} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-[var(--m3-outline)] text-[14px] py-8">Próximamente...</p>
        )}
      </div>
    </section>
  )
}
