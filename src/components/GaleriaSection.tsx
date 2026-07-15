'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { GaleriaItem } from '@/lib/types'

export function GaleriaSection({ items }: { items: GaleriaItem[] }) {
  if (items.length === 0) {
    return (
      <section id="galeria" className="py-20 px-4 bg-[var(--m3-bg)]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <p className="text-[12px] font-medium tracking-[0.5px] uppercase text-[var(--gold)] mb-3">Galería</p>
            <h2 className="text-[32px] font-normal leading-[40px] text-[var(--m3-on-surface)]">Nuestro ambiente</h2>
          </div>
          <p className="text-[var(--m3-outline)] text-[14px]">Próximamente...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="galeria" className="py-20 px-4 bg-[var(--m3-bg)]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-[12px] font-medium tracking-[0.5px] uppercase text-[var(--gold)] mb-3">Galería</p>
          <h2 className="text-[32px] font-normal leading-[40px] text-[var(--m3-on-surface)] mb-1">Nuestro ambiente</h2>
          <p className="text-[14px] leading-[20px] text-[var(--m3-on-surface-v)]">
            Conoce nuestras instalaciones y vive la experiencia Academia JM.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="relative overflow-hidden rounded-[16px] aspect-square bg-[var(--m3-surface-container)]"
            >
              <Image
                src={item.url}
                alt={item.alt ?? 'Academia JM'}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
