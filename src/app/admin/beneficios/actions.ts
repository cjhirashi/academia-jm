'use server'

import { createAdminClient } from '@/lib/supabase/server'

interface BeneficioPayload {
  icono: string
  titulo: string
  descripcion: string
  orden: number
  activo: boolean
}

export async function crearBeneficio(payload: BeneficioPayload) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('beneficios').insert(payload)
  if (error) return { error: error.message }
  return { error: null }
}

export async function actualizarBeneficio(id: string, payload: BeneficioPayload) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('beneficios').update(payload).eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}

export async function eliminarBeneficio(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('beneficios').delete().eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}

export async function toggleActivoBeneficio(id: string, activo: boolean) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('beneficios').update({ activo }).eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}
