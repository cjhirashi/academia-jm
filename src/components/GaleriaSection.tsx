'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { GaleriaItem } from '@/lib/types'

const PLACEHOLDERS = [
  { id: '1', color: 'from-amber-600/40 to-amber-900/60', label: 'Salsa' },
  { id: '2', color: 'from-purple-600/40 to-purple-900/60', label: 'Cumbia' },
  { id: '3', color: 'from-rose-600/40 to-rose-900/60', label: 'Zumba' },
  { id: '4', color: 'from-emerald-600/40 to-emerald-900/60', label: 'Yoga' },
  { id: '5', color: 'from-sky-600/40 to-sky-900/60', label: 'Jumping' },
  { id: '6', color: 'from-orange-600/40 to-orange-900/60', label: 'Clases' },
]

export function GaleriaSection({ items }: { items: GaleriaItem[] }) {
  const usePlaceholders = items.length === 0

  return (
    <section id="galeria" className="py-24 px-4 bg-muted/30">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--gold)] mb-3">Galería</p>
          <h2 className="text-4xl md:text-5xl font-black mb-4">Nuestro ambiente</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Conoce nuestras instalaciones y vive la experiencia Academia JM.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {usePlaceholders
            ? PLACEHOLDERS.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{ scale: 1.03 }}
                  className={`relative overflow-hidden rounded-xl aspect-square bg-gradient-to-br ${p.color} flex items-center justify-center cursor-pointer`}
                >
                  <span className="text-white/70 font-semibold text-sm">{p.label}</span>
                </motion.div>
              ))
            : items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{ scale: 1.03 }}
                  className="relative overflow-hidden rounded-xl aspect-square"
                >
                  <Image
                    src={item.url}
                    alt={item.alt ?? 'Academia JM'}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  )
}
