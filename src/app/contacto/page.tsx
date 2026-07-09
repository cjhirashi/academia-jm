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
    <div className="pt-8">
      <div className="text-center pt-12 pb-0 px-4">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--gold)] mb-3">Contacto</p>
        <h1 className="text-5xl font-black mb-4">Hablemos</h1>
      </div>
      <ContactoSection contacto={contacto ?? undefined} />
    </div>
  )
}
