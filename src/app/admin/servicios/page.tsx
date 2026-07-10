'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Pencil, Trash2, Loader2, Settings, Upload, X, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import type { Servicio, Profesor, ServicioGaleria } from '@/lib/types'

const ICONOS = ['Music', 'Waves', 'Flame', 'Zap', 'Heart', 'Dumbbell']

const defaultForm = { nombre: '', descripcion: '', icono: 'Music', imagen_url: '', orden: 0, activo: true }

export default function ServiciosAdmin() {
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [editId, setEditId] = useState<string | null>(null)

  // Gestionar dialog state
  const [gestionOpen, setGestionOpen] = useState(false)
  const [gestionServicio, setGestionServicio] = useState<Servicio | null>(null)
  const [allProfesores, setAllProfesores] = useState<Profesor[]>([])
  const [assignedProfesores, setAssignedProfesores] = useState<Profesor[]>([])
  const [servicioGaleria, setServicioGaleria] = useState<ServicioGaleria[]>([])
  const [gestionLoading, setGestionLoading] = useState(false)
  const [uploadingGaleria, setUploadingGaleria] = useState(false)

  const supabase = createClient()

  const fetchServicios = useCallback(async () => {
    const { data } = await supabase.from('servicios').select('*').order('orden')
    setServicios(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchServicios() }, [fetchServicios])

  const openNew = () => { setForm(defaultForm); setEditId(null); setOpen(true) }
  const openEdit = (s: Servicio) => {
    setForm({ nombre: s.nombre, descripcion: s.descripcion ?? '', icono: s.icono ?? 'Music', imagen_url: s.imagen_url ?? '', orden: s.orden, activo: s.activo })
    setEditId(s.id)
    setOpen(true)
  }

  const openGestion = async (s: Servicio) => {
    setGestionServicio(s)
    setGestionOpen(true)
    setGestionLoading(true)
    const [profesoresAll, profesoresAssigned, galeria] = await Promise.all([
      supabase.from('profesores').select('*').order('orden'),
      supabase.from('servicio_profesores').select('profesor:profesores(*)').eq('servicio_id', s.id),
      supabase.from('servicio_galeria').select('*').eq('servicio_id', s.id).order('orden'),
    ])
    setAllProfesores(profesoresAll.data ?? [])
    const assigned = (profesoresAssigned.data ?? []).map((r: { profesor: Profesor | Profesor[] }) =>
      Array.isArray(r.profesor) ? r.profesor[0] : r.profesor
    ).filter(Boolean) as Profesor[]
    setAssignedProfesores(assigned)
    setServicioGaleria(galeria.data ?? [])
    setGestionLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = { nombre: form.nombre, descripcion: form.descripcion || null, icono: form.icono, imagen_url: form.imagen_url || null, orden: form.orden, activo: form.activo }
    if (editId) {
      const { error } = await supabase.from('servicios').update(payload).eq('id', editId)
      if (error) { toast.error('Error al actualizar'); setSaving(false); return }
      toast.success('Servicio actualizado')
    } else {
      const { error } = await supabase.from('servicios').insert(payload)
      if (error) { toast.error(`Error al crear: ${error.message}`); setSaving(false); return }
      toast.success('Servicio creado')
    }
    setOpen(false); setSaving(false); fetchServicios()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este servicio?')) return
    const { error } = await supabase.from('servicios').delete().eq('id', id)
    if (error) { toast.error('Error al eliminar'); return }
    toast.success('Servicio eliminado'); fetchServicios()
  }

  const toggleActivo = async (s: Servicio) => {
    await supabase.from('servicios').update({ activo: !s.activo }).eq('id', s.id)
    fetchServicios()
  }

  // Gestionar: profesores
  const isAssigned = (profId: string) => assignedProfesores.some((p) => p.id === profId)

  const toggleProfesor = async (prof: Profesor) => {
    if (!gestionServicio) return
    if (isAssigned(prof.id)) {
      await supabase.from('servicio_profesores').delete()
        .eq('servicio_id', gestionServicio.id)
        .eq('profesor_id', prof.id)
      setAssignedProfesores((prev) => prev.filter((p) => p.id !== prof.id))
    } else {
      await supabase.from('servicio_profesores').insert({ servicio_id: gestionServicio.id, profesor_id: prof.id })
      setAssignedProfesores((prev) => [...prev, prof])
    }
  }

  // Gestionar: galeria per-service
  const handleGaleriaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length || !gestionServicio) return
    setUploadingGaleria(true)
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const fileName = `${gestionServicio.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error } = await supabase.storage.from('servicios').upload(fileName, file, { upsert: false })
      if (error) { toast.error(`Error: ${file.name}`); continue }
      const { data: { publicUrl } } = supabase.storage.from('servicios').getPublicUrl(data.path)
      const orden = servicioGaleria.length + 1
      const { data: inserted } = await supabase.from('servicio_galeria').insert({
        servicio_id: gestionServicio.id, url: publicUrl, alt: gestionServicio.nombre, orden
      }).select().single()
      if (inserted) setServicioGaleria((prev) => [...prev, inserted as ServicioGaleria])
    }
    setUploadingGaleria(false)
    toast.success('Fotos subidas')
    e.target.value = ''
  }

  const handleDeleteGaleriaItem = async (item: ServicioGaleria) => {
    await supabase.from('servicio_galeria').delete().eq('id', item.id)
    setServicioGaleria((prev) => prev.filter((g) => g.id !== item.id))
    toast.success('Foto eliminada')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Servicios</h1>
          <p className="text-sm text-muted-foreground mt-1">Administra las clases y disciplinas ofrecidas</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Nuevo servicio</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="rounded-xl border border-border/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Ícono</TableHead>
                <TableHead>Orden</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicios.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Sin servicios. Crea uno nuevo.</TableCell></TableRow>
              )}
              {servicios.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.nombre}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{s.icono}</TableCell>
                  <TableCell>{s.orden}</TableCell>
                  <TableCell>
                    <Badge variant={s.activo ? 'default' : 'secondary'} className="cursor-pointer" onClick={() => toggleActivo(s)}>
                      {s.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" title="Profesores y galería" onClick={() => openGestion(s)}><Settings className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialog: Crear / Editar servicio */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? 'Editar servicio' : 'Nuevo servicio'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Salsa" />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ícono</Label>
                <Select value={form.icono} onValueChange={(v) => setForm((prev) => ({ ...prev, icono: v ?? 'Music' }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ICONOS.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Orden</Label>
                <Input type="number" value={form.orden} onChange={(e) => setForm({ ...form, orden: Number(e.target.value) })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>URL de imagen (opcional)</Label>
              <Input value={form.imagen_url} onChange={(e) => setForm({ ...form, imagen_url: e.target.value })} placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !form.nombre}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Gestionar profesores y galería del servicio */}
      <Dialog open={gestionOpen} onOpenChange={setGestionOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestionar — {gestionServicio?.nombre}</DialogTitle>
          </DialogHeader>

          {gestionLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="space-y-8 py-2">
              {/* Profesores */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <UserPlus className="h-4 w-4 text-[var(--gold)]" />
                  <h3 className="font-bold text-sm uppercase tracking-wider">Profesores asignados</h3>
                </div>
                {allProfesores.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No hay profesores. Crea uno en la sección <strong>Profesores</strong>.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {allProfesores.map((p) => {
                      const active = isAssigned(p.id)
                      return (
                        <button
                          key={p.id}
                          onClick={() => toggleProfesor(p)}
                          className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${active ? 'border-[var(--gold)] bg-[var(--gold)]/10 text-foreground' : 'border-border/60 text-muted-foreground hover:bg-muted'}`}
                        >
                          <div className="h-8 w-8 rounded-full overflow-hidden bg-muted shrink-0 flex items-center justify-center">
                            {p.foto_url
                              ? <Image src={p.foto_url} alt={p.nombre} width={32} height={32} className="object-cover" />
                              : <span className="text-xs font-black text-[var(--gold)]">{p.nombre.charAt(0)}</span>}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{p.nombre}</p>
                            {p.especialidad && <p className="text-xs text-muted-foreground truncate">{p.especialidad}</p>}
                          </div>
                          {active && <span className="ml-auto text-[var(--gold)] text-xs font-bold">✓</span>}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Galería del servicio */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-[var(--gold)]" />
                    <h3 className="font-bold text-sm uppercase tracking-wider">Galería de la clase</h3>
                  </div>
                  <label className="inline-flex items-center gap-2 cursor-pointer rounded-lg border border-border/60 px-3 py-1.5 text-sm hover:bg-muted transition-colors">
                    {uploadingGaleria ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {uploadingGaleria ? 'Subiendo...' : 'Subir fotos'}
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleGaleriaUpload} disabled={uploadingGaleria} />
                  </label>
                </div>

                {servicioGaleria.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sin fotos. Sube imágenes de esta clase.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {servicioGaleria.map((img) => (
                      <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-muted">
                        <Image src={img.url} alt={img.alt ?? ''} fill className="object-cover" />
                        <button
                          onClick={() => handleDeleteGaleriaItem(img)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setGestionOpen(false)}>Listo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
