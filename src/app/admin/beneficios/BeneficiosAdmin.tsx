'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { crearBeneficio, actualizarBeneficio, eliminarBeneficio, toggleActivoBeneficio } from './actions'
import type { Beneficio } from '@/lib/types'

const ICONOS = ['Award', 'Users', 'Clock', 'Heart', 'Star', 'Zap', 'Music', 'Flame', 'Dumbbell', 'Waves', 'Shield', 'Trophy']

const EMPTY: Omit<Beneficio, 'id'> = { icono: 'Award', titulo: '', descripcion: '', orden: 1, activo: true }

export function BeneficiosAdmin({ beneficios }: { beneficios: Beneficio[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Beneficio | null>(null)
  const [form, setForm] = useState<Omit<Beneficio, 'id'>>(EMPTY)
  const [loading, setLoading] = useState(false)

  function openNew() {
    setEditing(null)
    setForm({ ...EMPTY, orden: beneficios.length + 1 })
    setOpen(true)
  }

  function openEdit(b: Beneficio) {
    setEditing(b)
    setForm({ icono: b.icono, titulo: b.titulo, descripcion: b.descripcion, orden: b.orden, activo: b.activo })
    setOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.titulo.trim() || !form.descripcion.trim()) {
      toast.error('Título y descripción son obligatorios')
      return
    }
    setLoading(true)
    const res = editing
      ? await actualizarBeneficio(editing.id, form)
      : await crearBeneficio(form)
    setLoading(false)
    if (res.error) { toast.error(res.error); return }
    toast.success(editing ? 'Beneficio actualizado' : 'Beneficio creado')
    setOpen(false)
    router.refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este beneficio?')) return
    const res = await eliminarBeneficio(id)
    if (res.error) { toast.error(res.error); return }
    toast.success('Beneficio eliminado')
    router.refresh()
  }

  async function handleToggle(b: Beneficio) {
    const res = await toggleActivoBeneficio(b.id, !b.activo)
    if (res.error) { toast.error(res.error); return }
    toast.success(b.activo ? 'Desactivado' : 'Activado')
    router.refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black">Beneficios</h1>
          <p className="text-sm text-muted-foreground mt-1">Sección "Tu mejor decisión" del home</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" /> Nuevo beneficio
        </Button>
      </div>

      {beneficios.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/60 p-12 text-center text-muted-foreground text-sm">
          Sin beneficios. Crea el primero.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {beneficios.map((b) => (
            <div key={b.id} className={`rounded-xl border p-5 bg-card transition-opacity ${b.activo ? 'border-border/60' : 'border-border/30 opacity-50'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">{b.icono}</span>
                <div className="flex gap-1">
                  <button onClick={() => handleToggle(b)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted text-muted-foreground" title={b.activo ? 'Desactivar' : 'Activar'}>
                    {b.activo ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                  <button onClick={() => openEdit(b)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted text-muted-foreground">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(b.id)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-destructive/10 text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="font-semibold text-sm mb-1">{b.titulo}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{b.descripcion}</p>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar beneficio' : 'Nuevo beneficio'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Ícono</Label>
              <select
                value={form.icono}
                onChange={e => setForm(f => ({ ...f, icono: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {ICONOS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Título</Label>
              <Input value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} placeholder="Ej. Instructores certificados" />
            </div>
            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <textarea
                value={form.descripcion}
                onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                placeholder="Breve descripción del beneficio"
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Orden</Label>
              <Input type="number" min={1} value={form.orden} onChange={e => setForm(f => ({ ...f, orden: Number(e.target.value) }))} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear beneficio'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
