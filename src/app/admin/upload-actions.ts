'use server'

import { createAdminClient } from '@/lib/supabase/server'
import type { ServicioGaleria } from '@/lib/types'

/** Genera una URL firmada para que el cliente suba directamente a Supabase Storage */
export async function getSignedUploadUrl(bucket: string, path: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(path)
  if (error) return { error: error.message, signedUrl: null, path: null }
  return { error: null, signedUrl: data.signedUrl, path: data.path }
}

/** Devuelve la URL pública de un archivo ya subido */
export async function getPublicUrl(bucket: string, path: string) {
  const supabase = createAdminClient()
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/** Guarda un item de galería en la DB después de que el archivo ya fue subido */
export async function saveGaleriaItem(
  servicioId: string,
  url: string,
  alt: string,
  orden: number,
) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('servicio_galeria')
    .insert({ servicio_id: servicioId, url, alt, orden })
    .select()
    .single()
  if (error) return { error: error.message, item: null }
  return { error: null, item: data as ServicioGaleria }
}
