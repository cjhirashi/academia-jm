'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, MessageCircle } from 'lucide-react'
import type { Contacto } from '@/lib/types'

const DEFAULT_CONTACTO: Contacto = {
  id: 1,
  telefono: '55 3465 0764',
  whatsapp: '5553465764',
  email: null,
  direccion: 'Calle Monte Naranjo #146, Col. Jesús del Monte, Cuajimalpa de Morelos, 05260, CDMX',
  horario_atencion: 'Lun-Vie: 7:00–21:00 | Sáb: 9:00–14:00',
  facebook_url: 'https://facebook.com',
  instagram_url: null,
}

const items = [
  { icon: MapPin, label: 'Dirección', key: 'direccion' as const },
  { icon: Phone, label: 'Teléfono', key: 'telefono' as const },
  { icon: Clock, label: 'Horario', key: 'horario_atencion' as const },
]

export function ContactoSection({ contacto = DEFAULT_CONTACTO }: { contacto?: Contacto }) {
  const c = contacto ?? DEFAULT_CONTACTO

  return (
    <section id="contacto" className="section-geo py-28 px-4 bg-[#0a0a0a]">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)] mb-4">Contáctanos</p>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
            ¿Listo para<br />empezar?
          </h2>
          <div className="h-px bg-gradient-to-r from-[var(--gold)]/60 via-[var(--gold)]/20 to-transparent" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-0"
          >
            {items.map(({ icon: Icon, label, key }, i) => {
              const value = c[key]
              if (!value) return null
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex items-start gap-6 py-7 border-b border-white/5"
                >
                  {/* Left gold bar accent */}
                  <div className="w-0.5 h-12 bg-[var(--gold)]/50 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 mb-2">{label}</p>
                    <p className="text-sm text-white/70 leading-relaxed">{value}</p>
                  </div>
                  <Icon className="h-4 w-4 text-[var(--gold)]/40 shrink-0 mt-1" />
                </motion.div>
              )
            })}

            {/* Social */}
            {c.facebook_url && (
              <div className="pt-8 flex items-center gap-4">
                <a
                  href={c.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-white/40 hover:text-white transition-colors"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  Facebook
                </a>
              </div>
            )}

            {/* WhatsApp CTA */}
            <div className="pt-8">
              <a
                href={`https://wa.me/${c.whatsapp ?? '5553465764'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full bg-[var(--gold)] text-black font-bold px-8 py-3.5 text-sm tracking-wide hover:bg-amber-400 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Escríbenos por WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Mapa */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden h-80 lg:h-full min-h-72 border border-white/5"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3764.5!2d-99.2951!3d19.3731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDIyJzIzLjIiTiA5OcKwMTcnNDIuNCJX!5e0!3m2!1ses!2smx!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '280px', filter: 'invert(90%) hue-rotate(180deg)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
