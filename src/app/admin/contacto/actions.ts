'use server'

import { createAdminClient } from '@/lib/supabase/server'

interface ContactoPayload {
  telefono: string
  whatsapp: string
  email: string
  direccion: string
  horario_atencion: string
  facebook_url: string
  instagram_url: string
  mapa_embed_url: string
}

export async function guardarContacto(payload: ContactoPayload) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('contacto').upsert({ id: 1, ...payload })
  if (error) return { error: error.message }
  return { error: null }
}
