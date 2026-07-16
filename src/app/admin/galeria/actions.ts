'use server'

import { createAdminClient } from '@/lib/supabase/server'

export async function saveGaleriaPublica(url: string, alt: string, orden: number) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('galeria')
    .insert({ url, alt, orden })
    .select()
    .single()
  if (error) return { error: error.message, item: null }
  return { error: null, item: data }
}

export async function eliminarGaleriaPublica(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('galeria').delete().eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}

export async function moverGaleriaPublica(idA: string, ordenA: number, idB: string, ordenB: number) {
  const supabase = createAdminClient()
  await Promise.all([
    supabase.from('galeria').update({ orden: ordenB }).eq('id', idA),
    supabase.from('galeria').update({ orden: ordenA }).eq('id', idB),
  ])
  return { error: null }
}
