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
    <section className="py-24 px-4 bg-card">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--gold)] mb-3">Por qué elegirnos</p>
          <h2 className="text-4xl md:text-5xl font-black mb-4">Tu mejor decisión</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {beneficios.map((b, i) => (
            <motion.div
              key={b.titulo}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl border border-border/60 hover:border-[var(--gold)]/40 transition-colors"
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gold)]/10 mb-4">
                <b.icon className="h-7 w-7 text-[var(--gold)]" />
              </div>
              <h3 className="font-bold text-base mb-2">{b.titulo}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
