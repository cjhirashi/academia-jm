export const dynamic = 'force-dynamic'

import { HorariosTable } from '@/components/HorariosTable'
import { COLORES_SERVICIO } from '@/lib/types'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'

export const metadata = { title: 'Horarios — Academia JM' }

async function getServicios() {
  if (!isSupabaseConfigured()) return ['Salsa', 'Cumbia', 'Zumba', 'Jumping', 'Yoga']
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('servicios').select('nombre').eq('activo', true).order('orden')
    return data?.map((s) => s.nombre) ?? ['Salsa', 'Cumbia', 'Zumba', 'Jumping', 'Yoga']
  } catch {
    return ['Salsa', 'Cumbia', 'Zumba', 'Jumping', 'Yoga']
  }
}

export default async function HorariosPage() {
  const servicios = await getServicios()

  return (
    <div className="py-16 px-4 max-w-6xl mx-auto">
      <div className="mb-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--gold)] mb-3">Horarios</p>
        <h1 className="text-5xl font-black mb-4">Clases semanales</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Consulta el horario completo y elige la clase que mejor se adapte a tu día.
        </p>
      </div>

      <HorariosTable />

      {/* Leyenda */}
      <div className="mt-8 flex flex-wrap gap-3">
        {servicios.map((nombre, i) => (
          <span key={nombre} className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-white ${COLORES_SERVICIO[i % COLORES_SERVICIO.length]}`}>
            {nombre}
          </span>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        * Los horarios pueden variar. Contáctanos para confirmar disponibilidad.
      </p>
    </div>
  )
}
