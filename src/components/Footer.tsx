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
    <footer className="bg-[#1D1B20] border-t border-[#49454F]">
      <div className="mx-auto max-w-6xl px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div className="space-y-3">
          <span className="font-[family-name:var(--font-script)] text-xl text-[#E6E0E9]">
            Academia JM
          </span>
          <p className="text-[12px] leading-[16px] tracking-[0.4px] text-[#938F99] max-w-xs">
            Academia dedicada al aprendizaje físico, artístico y espiritual.<br />
            Aprende · Diviértete · Olvida tu estrés
          </p>
          <div className="h-px w-8 bg-[var(--gold)]/60" />
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <p className="text-[11px] font-medium tracking-[0.5px] uppercase text-[#938F99]">Navegación</p>
          <ul className="space-y-2">
            {[
              { href: '/', label: 'Inicio' },
              { href: '/servicios', label: 'Clases' },
              { href: '/horarios', label: 'Horarios' },
              { href: '/contacto', label: 'Contacto' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[14px] leading-[20px] tracking-[0.25px] text-[#CAC4D0] hover:text-[var(--gold)] transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-3">
          <p className="text-[11px] font-medium tracking-[0.5px] uppercase text-[#938F99]">Contacto</p>
          {!contacto ? (
            <p className="text-[12px] text-[#938F99]">Próximamente...</p>
          ) : (
            <ul className="space-y-3">
              {contacto.direccion && (
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 shrink-0 text-[var(--gold)]/60 mt-0.5" />
                  <span className="text-[14px] leading-[20px] tracking-[0.25px] text-[#CAC4D0]">{contacto.direccion}</span>
                </li>
              )}
              {contacto.telefono && (
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-[var(--gold)]/60" />
                  <a href={`tel:${contacto.telefono.replace(/\s/g, '')}`} className="text-[14px] leading-[20px] text-[#CAC4D0] hover:text-[var(--gold)] transition-colors">
                    {contacto.telefono}
                  </a>
                </li>
              )}
              {contacto.facebook_url && (
                <li className="flex items-center gap-3">
                  <svg className="h-4 w-4 shrink-0 text-[var(--gold)]/60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  <a href={contacto.facebook_url} target="_blank" rel="noopener noreferrer" className="text-[14px] text-[#CAC4D0] hover:text-[var(--gold)] transition-colors">
                    Facebook
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* M3 Divider + copyright */}
      <div className="border-t border-[#49454F] py-4 text-center">
        <p className="text-[11px] font-medium tracking-[0.5px] text-[#938F99] uppercase">
          © {new Date().getFullYear()} Academia JM · Todos los derechos reservados
        </p>
      </div>
    </footer>
  )
}
