import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { DIAS_SEMANA, COLORES_SERVICIO } from '@/lib/types'
import type { Horario, Servicio } from '@/lib/types'

const HORAS = ['07:00', '08:00', '09:00', '10:00', '11:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']

const HORARIOS_DEFAULT: (Horario & { servicio: Servicio })[] = [
  { id: '1', servicio_id: 'salsa', dia_semana: 1, hora_inicio: '09:00:00', hora_fin: '10:00:00', salon: 'Salón A', servicio: { id: 'salsa', nombre: 'Salsa', descripcion: null, icono: 'Music', imagen_url: null, orden: 1, activo: true, created_at: '' } },
  { id: '2', servicio_id: 'zumba', dia_semana: 2, hora_inicio: '18:00:00', hora_fin: '19:00:00', salon: 'Salón B', servicio: { id: 'zumba', nombre: 'Zumba', descripcion: null, icono: 'Flame', imagen_url: null, orden: 3, activo: true, created_at: '' } },
  { id: '3', servicio_id: 'yoga', dia_semana: 3, hora_inicio: '07:00:00', hora_fin: '08:00:00', salon: 'Salón A', servicio: { id: 'yoga', nombre: 'Yoga', descripcion: null, icono: 'Heart', imagen_url: null, orden: 5, activo: true, created_at: '' } },
  { id: '4', servicio_id: 'salsa', dia_semana: 4, hora_inicio: '19:00:00', hora_fin: '20:00:00', salon: 'Salón A', servicio: { id: 'salsa', nombre: 'Salsa', descripcion: null, icono: 'Music', imagen_url: null, orden: 1, activo: true, created_at: '' } },
  { id: '5', servicio_id: 'jumping', dia_semana: 5, hora_inicio: '10:00:00', hora_fin: '11:00:00', salon: 'Salón C', servicio: { id: 'jumping', nombre: 'Jumping', descripcion: null, icono: 'Zap', imagen_url: null, orden: 4, activo: true, created_at: '' } },
  { id: '6', servicio_id: 'cumbia', dia_semana: 6, hora_inicio: '11:00:00', hora_fin: '12:00:00', salon: 'Salón A', servicio: { id: 'cumbia', nombre: 'Cumbia', descripcion: null, icono: 'Waves', imagen_url: null, orden: 2, activo: true, created_at: '' } },
]

async function getHorarios() {
  if (!isSupabaseConfigured()) return HORARIOS_DEFAULT
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('horarios')
      .select('*, servicio:servicios(*)')
      .order('hora_inicio')
    if (error || !data?.length) return HORARIOS_DEFAULT
    return data as (Horario & { servicio: Servicio })[]
  } catch {
    return HORARIOS_DEFAULT
  }
}

function horaLabel(time: string) {
  return time.substring(0, 5)
}

export async function HorariosTable({ preview = false }: { preview?: boolean }) {
  const horarios = await getHorarios()

  const mapa: Record<string, Record<number, (Horario & { servicio: Servicio })[]>> = {}
  horarios.forEach((h) => {
    const hora = horaLabel(h.hora_inicio)
    if (!mapa[hora]) mapa[hora] = {}
    if (!mapa[hora][h.dia_semana]) mapa[hora][h.dia_semana] = []
    mapa[hora][h.dia_semana].push(h)
  })

  const servicioNombres = [...new Set(horarios.map((h) => h.servicio?.nombre ?? ''))]
  const colorMap: Record<string, string> = {}
  servicioNombres.forEach((n, i) => { colorMap[n] = COLORES_SERVICIO[i % COLORES_SERVICIO.length] })

  const horas = preview ? HORAS.slice(0, 5) : HORAS

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="bg-muted/60">
            <th className="px-3 py-3 text-left font-semibold text-muted-foreground w-20">Hora</th>
            {DIAS_SEMANA.map((d) => (
              <th key={d} className="px-2 py-3 text-center font-semibold text-muted-foreground">{d.slice(0, 3)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {horas.map((hora, idx) => (
            <tr key={hora} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
              <td className="px-3 py-2 text-muted-foreground font-mono text-xs">{hora}</td>
              {DIAS_SEMANA.map((_, diaIdx) => {
                const dia = diaIdx + 1
                const clases = mapa[hora]?.[dia] ?? []
                return (
                  <td key={dia} className="px-1 py-1.5 text-center">
                    {clases.map((c) => (
                      <span
                        key={c.id}
                        className={`inline-block rounded-md px-2 py-1 text-xs font-semibold text-white ${colorMap[c.servicio?.nombre ?? ''] ?? 'bg-gray-500'}`}
                        title={c.salon ?? ''}
                      >
                        {c.servicio?.nombre ?? '—'}
                      </span>
                    ))}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
