export const dynamic = 'force-dynamic'

import { HeroSection } from '@/components/HeroSection'
import { ServiciosSection } from '@/components/ServiciosSection'
import { BeneficiosSection } from '@/components/BeneficiosSection'
import { HorariosTable } from '@/components/HorariosTable'
import { GaleriaSection } from '@/components/GaleriaSection'
import { ContactoSection } from '@/components/ContactoSection'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
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

      {/* Preview horarios */}
      <section className="section-geo py-28 px-4 bg-[#0d0d0d]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)] mb-4">Horarios</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Encuentra tu clase</h2>
            <div className="h-px bg-gradient-to-r from-[var(--gold)]/60 via-[var(--gold)]/20 to-transparent" />
          </div>
          <HorariosTable preview />
          <div className="mt-10">
            <Link
              href="/horarios"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 text-white/70 font-medium px-8 py-3 text-sm tracking-wide hover:bg-white/5 hover:border-white/40 transition-colors"
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
