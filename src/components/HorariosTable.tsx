import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { DIAS_SEMANA, COLORES_SERVICIO } from '@/lib/types'
import type { Horario, Servicio } from '@/lib/types'

const HORAS = ['07:00', '08:00', '09:00', '10:00', '11:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']

async function getHorarios() {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('horarios')
      .select('*, servicio:servicios(*)')
      .order('hora_inicio')
    if (error) return []
    return (data ?? []) as (Horario & { servicio: Servicio })[]
  } catch {
    return []
  }
}

function horaLabel(time: string) {
  return time.substring(0, 5)
}

export async function HorariosTable({ preview = false }: { preview?: boolean }) {
  const horarios = await getHorarios()

  if (horarios.length === 0) {
    return <p className="text-white/30 text-sm py-4">Próximamente...</p>
  }

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
