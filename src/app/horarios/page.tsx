export const dynamic = 'force-dynamic'

import { HorariosTable } from '@/components/HorariosTable'
import { COLORES_SERVICIO } from '@/lib/types'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'

export const metadata = { title: 'Horarios — Academia JM' }

async function getServicios() {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('servicios').select('nombre').eq('activo', true).order('orden')
    return data?.map((s) => s.nombre) ?? []
  } catch {
    return []
  }
}

export default async function HorariosPage() {
  const servicios = await getServicios()

  return (
    <div className="min-h-screen bg-[var(--m3-bg)] pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* M3 Page header */}
        <div className="mb-10">
          <p className="text-[12px] font-medium tracking-[0.5px] uppercase text-[var(--gold)] mb-3">Horarios</p>
          <h1 className="text-[45px] font-normal leading-[52px] text-[var(--m3-on-surface)] mb-2">Clases semanales</h1>
          <p className="text-[16px] leading-[24px] tracking-[0.5px] text-[var(--m3-on-surface-v)] max-w-xl">
            Consulta el horario completo y elige la clase que mejor se adapte a tu día.
          </p>
        </div>

        <HorariosTable />

        {servicios.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {servicios.map((nombre, i) => (
              <span key={nombre} className={`inline-flex items-center gap-2 rounded-full px-4 h-8 text-[12px] font-medium text-white ${COLORES_SERVICIO[i % COLORES_SERVICIO.length]}`}>
                {nombre}
              </span>
            ))}
          </div>
        )}

        <p className="mt-6 text-[12px] leading-[16px] tracking-[0.4px] text-[var(--m3-outline)]">
          * Los horarios pueden variar. Contáctanos para confirmar disponibilidad.
        </p>
      </div>
    </div>
  )
}
