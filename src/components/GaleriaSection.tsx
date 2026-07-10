'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { GaleriaItem } from '@/lib/types'

export function GaleriaSection({ items }: { items: GaleriaItem[] }) {
  if (items.length === 0) {
    return (
      <section id="galeria" className="py-24 px-4 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--gold)] mb-3">Galería</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Nuestro ambiente</h2>
          </div>
          <p className="text-white/30 text-sm">Próximamente...</p>
        </div>
      </section>
    )
  }

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
          {items.map((item, i) => (
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
