'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MessageCircle, ArrowRight } from 'lucide-react'

const clases = ['Salsa', 'Cumbia', 'Zumba', 'Jumping', 'Yoga']

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--m3-bg)]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[var(--gold)]/6 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[var(--blue-jm)]/5 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[12px] font-medium tracking-[0.5px] uppercase text-[var(--m3-on-surface-v)] mb-6"
        >
          Escuela de Baile y Bienestar · Cuajimalpa, CDMX
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mb-6"
        >
          <span className="font-[family-name:var(--font-script)] text-4xl md:text-5xl text-[var(--m3-on-surface)]/50 block mb-1">
            Academia
          </span>
          <h1 className="text-[72px] md:text-[96px] font-black tracking-tight text-[var(--m3-on-surface)] leading-none">
            JM
          </h1>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="h-px w-24 bg-gradient-to-r from-[var(--gold)] to-[var(--blue-jm)] mb-6 origin-left"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-[16px] leading-[24px] tracking-[0.5px] text-[var(--m3-on-surface-v)] mb-10 max-w-sm"
        >
          Aprende · Diviértete · Olvida tu estrés
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-10"
        >
          <Link
            href="/horarios"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--gold)] text-white font-medium px-6 py-2.5 text-[14px] tracking-[0.1px] hover:brightness-110 active:brightness-90 transition-all shadow-md"
          >
            Ver Horarios <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="https://wa.me/5553465764"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--m3-outline)] text-[var(--blue-jm)] font-medium px-6 py-2.5 text-[14px] tracking-[0.1px] hover:bg-[var(--blue-jm)]/8 transition-colors"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.5 }}
          className="flex flex-wrap gap-2 justify-center"
        >
          {clases.map((c, i) => (
            <span
              key={c}
              className="inline-flex items-center h-8 px-4 rounded-full border text-[12px] font-medium tracking-[0.5px] text-[var(--m3-on-surface-v)]"
              style={{
                borderColor: i % 2 === 0 ? 'rgba(233,30,140,0.4)' : 'rgba(0,191,255,0.4)',
                backgroundColor: i % 2 === 0 ? 'rgba(233,30,140,0.08)' : 'rgba(0,191,255,0.08)',
              }}
            >
              {c}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[11px] font-medium tracking-[0.5px] uppercase text-[var(--m3-outline)]">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-6 bg-gradient-to-b from-[var(--gold)] to-transparent"
        />
      </motion.div>
    </section>
  )
}
