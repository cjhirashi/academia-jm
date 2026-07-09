'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Music, Zap, Flame, Heart, Dumbbell, Waves, ArrowRight } from 'lucide-react'
import type { Servicio } from '@/lib/types'

const iconMap: Record<string, React.ReactNode> = {
  Music: <Music className="h-7 w-7" />,
  Zap: <Zap className="h-7 w-7" />,
  Flame: <Flame className="h-7 w-7" />,
  Heart: <Heart className="h-7 w-7" />,
  Dumbbell: <Dumbbell className="h-7 w-7" />,
  Waves: <Waves className="h-7 w-7" />,
}

export function ServicioCard({ servicio, index }: { servicio: Servicio; index: number }) {
  const href = servicio.id ? `/servicios/${servicio.id}` : '/servicios'

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link href={href} className="group block relative overflow-hidden bg-[#111] hover:bg-[#161616] transition-colors">
        {/* Imagen */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#1a1208] to-[#110a1a] flex items-center justify-center">
          {servicio.imagen_url ? (
            <Image
              src={servicio.imagen_url}
              alt={servicio.nombre}
              fill
              className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
            />
          ) : (
            <div className="text-[var(--gold)]/30 group-hover:text-[var(--gold)]/60 transition-colors">
              {servicio.icono && iconMap[servicio.icono] ? iconMap[servicio.icono] : <Music className="h-7 w-7" />}
            </div>
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Gold left accent line */}
          <div className="flex items-start gap-4">
            <div className="w-0.5 h-full min-h-[4rem] bg-[var(--gold)]/60 group-hover:bg-[var(--gold)] transition-colors shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-lg text-white mb-2 tracking-wide uppercase">
                {servicio.nombre}
              </h3>
              {servicio.descripcion && (
                <p className="text-sm text-white/40 leading-relaxed line-clamp-2">{servicio.descripcion}</p>
              )}
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold tracking-widest uppercase text-[var(--gold)]/60 group-hover:text-[var(--gold)] transition-colors">
                Ver más <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
