export const dynamic = 'force-dynamic'

import { ContactoSection } from '@/components/ContactoSection'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import type { Contacto } from '@/lib/types'

export const metadata = { title: 'Contacto — Academia JM' }

async function getContacto(): Promise<Contacto | null> {
  if (!isSupabaseConfigured()) return null
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('contacto').select('*').eq('id', 1).single()
    return data ?? null
  } catch {
    return null
  }
}

export default async function ContactoPage() {
  const contacto = await getContacto()
  return (
    <div className="min-h-screen bg-[#0F0D13] pt-24">
      <ContactoSection contacto={contacto ?? undefined} />
    </div>
  )
}
