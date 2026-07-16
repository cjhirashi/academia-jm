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
import type { Horario, Servicio, Profesor } from '@/lib/types'
import { crearHorario, eliminarHorario } from './actions'

const HORAS = ['07:00', '08:00', '09:00', '10:00', '11:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']

type HorarioFull = Horario & { servicio: Servicio; profesor: Profesor | null }

export default function HorariosAdmin() {
  const [horarios, setHorarios] = useState<HorarioFull[]>([])
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [profesores, setProfesores] = useState<Profesor[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    servicio_id: '',
    profesor_id: '',
    dia_semana: '1',
    hora_inicio: '09:00',
    hora_fin: '10:00',
    salon: '',
  })
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const [h, s, p] = await Promise.all([
      supabase.from('horarios').select('*, servicio:servicios(*), profesor:profesores(*)').order('hora_inicio'),
      supabase.from('servicios').select('*').eq('activo', true).order('orden'),
      supabase.from('profesores').select('*').eq('activo', true).order('orden'),
    ])
    setHorarios((h.data ?? []) as HorarioFull[])
    setServicios(s.data ?? [])
    setProfesores(p.data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const colorMap: Record<string, string> = {}
  servicios.forEach((s, i) => { colorMap[s.id] = COLORES_SERVICIO[i % COLORES_SERVICIO.length] })

  const mapa: Record<string, Record<number, HorarioFull[]>> = {}
  horarios.forEach((h) => {
    const hora = h.hora_inicio.substring(0, 5)
    if (!mapa[hora]) mapa[hora] = {}
    if (!mapa[hora][h.dia_semana]) mapa[hora][h.dia_semana] = []
    mapa[hora][h.dia_semana].push(h)
  })

  const openDialog = () => {
    setForm({
      servicio_id: servicios[0]?.id ?? '',
      profesor_id: '',
      dia_semana: '1',
      hora_inicio: '09:00',
      hora_fin: '10:00',
      salon: '',
    })
    setOpen(true)
  }

  const handleSave = async () => {
    if (!form.servicio_id) { toast.error('Selecciona una clase'); return }
    setSaving(true)
    const { error } = await crearHorario({
      servicio_id: form.servicio_id,
      profesor_id: form.profesor_id || null,
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
          <p className="text-sm text-muted-foreground mt-1">Grilla semanal — clases y profesores</p>
        </div>
        <Button onClick={openDialog}>
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
                      <td key={dia} className="px-1 py-1.5 text-center align-top">
                        <div className="flex flex-col gap-1 items-center">
                          {clases.map((c) => (
                            <div key={c.id} className="flex items-start gap-1">
                              <div className="text-left">
                                <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold text-white ${colorMap[c.servicio_id ?? ''] ?? 'bg-gray-500'}`}>
                                  {c.servicio?.nombre ?? '—'}
                                </span>
                                {c.profesor && (
                                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                                    {c.profesor.nombre.split(' ')[0]}
                                  </p>
                                )}
                              </div>
                              <button onClick={() => handleDelete(c.id)} className="mt-0.5 text-muted-foreground hover:text-destructive shrink-0">
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
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
              <Select value={form.servicio_id} onValueChange={(v) => setForm((p) => ({ ...p, servicio_id: v }))}>
                <SelectTrigger>
                  <span className={form.servicio_id ? 'text-foreground' : 'text-muted-foreground'}>
                    {servicios.find(s => s.id === form.servicio_id)?.nombre ?? 'Selecciona una clase'}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {servicios.map((s) => <SelectItem key={s.id} value={s.id}>{s.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Profesor <span className="text-muted-foreground font-normal">(opcional)</span></Label>
              <Select value={form.profesor_id} onValueChange={(v) => setForm((p) => ({ ...p, profesor_id: v === 'none' ? '' : v }))}>
                <SelectTrigger>
                  <span className={form.profesor_id ? 'text-foreground' : 'text-muted-foreground'}>
                    {form.profesor_id
                      ? profesores.find(p => p.id === form.profesor_id)?.nombre ?? 'Sin asignar'
                      : 'Sin asignar'}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin asignar</SelectItem>
                  {profesores.map((p) => <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Día de la semana</Label>
              <Select value={form.dia_semana} onValueChange={(v) => setForm((p) => ({ ...p, dia_semana: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIAS_SEMANA.map((d, i) => <SelectItem key={d} value={String(i + 1)}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hora inicio</Label>
                <Input type="time" value={form.hora_inicio} onChange={(e) => setForm((p) => ({ ...p, hora_inicio: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Hora fin</Label>
                <Input type="time" value={form.hora_fin} onChange={(e) => setForm((p) => ({ ...p, hora_fin: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Salón <span className="text-muted-foreground font-normal">(opcional)</span></Label>
              <Input value={form.salon} onChange={(e) => setForm((p) => ({ ...p, salon: e.target.value }))} placeholder="Ej: Salón A" />
            </div>
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
