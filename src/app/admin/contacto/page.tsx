'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import type { Contacto } from '@/lib/types'
import { guardarContacto } from './actions'

const defaultForm: Omit<Contacto, 'id'> = {
  telefono: '', whatsapp: '', email: '', direccion: '', horario_atencion: '',
  facebook_url: '', instagram_url: '', mapa_embed_url: '',
}

export default function ContactoAdmin() {
  const [form, setForm] = useState<Omit<Contacto, 'id'>>(defaultForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('contacto').select('*').eq('id', 1).single().then(({ data }) => {
      if (data) setForm({
        telefono: data.telefono ?? '',
        whatsapp: data.whatsapp ?? '',
        email: data.email ?? '',
        direccion: data.direccion ?? '',
        horario_atencion: data.horario_atencion ?? '',
        facebook_url: data.facebook_url ?? '',
        instagram_url: data.instagram_url ?? '',
        mapa_embed_url: data.mapa_embed_url ?? '',
      })
      setLoading(false)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const { error } = await guardarContacto({
      telefono: form.telefono ?? '',
      whatsapp: form.whatsapp ?? '',
      email: form.email ?? '',
      direccion: form.direccion ?? '',
      horario_atencion: form.horario_atencion ?? '',
      facebook_url: form.facebook_url ?? '',
      instagram_url: form.instagram_url ?? '',
      mapa_embed_url: form.mapa_embed_url ?? '',
    })
    if (error) { toast.error(`Error al guardar: ${error}`); setSaving(false); return }
    toast.success('Información de contacto actualizada')
    setSaving(false)
  }

  const f = (key: keyof typeof form) => ({
    value: form[key] ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [key]: e.target.value }),
  })

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black">Información de contacto</h1>
        <p className="text-sm text-muted-foreground mt-1">Esta información aparece en el sitio público</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Datos de contacto</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input {...f('telefono')} placeholder="55 3465 0764" />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp (solo número)</Label>
              <Input {...f('whatsapp')} placeholder="5553465764" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Correo electrónico</Label>
            <Input type="email" {...f('email')} placeholder="contacto@academiajm.com" />
          </div>
          <div className="space-y-2">
            <Label>Dirección</Label>
            <Textarea {...f('direccion')} rows={2} placeholder="Calle Monte Naranjo #146..." />
          </div>
          <div className="space-y-2">
            <Label>Horario de atención</Label>
            <Input {...f('horario_atencion')} placeholder="Lun-Vie: 7:00-21:00 | Sáb: 9:00-14:00" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Mapa</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>URL de embed de Google Maps</Label>
            <Textarea
              {...f('mapa_embed_url')}
              rows={3}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <p className="text-xs text-muted-foreground">
              En Google Maps: Compartir → Insertar un mapa → copia la URL del atributo <code>src</code> del iframe.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Redes sociales</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Facebook URL</Label>
            <Input {...f('facebook_url')} placeholder="https://facebook.com/AcademiaJM" />
          </div>
          <div className="space-y-2">
            <Label>Instagram URL</Label>
            <Input {...f('instagram_url')} placeholder="https://instagram.com/academiajm" />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} size="lg">
        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        Guardar cambios
      </Button>
    </div>
  )
}
