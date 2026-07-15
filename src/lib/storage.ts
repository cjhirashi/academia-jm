import { getSignedUploadUrl, getPublicUrl } from '@/app/admin/upload-actions'

/**
 * Sube un archivo directamente a Supabase Storage sin pasar por Vercel.
 * 1. Pide URL firmada al servidor (petición pequeña, sin archivo)
 * 2. Sube el archivo directo a Supabase con PUT
 * 3. Devuelve la URL pública
 */
export async function uploadToStorage(
  file: File,
  bucket: string,
  folder: string,
): Promise<string> {
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('El archivo supera el límite de 10 MB')
  }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { signedUrl, path, error } = await getSignedUploadUrl(bucket, fileName)
  if (error || !signedUrl || !path) throw new Error(error ?? 'No se pudo generar la URL de subida')

  const res = await fetch(signedUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  })
  if (!res.ok) throw new Error(`Error al subir el archivo (${res.status})`)

  const publicUrl = await getPublicUrl(bucket, path)
  return publicUrl
}
