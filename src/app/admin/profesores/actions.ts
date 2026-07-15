'use server'

import { createAdminClient } from '@/lib/supabase/server'

interface ProfesorPayload {
  nombre: string
  especialidad: string | null
  bio: string | null
  foto_url: string | null
  orden: number
  activo: boolean
}

export async function crearProfesor(payload: ProfesorPayload) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('profesores').insert(payload)
  if (error) return { error: error.message }
  return { error: null }
}

export async function actualizarProfesor(id: string, payload: ProfesorPayload) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('profesores').update(payload).eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}

export async function eliminarProfesor(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('profesores').delete().eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}

export async function toggleActivoProfesor(id: string, activo: boolean) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('profesores').update({ activo }).eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}

export async function uploadProfesorFoto(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) return { error: 'No file', url: null }

  const supabase = createAdminClient()
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const bytes = await file.arrayBuffer()
  const { data, error } = await supabase.storage.from('profesores').upload(fileName, bytes, {
    contentType: file.type,
    upsert: false,
  })
  if (error) return { error: error.message, url: null }

  const { data: { publicUrl } } = supabase.storage.from('profesores').getPublicUrl(data.path)
  return { error: null, url: publicUrl }
}
