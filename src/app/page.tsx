export const dynamic = 'force-dynamic'

import { HeroSection } from '@/components/HeroSection'
import { ServiciosSection } from '@/components/ServiciosSection'
import { BeneficiosSection } from '@/components/BeneficiosSection'
import { HorariosTable } from '@/components/HorariosTable'
import { GaleriaSection } from '@/components/GaleriaSection'
import { ContactoSection } from '@/components/ContactoSection'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { GaleriaItem, Contacto } from '@/lib/types'

async function getData() {
  if (!isSupabaseConfigured()) return { galeria: [] as GaleriaItem[], contacto: null }
  try {
    const supabase = await createClient()
    const [galeriaRes, contactoRes] = await Promise.all([
      supabase.from('galeria').select('*').order('orden').limit(6),
      supabase.from('contacto').select('*').eq('id', 1).single(),
    ])
    return {
      galeria: (galeriaRes.data ?? []) as GaleriaItem[],
      contacto: (contactoRes.data ?? null) as Contacto | null,
    }
  } catch {
    return { galeria: [] as GaleriaItem[], contacto: null }
  }
}

export default async function HomePage() {
  const { galeria, contacto } = await getData()

  return (
    <>
      <HeroSection />
      <ServiciosSection />
      <BeneficiosSection />

      {/* Horarios preview */}
      <section className="py-20 px-4 bg-[#141218]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <p className="text-[12px] font-medium tracking-[0.5px] uppercase text-[var(--gold)] mb-3">Horarios</p>
            <h2 className="text-[32px] font-normal leading-[40px] text-[#E6E0E9] mb-1">Encuentra tu clase</h2>
            <p className="text-[14px] leading-[20px] text-[#CAC4D0]">Consulta los próximos horarios disponibles.</p>
          </div>
          <HorariosTable preview />
          <div className="mt-8">
            <Link
              href="/horarios"
              className="inline-flex items-center gap-2 rounded-full border border-[#938F99] text-[#CAC4D0] font-medium px-6 py-2.5 text-[14px] tracking-[0.1px] hover:bg-white/8 transition-colors"
            >
              Ver horario completo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <GaleriaSection items={galeria} />
      <ContactoSection contacto={contacto ?? undefined} />
    </>
  )
}
