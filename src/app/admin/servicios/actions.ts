'use server'

import { createAdminClient } from '@/lib/supabase/server'

interface ServicioPayload {
  nombre: string
  descripcion: string | null
  icono: string
  imagen_url: string | null
  orden: number
  activo: boolean
}

export async function crearServicio(payload: ServicioPayload) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('servicios').insert(payload)
  if (error) return { error: error.message }
  return { error: null }
}

export async function actualizarServicio(id: string, payload: ServicioPayload) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('servicios').update(payload).eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}

export async function eliminarServicio(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('servicios').delete().eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}

export async function toggleActivoServicio(id: string, activo: boolean) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('servicios').update({ activo }).eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}

export async function asignarProfesor(servicioId: string, profesorId: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('servicio_profesores').insert({ servicio_id: servicioId, profesor_id: profesorId })
  if (error) return { error: error.message }
  return { error: null }
}

export async function desasignarProfesor(servicioId: string, profesorId: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('servicio_profesores').delete()
    .eq('servicio_id', servicioId)
    .eq('profesor_id', profesorId)
  if (error) return { error: error.message }
  return { error: null }
}

export async function eliminarGaleriaItem(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('servicio_galeria').delete().eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}
