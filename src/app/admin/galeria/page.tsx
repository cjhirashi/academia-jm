'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2, Upload, ArrowUp, ArrowDown } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import type { GaleriaItem } from '@/lib/types'
import { uploadToStorage } from '@/lib/storage'
import { saveGaleriaPublica, eliminarGaleriaPublica, moverGaleriaPublica } from './actions'

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
    let subidas = 0
    for (const file of files) {
      try {
        const url = await uploadToStorage(file, 'galeria', '')
        const maxOrden = items.length ? Math.max(...items.map((i) => i.orden)) : 0
        const { error } = await saveGaleriaPublica(url, file.name.replace(/\.[^.]+$/, ''), maxOrden + subidas + 1)
        if (error) { toast.error(`Error guardando ${file.name}`); continue }
        subidas++
      } catch (err) {
        toast.error(err instanceof Error ? err.message : `Error: ${file.name}`)
      }
    }
    if (subidas > 0) toast.success(`${subidas} imagen${subidas > 1 ? 'es' : ''} subida${subidas > 1 ? 's' : ''}`)
    setUploading(false)
    fetchItems()
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDelete = async (item: GaleriaItem) => {
    if (!confirm('¿Eliminar esta imagen?')) return
    const { error } = await eliminarGaleriaPublica(item.id)
    if (error) { toast.error(error); return }
    toast.success('Imagen eliminada')
    setItems((prev) => prev.filter((i) => i.id !== item.id))
  }

  const handleDeleteAll = async () => {
    if (!confirm(`¿Eliminar las ${items.length} imágenes de la galería?`)) return
    await Promise.all(items.map((i) => eliminarGaleriaPublica(i.id)))
    setItems([])
    toast.success('Galería eliminada')
  }

  const moveItem = async (idx: number, dir: -1 | 1) => {
    const target = idx + dir
    if (target < 0 || target >= items.length) return
    const a = items[idx], b = items[target]
    const newItems = [...items]
    newItems[idx] = { ...a, orden: b.orden }
    newItems[target] = { ...b, orden: a.orden }
    newItems.sort((x, y) => x.orden - y.orden)
    setItems(newItems)
    await moverGaleriaPublica(a.id, a.orden, b.id, b.orden)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black">Galería</h1>
          <p className="text-sm text-muted-foreground mt-1">Fotos del home — máx. 10 MB por imagen</p>
        </div>
        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <Button variant="ghost" className="text-destructive hover:text-destructive gap-2" onClick={handleDeleteAll}>
              <Trash2 className="h-4 w-4" /> Eliminar todas
            </Button>
          )}
          <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Subir fotos
          </Button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
      </div>

      {/* Drop zone */}
      <div
        className="border-2 border-dashed border-border/60 rounded-xl p-10 text-center cursor-pointer hover:border-[var(--gold)]/50 transition-colors"
        onClick={() => fileRef.current?.click()}
      >
        <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Haz clic o arrastra imágenes aquí para subirlas</p>
        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP — máx. 10 MB por imagen</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : items.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">Sin imágenes. Sube tu primera foto.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item, idx) => (
            <div key={item.id} className="relative rounded-xl overflow-hidden border border-border/60 aspect-square bg-muted">
              <Image src={item.url} alt={item.alt ?? 'galería'} fill className="object-cover" />
              {/* Botones siempre visibles — funcionan en móvil y desktop */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex items-center justify-between">
                <div className="flex gap-1">
                  <button
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white disabled:opacity-30 transition-colors"
                    onClick={() => moveItem(idx, -1)} disabled={idx === 0} title="Mover arriba"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white disabled:opacity-30 transition-colors"
                    onClick={() => moveItem(idx, 1)} disabled={idx === items.length - 1} title="Mover abajo"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                  onClick={() => handleDelete(item)} title="Eliminar"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
