'use server'

import { createAdminClient } from '@/lib/supabase/server'

export async function crearHorario(payload: {
  servicio_id: string
  dia_semana: number
  hora_inicio: string
  hora_fin: string
  salon: string | null
}) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('horarios').insert(payload).select().single()
  if (error) return { error: error.message, id: null }
  return { error: null, id: data.id as string }
}

export async function eliminarHorario(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('horarios').delete().eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}

export async function asignarProfesorHorario(horarioId: string, profesorId: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('horario_profesores')
    .insert({ horario_id: horarioId, profesor_id: profesorId })
  if (error) return { error: error.message }
  return { error: null }
}

export async function desasignarProfesorHorario(horarioId: string, profesorId: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('horario_profesores')
    .delete()
    .eq('horario_id', horarioId)
    .eq('profesor_id', profesorId)
  if (error) return { error: error.message }
  return { error: null }
}
