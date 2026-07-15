import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { Award, Users, Clock, Heart, Star, Zap, Music, Flame, Dumbbell, Waves, Shield, Trophy } from 'lucide-react'
import type { Beneficio } from '@/lib/types'

const iconMap: Record<string, React.ElementType> = {
  Award, Users, Clock, Heart, Star, Zap, Music, Flame, Dumbbell, Waves, Shield, Trophy,
}

async function getBeneficios(): Promise<Beneficio[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('beneficios')
      .select('*')
      .eq('activo', true)
      .order('orden')
    if (error) return []
    return (data ?? []) as Beneficio[]
  } catch {
    return []
  }
}

export async function BeneficiosSection() {
  const beneficios = await getBeneficios()

  return (
    <section className="py-20 px-4 bg-[var(--m3-bg)]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <p className="text-[12px] font-medium tracking-[0.5px] uppercase text-[var(--gold)] mb-3">Por qué elegirnos</p>
          <h2 className="text-[32px] font-normal leading-[40px] text-[var(--m3-on-surface)]">Tu mejor decisión</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {beneficios.map((b) => {
            const Icon = iconMap[b.icono] ?? Award
            return (
              <div
                key={b.id}
                className="p-6 rounded-[16px] border border-[var(--m3-outline-v)] bg-transparent hover:bg-[var(--m3-surface-container)]/60 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--gold)]/12 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-[var(--gold)]" />
                </div>
                <h3 className="text-[16px] font-medium leading-[24px] tracking-[0.15px] text-[var(--m3-on-surface)] mb-2">
                  {b.titulo}
                </h3>
                <p className="text-[14px] leading-[20px] tracking-[0.25px] text-[var(--m3-on-surface-v)]">
                  {b.descripcion}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
