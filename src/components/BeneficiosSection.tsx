'use client'

import { motion } from 'framer-motion'
import { Award, Users, Clock, Heart } from 'lucide-react'

const beneficios = [
  {
    icon: Award,
    titulo: 'Instructores certificados',
    desc: 'Nuestros maestros cuentan con certificaciones y años de experiencia en sus disciplinas.',
  },
  {
    icon: Users,
    titulo: 'Ambiente familiar',
    desc: 'Un espacio seguro y acogedor donde todos son bienvenidos, sin importar tu nivel o edad.',
  },
  {
    icon: Clock,
    titulo: 'Horarios flexibles',
    desc: 'Clases en la mañana y en la tarde-noche para que puedas asistir sin importar tu rutina.',
  },
  {
    icon: Heart,
    titulo: 'Bienestar integral',
    desc: 'Combinamos baile, fitness y espiritualidad para tu desarrollo físico, artístico y mental.',
  },
]

export function BeneficiosSection() {
  return (
    <section className="py-20 px-4 bg-[var(--m3-surface)]">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-[12px] font-medium tracking-[0.5px] uppercase text-[var(--gold)] mb-3">Por qué elegirnos</p>
          <h2 className="text-[32px] font-normal leading-[40px] text-[var(--m3-on-surface)]">Tu mejor decisión</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {beneficios.map((b, i) => (
            <motion.div
              key={b.titulo}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="p-6 rounded-[16px] border border-[var(--m3-outline-v)] bg-transparent hover:bg-[var(--m3-surface-container)]/60 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-[var(--gold)]/12 flex items-center justify-center mb-4">
                <b.icon className="h-5 w-5 text-[var(--gold)]" />
              </div>
              <h3 className="text-[16px] font-medium leading-[24px] tracking-[0.15px] text-[var(--m3-on-surface)] mb-2">
                {b.titulo}
              </h3>
              <p className="text-[14px] leading-[20px] tracking-[0.25px] text-[var(--m3-on-surface-v)]">
                {b.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
