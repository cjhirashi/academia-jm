import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { Award, Users, Clock, Heart, Star, Zap, Music, Flame, Dumbbell, Waves, Shield, Trophy } from 'lucide-react'
import type { Beneficio } from '@/lib/types'

const iconMap: Record<string, React.ElementType> = {
  Award, Users, Clock, Heart, Star, Zap, Music, Flame, Dumbbell, Waves, Shield, Trophy,
}

const DEFAULT_BENEFICIOS: Beneficio[] = [
  { id: '1', icono: 'Award', titulo: 'Instructores certificados', descripcion: 'Nuestros maestros cuentan con certificaciones y años de experiencia en sus disciplinas.', orden: 1, activo: true },
  { id: '2', icono: 'Users', titulo: 'Ambiente familiar', descripcion: 'Un espacio seguro y acogedor donde todos son bienvenidos, sin importar tu nivel o edad.', orden: 2, activo: true },
  { id: '3', icono: 'Clock', titulo: 'Horarios flexibles', descripcion: 'Clases en la mañana y en la tarde-noche para que puedas asistir sin importar tu rutina.', orden: 3, activo: true },
  { id: '4', icono: 'Heart', titulo: 'Bienestar integral', descripcion: 'Combinamos baile, fitness y espiritualidad para tu desarrollo físico, artístico y mental.', orden: 4, activo: true },
]

async function getBeneficios(): Promise<Beneficio[]> {
  if (!isSupabaseConfigured()) return DEFAULT_BENEFICIOS
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('beneficios')
      .select('*')
      .eq('activo', true)
      .order('orden')
    if (error || !data || data.length === 0) return DEFAULT_BENEFICIOS
    return data as Beneficio[]
  } catch {
    return DEFAULT_BENEFICIOS
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
