export const dynamic = 'force-dynamic'

import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { BeneficiosAdmin } from './BeneficiosAdmin'
import type { Beneficio } from '@/lib/types'

async function getBeneficios(): Promise<Beneficio[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('beneficios').select('*').order('orden')
    return (data ?? []) as Beneficio[]
  } catch {
    return []
  }
}

export default async function BeneficiosPage() {
  const beneficios = await getBeneficios()
  return <BeneficiosAdmin beneficios={beneficios} />
}
