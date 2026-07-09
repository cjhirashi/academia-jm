'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2, Upload, ArrowUp, ArrowDown } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import type { GaleriaItem } from '@/lib/types'

export default function GaleriaAdmin() {
  const [items, setItems] = useState<GaleriaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const fetchItems = useCallback(async () => {
    const { data } = await supabase.from('galeria').select('*').order('orden')
    setItems(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchItems() }, [fetchItems])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error } = await supabase.storage.from('galeria').upload(fileName, file, { cacheControl: '3600', upsert: false })
      if (error) { toast.error(`Error subiendo ${file.name}`); continue }
      const { data: { publicUrl } } = supabase.storage.from('galeria').getPublicUrl(data.path)
      const maxOrden = items.length ? Math.max(...items.map((i) => i.orden)) : 0
      await supabase.from('galeria').insert({ url: publicUrl, alt: file.name.replace(/\.[^.]+$/, ''), orden: maxOrden + 1 })
    }
    toast.success('Imágenes subidas')
    setUploading(false)
    fetchItems()
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDelete = async (item: GaleriaItem) => {
    if (!confirm('¿Eliminar esta imagen?')) return
    const path = item.url.split('/galeria/')[1]
    if (path) await supabase.storage.from('galeria').remove([path])
    await supabase.from('galeria').delete().eq('id', item.id)
    toast.success('Imagen eliminada'); fetchItems()
  }

  const moveItem = async (idx: number, dir: -1 | 1) => {
    const newItems = [...items]
    const target = idx + dir
    if (target < 0 || target >= newItems.length) return
    const [a, b] = [newItems[idx], newItems[target]]
    await Promise.all([
      supabase.from('galeria').update({ orden: b.orden }).eq('id', a.id),
      supabase.from('galeria').update({ orden: a.orden }).eq('id', b.id),
    ])
    fetchItems()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Galería</h1>
          <p className="text-sm text-muted-foreground mt-1">Sube y administra las fotos de la academia</p>
        </div>
        <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
          Subir fotos
        </Button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
      </div>

      {/* Drop zone */}
      <div
        className="border-2 border-dashed border-border/60 rounded-xl p-10 text-center cursor-pointer hover:border-[var(--gold)]/50 transition-colors"
        onClick={() => fileRef.current?.click()}
      >
        <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Haz clic o arrastra imágenes aquí para subirlas</p>
        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP — máx. 5MB por imagen</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : items.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">Sin imágenes. Sube tu primera foto.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item, idx) => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden border border-border/60 aspect-square bg-muted">
              <Image src={item.url} alt={item.alt ?? 'galería'} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <div className="flex gap-1">
                  <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => moveItem(idx, -1)} disabled={idx === 0}>
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => moveItem(idx, 1)} disabled={idx === items.length - 1}>
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
                <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => handleDelete(item)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
