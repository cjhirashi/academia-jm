'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, MessageCircle } from 'lucide-react'
import type { Contacto } from '@/lib/types'

const items = [
  { icon: MapPin, label: 'Dirección', key: 'direccion' as const },
  { icon: Phone, label: 'Teléfono', key: 'telefono' as const },
  { icon: Clock, label: 'Horario de atención', key: 'horario_atencion' as const },
]

const DEFAULT_MAP_SRC = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3764.5!2d-99.2951!3d19.3731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDIyJzIzLjIiTiA5OcKwMTcnNDIuNCJX!5e0!3m2!1ses!2smx!4v1234567890"

export function ContactoSection({ contacto }: { contacto?: Contacto | null }) {
  const c = contacto ?? null
  const mapSrc = c?.mapa_embed_url || DEFAULT_MAP_SRC

  return (
    <section id="contacto" className="py-20 px-4 bg-[var(--m3-surface-container)]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <p className="text-[12px] font-medium tracking-[0.5px] uppercase text-[var(--gold)] mb-3">Contáctanos</p>
          <h2 className="text-[32px] font-normal leading-[40px] text-[var(--m3-on-surface)]">¿Listo para empezar?</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-[var(--m3-surface-container)] rounded-[28px] p-8"
          >
            {!c && (
              <p className="text-[var(--m3-outline)] text-[14px] py-4">Información de contacto próximamente...</p>
            )}

            {c && items.map(({ icon: Icon, label, key }, i) => {
              const value = c[key]
              if (!value) return null
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="flex items-start gap-4 py-5 border-b border-[var(--m3-outline-v)] last:border-0"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--gold)]/12 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-[var(--gold)]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium tracking-[0.5px] uppercase text-[var(--m3-outline)] mb-1">{label}</p>
                    <p className="text-[14px] leading-[20px] tracking-[0.25px] text-[var(--m3-on-surface)]">{value}</p>
                  </div>
                </motion.div>
              )
            })}

            {c && c.facebook_url && (
              <div className="pt-6">
                <a href={c.facebook_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--m3-on-surface-v)] hover:text-[var(--gold)] transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  Facebook
                </a>
              </div>
            )}

            {c && (
              <div className="pt-6">
                <a href={`https://wa.me/${c.whatsapp ?? ''}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1A5C38] text-[#B7F5D4] font-medium px-6 py-2.5 text-[14px] tracking-[0.1px] hover:brightness-110 transition-all shadow-md">
                  <MessageCircle className="h-4 w-4" />
                  Escríbenos por WhatsApp
                </a>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-[28px] h-80 lg:h-full min-h-72"
          >
            <iframe
              src={mapSrc}
              width="100%" height="100%"
              className="map-iframe"
              style={{ border: 0, minHeight: '280px' }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
