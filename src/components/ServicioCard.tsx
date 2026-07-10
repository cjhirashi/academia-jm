'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Music, Zap, Flame, Heart, Dumbbell, Waves, ArrowRight } from 'lucide-react'
import type { Servicio } from '@/lib/types'

const iconMap: Record<string, React.ReactNode> = {
  Music: <Music className="h-6 w-6" />,
  Zap: <Zap className="h-6 w-6" />,
  Flame: <Flame className="h-6 w-6" />,
  Heart: <Heart className="h-6 w-6" />,
  Dumbbell: <Dumbbell className="h-6 w-6" />,
  Waves: <Waves className="h-6 w-6" />,
}

export function ServicioCard({ servicio, index }: { servicio: Servicio; index: number }) {
  const href = servicio.id ? `/servicios/${servicio.id}` : '/servicios'

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      {/* M3 Elevated Card */}
      <Link
        href={href}
        className="group block bg-[#211F26] rounded-[28px] overflow-hidden hover:bg-[#2B2930] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.3),0_2px_6px_2px_rgba(0,0,0,0.15)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_4px_8px_3px_rgba(0,0,0,0.25)]"
      >
        {/* Media */}
        <div className="relative h-48 bg-[#2B2930] flex items-center justify-center overflow-hidden">
          {servicio.imagen_url ? (
            <Image
              src={servicio.imagen_url}
              alt={servicio.nombre}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-[var(--gold)]/15 flex items-center justify-center text-[var(--gold)]/60 group-hover:text-[var(--gold)] group-hover:bg-[var(--gold)]/20 transition-colors">
              {servicio.icono && iconMap[servicio.icono] ? iconMap[servicio.icono] : <Music className="h-6 w-6" />}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#211F26] via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-[22px] font-normal leading-[28px] text-[#E6E0E9] mb-2 group-hover:text-[var(--gold)] transition-colors">
            {servicio.nombre}
          </h3>
          {servicio.descripcion && (
            <p className="text-[14px] leading-[20px] tracking-[0.25px] text-[#CAC4D0] line-clamp-2 mb-4">
              {servicio.descripcion}
            </p>
          )}
          {/* M3 Text button */}
          <div className="inline-flex items-center gap-1 text-[14px] font-medium tracking-[0.1px] text-[var(--gold)] group-hover:gap-2 transition-all">
            Ver más <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
