'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Loader2, Trash2, Plus, Settings } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { DIAS_SEMANA, COLORES_SERVICIO } from '@/lib/types'
import type { Servicio, Profesor } from '@/lib/types'
import { crearHorario, eliminarHorario, asignarProfesorHorario, desasignarProfesorHorario } from './actions'

const HORAS = ['07:00', '08:00', '09:00', '10:00', '11:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']

type HorarioFull = {
  id: string
  servicio_id: string | null
  dia_semana: number
  hora_inicio: string
  hora_fin: string
  salon: string | null
  servicio: Servicio | null
  profesores: Profesor[]
}

export default function HorariosAdmin() {
  const [horarios, setHorarios] = useState<HorarioFull[]>([])
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [profesores, setProfesores] = useState<Profesor[]>([])
  const [loading, setLoading] = useState(true)

  // Dialog: nuevo horario
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedProfesores, setSelectedProfesores] = useState<string[]>([])
  const [form, setForm] = useState({ servicio_id: '', dia_semana: '1', hora_inicio: '09:00', hora_fin: '10:00', salon: '' })

  // Dialog: gestionar profesores de un horario existente
  const [gestionOpen, setGestionOpen] = useState(false)
  const [gestionHorario, setGestionHorario] = useState<HorarioFull | null>(null)

  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const [h, s, p] = await Promise.all([
      supabase.from('horarios').select('*, servicio:servicios(*), horario_profesores(profesor:profesores(*))').order('hora_inicio'),
      supabase.from('servicios').select('*').eq('activo', true).order('orden'),
      supabase.from('profesores').select('*').eq('activo', true).order('orden'),
    ])
    // Normalizar profesores anidados
    const normalized = (h.data ?? []).map((row: Record<string, unknown>) => ({
      ...row,
      profesores: ((row.horario_profesores as { profesor: Profesor }[]) ?? []).map((hp) => hp.profesor).filter(Boolean),
    })) as HorarioFull[]
    setHorarios(normalized)
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

  // --- Nuevo horario ---
  const openNew = () => {
    setForm({ servicio_id: servicios[0]?.id ?? '', dia_semana: '1', hora_inicio: '09:00', hora_fin: '10:00', salon: '' })
    setSelectedProfesores([])
    setOpen(true)
  }

  const toggleSeleccionado = (id: string) =>
    setSelectedProfesores((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  const handleSave = async () => {
    if (!form.servicio_id) { toast.error('Selecciona una clase'); return }
    setSaving(true)
    const { error, id } = await crearHorario({
      servicio_id: form.servicio_id,
      dia_semana: Number(form.dia_semana),
      hora_inicio: form.hora_inicio + ':00',
      hora_fin: form.hora_fin + ':00',
      salon: form.salon || null,
    })
    if (error || !id) { toast.error(`Error: ${error}`); setSaving(false); return }
    // Asignar profesores seleccionados
    await Promise.all(selectedProfesores.map((pid) => asignarProfesorHorario(id, pid)))
    toast.success('Horario creado')
    setOpen(false); setSaving(false); fetchData()
  }

  const handleDelete = async (id: string) => {
    const { error } = await eliminarHorario(id)
    if (error) { toast.error(error); return }
    toast.success('Eliminado'); fetchData()
  }

  // --- Gestionar profesores de horario existente ---
  const openGestion = (h: HorarioFull) => { setGestionHorario(h); setGestionOpen(true) }

  const toggleProfesorHorario = async (prof: Profesor) => {
    if (!gestionHorario) return
    const asignado = gestionHorario.profesores.some((p) => p.id === prof.id)
    if (asignado) {
      await desasignarProfesorHorario(gestionHorario.id, prof.id)
      setGestionHorario((prev) => prev ? { ...prev, profesores: prev.profesores.filter((p) => p.id !== prof.id) } : prev)
    } else {
      await asignarProfesorHorario(gestionHorario.id, prof.id)
      setGestionHorario((prev) => prev ? { ...prev, profesores: [...prev.profesores, prof] } : prev)
    }
    fetchData()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Horarios</h1>
          <p className="text-sm text-muted-foreground mt-1">Grilla semanal — clases y profesores</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Agregar horario</Button>
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
                      <td key={dia} className="px-1 py-1 align-top">
                        <div className="flex flex-col gap-1 items-center">
                          {clases.map((c) => (
                            <div key={c.id} className="text-center">
                              <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold text-white ${colorMap[c.servicio_id ?? ''] ?? 'bg-gray-500'}`}>
                                {c.servicio?.nombre ?? '—'}
                              </span>
                              {c.profesores.length > 0 && (
                                <div className="flex flex-wrap gap-0.5 justify-center mt-0.5">
                                  {c.profesores.map((p) => (
                                    <span key={p.id} className="text-[10px] text-muted-foreground">{p.nombre.split(' ')[0]}</span>
                                  ))}
                                </div>
                              )}
                              <div className="flex justify-center gap-1 mt-0.5">
                                <button onClick={() => openGestion(c)} className="text-muted-foreground hover:text-foreground" title="Gestionar profesores">
                                  <Settings className="h-3 w-3" />
                                </button>
                                <button onClick={() => handleDelete(c.id)} className="text-muted-foreground hover:text-destructive" title="Eliminar horario">
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
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

      {/* Dialog: nuevo horario */}
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
                <SelectContent>{servicios.map((s) => <SelectItem key={s.id} value={s.id}>{s.nombre}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Día</Label>
              <Select value={form.dia_semana} onValueChange={(v) => setForm((p) => ({ ...p, dia_semana: v }))}>
                <SelectTrigger>
                  <span>{DIAS_SEMANA[Number(form.dia_semana) - 1]}</span>
                </SelectTrigger>
                <SelectContent>{DIAS_SEMANA.map((d, i) => <SelectItem key={d} value={String(i + 1)}>{d}</SelectItem>)}</SelectContent>
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

            {profesores.length > 0 && (
              <div className="space-y-2">
                <Label>Profesores <span className="text-muted-foreground font-normal">(opcional, pueden ser varios)</span></Label>
                <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto">
                  {profesores.map((p) => {
                    const sel = selectedProfesores.includes(p.id)
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleSeleccionado(p.id)}
                        className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${sel ? 'border-[var(--gold)] bg-[var(--gold)]/10' : 'border-border/60 hover:bg-muted'}`}
                      >
                        <div className="h-7 w-7 rounded-full overflow-hidden bg-muted shrink-0 flex items-center justify-center">
                          {p.foto_url
                            ? <Image src={p.foto_url} alt={p.nombre} width={28} height={28} className="object-cover" />
                            : <span className="text-xs font-black text-[var(--gold)]">{p.nombre.charAt(0)}</span>}
                        </div>
                        <span className="font-medium">{p.nombre}</span>
                        {sel && <span className="ml-auto text-[var(--gold)] text-xs font-bold">✓</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !form.servicio_id}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: gestionar profesores de horario existente */}
      <Dialog open={gestionOpen} onOpenChange={setGestionOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Profesores — {gestionHorario?.servicio?.nombre}</DialogTitle>
            <p className="text-sm text-muted-foreground">
              {gestionHorario && `${DIAS_SEMANA[gestionHorario.dia_semana - 1]} ${gestionHorario.hora_inicio.slice(0, 5)}–${gestionHorario.hora_fin.slice(0, 5)}`}
            </p>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-1.5 py-2 max-h-72 overflow-y-auto">
            {profesores.map((p) => {
              const asignado = gestionHorario?.profesores.some((gp) => gp.id === p.id) ?? false
              return (
                <button
                  key={p.id}
                  onClick={() => toggleProfesorHorario(p)}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${asignado ? 'border-[var(--gold)] bg-[var(--gold)]/10' : 'border-border/60 hover:bg-muted'}`}
                >
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-muted shrink-0 flex items-center justify-center">
                    {p.foto_url
                      ? <Image src={p.foto_url} alt={p.nombre} width={32} height={32} className="object-cover" />
                      : <span className="text-sm font-black text-[var(--gold)]">{p.nombre.charAt(0)}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{p.nombre}</p>
                    {p.especialidad && <p className="text-xs text-muted-foreground truncate">{p.especialidad}</p>}
                  </div>
                  {asignado && <span className="text-[var(--gold)] font-bold">✓</span>}
                </button>
              )
            })}
          </div>
          <DialogFooter>
            <Button onClick={() => setGestionOpen(false)}>Listo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
