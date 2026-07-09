'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Pencil, Trash2, Loader2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import type { Profesor } from '@/lib/types'

const defaultForm = { nombre: '', especialidad: '', bio: '', foto_url: '', orden: 0, activo: true }

export default function ProfesoresAdmin() {
  const [profesores, setProfesores] = useState<Profesor[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [editId, setEditId] = useState<string | null>(null)
  const supabase = createClient()

  const fetchProfesores = useCallback(async () => {
    const { data } = await supabase.from('profesores').select('*').order('orden')
    setProfesores(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchProfesores() }, [fetchProfesores])

  const openNew = () => { setForm(defaultForm); setEditId(null); setOpen(true) }
  const openEdit = (p: Profesor) => {
    setForm({ nombre: p.nombre, especialidad: p.especialidad ?? '', bio: p.bio ?? '', foto_url: p.foto_url ?? '', orden: p.orden, activo: p.activo })
    setEditId(p.id)
    setOpen(true)
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const fileName = `prof-${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('servicios').upload(`profesores/${fileName}`, file, { upsert: false })
    if (error) { toast.error('Error al subir foto'); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('servicios').getPublicUrl(data.path)
    setForm((prev) => ({ ...prev, foto_url: publicUrl }))
    setUploading(false)
    toast.success('Foto subida')
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      nombre: form.nombre,
      especialidad: form.especialidad || null,
      bio: form.bio || null,
      foto_url: form.foto_url || null,
      orden: form.orden,
      activo: form.activo,
    }
    if (editId) {
      const { error } = await supabase.from('profesores').update(payload).eq('id', editId)
      if (error) { toast.error('Error al actualizar'); setSaving(false); return }
      toast.success('Profesor actualizado')
    } else {
      const { error } = await supabase.from('profesores').insert(payload)
      if (error) { toast.error('Error al crear'); setSaving(false); return }
      toast.success('Profesor creado')
    }
    setOpen(false); setSaving(false); fetchProfesores()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este profesor?')) return
    await supabase.from('profesores').delete().eq('id', id)
    toast.success('Eliminado'); fetchProfesores()
  }

  const toggleActivo = async (p: Profesor) => {
    await supabase.from('profesores').update({ activo: !p.activo }).eq('id', p.id)
    fetchProfesores()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Profesores</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestiona el equipo de instructores de la academia</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Nuevo profesor</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="rounded-xl border border-border/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foto</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead>Orden</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profesores.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Sin profesores. Crea uno nuevo.</TableCell></TableRow>
              )}
              {profesores.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                      {p.foto_url
                        ? <Image src={p.foto_url} alt={p.nombre} width={40} height={40} className="object-cover h-10 w-10" />
                        : <span className="text-sm font-black text-[var(--gold)]">{p.nombre.charAt(0)}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{p.nombre}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{p.especialidad ?? '—'}</TableCell>
                  <TableCell>{p.orden}</TableCell>
                  <TableCell>
                    <Badge variant={p.activo ? 'default' : 'secondary'} className="cursor-pointer" onClick={() => toggleActivo(p)}>
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editId ? 'Editar profesor' : 'Nuevo profesor'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            {/* Foto */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0">
                {form.foto_url
                  ? <Image src={form.foto_url} alt="foto" width={64} height={64} className="object-cover h-16 w-16" />
                  : <span className="text-xl font-black text-[var(--gold)]">{form.nombre.charAt(0) || '?'}</span>}
              </div>
              <div className="flex-1">
                <Label className="mb-1 block">Foto del profesor</Label>
                <label className="inline-flex items-center gap-2 cursor-pointer rounded-lg border border-border/60 px-3 py-1.5 text-sm hover:bg-muted transition-colors">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? 'Subiendo...' : 'Subir foto'}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nombre completo</Label>
              <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: María González" />
            </div>
            <div className="space-y-2">
              <Label>Especialidad</Label>
              <Input value={form.especialidad} onChange={(e) => setForm({ ...form, especialidad: e.target.value })} placeholder="Ej: Salsa Cubana y Bachata" />
            </div>
            <div className="space-y-2">
              <Label>Biografía</Label>
              <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Breve descripción del instructor..." />
            </div>
            <div className="space-y-2">
              <Label>Orden</Label>
              <Input type="number" value={form.orden} onChange={(e) => setForm({ ...form, orden: Number(e.target.value) })} />
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
    </div>
  )
}
