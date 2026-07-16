'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { DIAS_SEMANA, COLORES_SERVICIO } from '@/lib/types'
import type { Horario, Servicio } from '@/lib/types'
import { crearHorario, eliminarHorario } from './actions'

const HORAS = ['07:00', '08:00', '09:00', '10:00', '11:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']

export default function HorariosAdmin() {
  const [horarios, setHorarios] = useState<(Horario & { servicio: Servicio })[]>([])
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<{ servicio_id: string; dia_semana: string; hora_inicio: string; hora_fin: string; salon: string }>({ servicio_id: '', dia_semana: '1', hora_inicio: '09:00', hora_fin: '10:00', salon: '' })
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const [h, s] = await Promise.all([
      supabase.from('horarios').select('*, servicio:servicios(*)').order('hora_inicio'),
      supabase.from('servicios').select('*').eq('activo', true).order('orden'),
    ])
    setHorarios((h.data ?? []) as (Horario & { servicio: Servicio })[])
    setServicios(s.data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  // Color map
  const colorMap: Record<string, string> = {}
  servicios.forEach((s, i) => { colorMap[s.id] = COLORES_SERVICIO[i % COLORES_SERVICIO.length] })

  // Mapa grilla
  const mapa: Record<string, Record<number, (Horario & { servicio: Servicio })[]>> = {}
  horarios.forEach((h) => {
    const hora = h.hora_inicio.substring(0, 5)
    if (!mapa[hora]) mapa[hora] = {}
    if (!mapa[hora][h.dia_semana]) mapa[hora][h.dia_semana] = []
    mapa[hora][h.dia_semana].push(h)
  })

  const handleSave = async () => {
    if (!form.servicio_id) { toast.error('Selecciona una clase'); return }
    setSaving(true)
    const { error } = await crearHorario({
      servicio_id: form.servicio_id,
      dia_semana: Number(form.dia_semana),
      hora_inicio: form.hora_inicio + ':00',
      hora_fin: form.hora_fin + ':00',
      salon: form.salon || null,
    })
    if (error) { toast.error(`Error: ${error}`); setSaving(false); return }
    toast.success('Horario agregado'); setOpen(false); setSaving(false); fetchData()
  }

  const handleDelete = async (id: string) => {
    const { error } = await eliminarHorario(id)
    if (error) { toast.error(error); return }
    toast.success('Eliminado'); fetchData()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Horarios</h1>
          <p className="text-sm text-muted-foreground mt-1">Edita la grilla semanal de clases</p>
        </div>
        <Button onClick={() => { setForm({ servicio_id: String(servicios[0]?.id ?? ''), dia_semana: '1', hora_inicio: '09:00', hora_fin: '10:00', salon: '' }); setOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />Agregar horario
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="bg-muted/60">
                <th className="px-3 py-3 text-left font-semibold text-muted-foreground w-20">Hora</th>
                {DIAS_SEMANA.map((d) => (
                  <th key={d} className="px-2 py-3 text-center font-semibold text-muted-foreground">{d.slice(0, 3)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HORAS.map((hora, idx) => (
                <tr key={hora} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                  <td className="px-3 py-2 text-muted-foreground font-mono text-xs">{hora}</td>
                  {DIAS_SEMANA.map((_, diaIdx) => {
                    const dia = diaIdx + 1
                    const clases = mapa[hora]?.[dia] ?? []
                    return (
                      <td key={dia} className="px-1 py-1.5 text-center">
                        {clases.map((c) => (
                          <div key={c.id} className="inline-flex items-center gap-1">
                            <span className={`inline-block rounded-md px-2 py-1 text-xs font-semibold text-white ${colorMap[c.servicio_id ?? ''] ?? 'bg-gray-500'}`}>
                              {c.servicio?.nombre ?? '—'}
                            </span>
                            <button onClick={() => handleDelete(c.id)} className="text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Agregar horario</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Clase</Label>
              <Select value={form.servicio_id} onValueChange={(v) => setForm((prev) => ({ ...prev, servicio_id: v ?? '' }))}>
                <SelectTrigger>
                  <span className={form.servicio_id ? 'text-foreground' : 'text-muted-foreground'}>
                    {servicios.find(s => s.id === form.servicio_id)?.nombre ?? 'Selecciona una clase'}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {servicios.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Día de la semana</Label>
              <Select value={form.dia_semana} onValueChange={(v) => setForm((prev) => ({ ...prev, dia_semana: v ?? '1' }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DIAS_SEMANA.map((d, i) => <SelectItem key={d} value={String(i + 1)}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Hora inicio</Label><Input type="time" value={form.hora_inicio} onChange={(e) => setForm({ ...form, hora_inicio: e.target.value })} /></div>
              <div className="space-y-2"><Label>Hora fin</Label><Input type="time" value={form.hora_fin} onChange={(e) => setForm({ ...form, hora_fin: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Salón (opcional)</Label><Input value={form.salon} onChange={(e) => setForm({ ...form, salon: e.target.value })} placeholder="Ej: Salón A" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !form.servicio_id}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
