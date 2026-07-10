import Link from 'next/link'
import { MapPin, Phone } from 'lucide-react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import type { Contacto } from '@/lib/types'

async function getContacto(): Promise<Contacto | null> {
  if (!isSupabaseConfigured()) return null
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('contacto').select('*').eq('id', 1).single()
    return data ?? null
  } catch {
    return null
  }
}

export async function Footer() {
  const contacto = await getContacto()

  return (
    <footer className="bg-[#050505] border-t border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div className="space-y-4">
          <span className="font-[family-name:var(--font-script)] text-2xl text-white">
            Academia JM
          </span>
          <p className="text-xs text-white/30 leading-relaxed max-w-xs">
            Academia dedicada al aprendizaje físico, artístico y espiritual.<br />
            Aprende · Diviértete · Olvida tu estrés
          </p>
          <div className="h-px w-12 bg-[var(--gold)]/50" />
        </div>

        {/* Links */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--gold)]/60">Navegación</p>
          <ul className="space-y-3">
            {[
              { href: '/', label: 'Inicio' },
              { href: '/servicios', label: 'Clases' },
              { href: '/horarios', label: 'Horarios' },
              { href: '/contacto', label: 'Contacto' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-xs text-white/40 hover:text-white transition-colors tracking-wide">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--gold)]/60">Contacto</p>
          {!contacto ? (
            <p className="text-xs text-white/20">Próximamente...</p>
          ) : (
            <ul className="space-y-3">
              {contacto.direccion && (
                <li className="flex items-start gap-3">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--gold)]/40 mt-0.5" />
                  <span className="text-xs text-white/40 leading-relaxed">{contacto.direccion}</span>
                </li>
              )}
              {contacto.telefono && (
                <li className="flex items-center gap-3">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-[var(--gold)]/40" />
                  <a href={`tel:${contacto.telefono.replace(/\s/g, '')}`} className="text-xs text-white/40 hover:text-white transition-colors">
                    {contacto.telefono}
                  </a>
                </li>
              )}
              {contacto.facebook_url && (
                <li className="flex items-center gap-3">
                  <svg className="h-3.5 w-3.5 shrink-0 text-[var(--gold)]/40" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  <a href={contacto.facebook_url} target="_blank" rel="noopener noreferrer" className="text-xs text-white/40 hover:text-white transition-colors">
                    Facebook
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="border-t border-white/5 py-5 text-center">
        <p className="text-[10px] text-white/20 tracking-widest uppercase">
          © {new Date().getFullYear()} Academia JM · Todos los derechos reservados
        </p>
      </div>
    </footer>
  )
}
