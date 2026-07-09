'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MessageCircle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const clases = ['Salsa', 'Cumbia', 'Zumba', 'Jumping', 'Yoga']

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Fondo — capas de profundidad */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0f0a15] to-[#0a0a0a]" />

      {/* Manchas de luz ambiental */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-900/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-900/10 blur-[100px] pointer-events-none" />

      {/* Líneas decorativas diagonales */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" style={{ left: '20%' }} />
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" style={{ left: '80%' }} />
        <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" style={{ top: '30%' }} />
        <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" style={{ top: '70%' }} />
      </div>

      {/* Glassmorphism center card */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl bg-white/5 backdrop-blur-sm border border-white/10 px-10 py-14 md:px-16 md:py-20"
        >
          {/* Etiqueta */}
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xs font-semibold tracking-[0.3em] uppercase text-white/50 mb-6"
          >
            Escuela de Baile y Bienestar
          </motion.p>

          {/* Título principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            <span className="font-[family-name:var(--font-script)] text-5xl md:text-6xl text-white/30 block mb-2">
              Academia
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white leading-none">
              JM
            </h1>
          </motion.div>

          {/* Separador dorado */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="h-px w-16 bg-[var(--gold)] mx-auto my-8 origin-left"
          />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-sm md:text-base text-white/50 tracking-[0.2em] uppercase mb-10"
          >
            Aprende · Diviértete · Olvida tu estrés
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/horarios"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--gold)] text-black font-bold px-8 py-3 text-sm tracking-wide hover:bg-amber-400 transition-colors"
            >
              Ver Horarios <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://wa.me/5553465764"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 text-white font-medium px-8 py-3 text-sm tracking-wide hover:bg-white/10 hover:border-white/40 transition-colors"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </motion.div>
        </motion.div>

        {/* Clases chip list debajo del card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-8 flex flex-wrap gap-2 justify-center"
        >
          {clases.map((c) => (
            <span
              key={c}
              className="text-xs font-medium tracking-widest uppercase text-white/30 border border-white/10 px-4 py-2"
            >
              {c}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/25">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent"
        />
      </motion.div>
    </section>
  )
}
