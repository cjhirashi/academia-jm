import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { DIAS_SEMANA, COLORES_SERVICIO } from '@/lib/types'
import type { Horario, Servicio, Profesor } from '@/lib/types'

const HORAS = ['07:00', '08:00', '09:00', '10:00', '11:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']

type HorarioFull = Horario & { servicio: Servicio; profesor: Profesor | null }

async function getHorarios() {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('horarios')
      .select('*, servicio:servicios(*), profesor:profesores(*)')
      .order('hora_inicio')
    if (error) return []
    return (data ?? []) as HorarioFull[]
  } catch {
    return []
  }
}

function horaLabel(time: string) { return time.substring(0, 5) }

export async function HorariosTable({ preview = false }: { preview?: boolean }) {
  const horarios = await getHorarios()

  if (horarios.length === 0) {
    return <p className="text-[var(--m3-outline)] text-[14px] py-4">Próximamente...</p>
  }

  const mapa: Record<string, Record<number, HorarioFull[]>> = {}
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
    <div className="overflow-x-auto rounded-[16px] border border-[var(--m3-outline-v)]">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="bg-[var(--m3-surface-container)]">
            <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.5px] text-[var(--m3-outline)] w-20">Hora</th>
            {DIAS_SEMANA.map((d) => (
              <th key={d} className="px-2 py-3 text-center text-[12px] font-medium tracking-[0.5px] text-[var(--m3-outline)]">{d.slice(0, 3)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {horas.map((hora, idx) => (
            <tr key={hora} className={idx % 2 === 0 ? 'bg-[var(--m3-bg)]' : 'bg-[var(--m3-surface-low)]'}>
              <td className="px-4 py-2 text-[var(--m3-outline)] font-mono text-[12px]">{hora}</td>
              {DIAS_SEMANA.map((_, diaIdx) => {
                const dia = diaIdx + 1
                const clases = mapa[hora]?.[dia] ?? []
                return (
                  <td key={dia} className="px-1 py-1.5 text-center align-top">
                    <div className="flex flex-col gap-1 items-center">
                      {clases.map((c) => (
                        <div key={c.id} className="text-left">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-[11px] font-medium text-white ${colorMap[c.servicio?.nombre ?? ''] ?? 'bg-[#36343B]'}`}
                            title={c.salon ?? ''}
                          >
                            {c.servicio?.nombre ?? '—'}
                          </span>
                          {c.profesor && (
                            <p className="text-[10px] text-[var(--m3-on-surface-v)] mt-0.5 leading-tight text-center">
                              {c.profesor.nombre.split(' ').slice(0, 2).join(' ')}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
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
