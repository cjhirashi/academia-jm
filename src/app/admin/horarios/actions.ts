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
  const { error } = await supabase.from('horarios').insert(payload)
  if (error) return { error: error.message }
  return { error: null }
}

export async function eliminarHorario(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('horarios').delete().eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}
