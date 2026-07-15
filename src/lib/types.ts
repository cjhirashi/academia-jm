export type Servicio = {
  id: string
  nombre: string
  descripcion: string | null
  icono: string | null
  imagen_url: string | null
  orden: number
  activo: boolean
  created_at: string
}

export type Horario = {
  id: string
  servicio_id: string | null
  dia_semana: number // 1=Lunes…7=Domingo
  hora_inicio: string // "HH:MM:SS"
  hora_fin: string
  salon: string | null
  servicio?: Servicio
}

export type Profesor = {
  id: string
  nombre: string
  especialidad: string | null
  bio: string | null
  foto_url: string | null
  orden: number
  activo: boolean
  created_at: string
}

export type ServicioGaleria = {
  id: string
  servicio_id: string
  url: string
  alt: string | null
  orden: number
}

export type ServicioConDetalle = Servicio & {
  profesores?: Profesor[]
  galeria?: ServicioGaleria[]
}

export type GaleriaItem = {
  id: string
  url: string
  alt: string | null
  orden: number
  created_at: string
}

export type Contacto = {
  id: number
  telefono: string | null
  whatsapp: string | null
  email: string | null
  direccion: string | null
  horario_atencion: string | null
  facebook_url: string | null
  instagram_url: string | null
  mapa_embed_url: string | null
}

export type Beneficio = {
  id: string
  icono: string
  titulo: string
  descripcion: string
  orden: number
  activo: boolean
}

export const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export const COLORES_SERVICIO = [
  'bg-fuchsia-600',
  'bg-sky-500',
  'bg-pink-500',
  'bg-blue-500',
  'bg-rose-500',
  'bg-cyan-600',
  'bg-violet-500',
]

export const SERVICIOS_DEFAULT: Omit<Servicio, 'id' | 'created_at'>[] = [
  { nombre: 'Salsa', descripcion: 'Aprende los pasos y el ritmo de la salsa cubana y newyorkina con nuestros instructores certificados.', icono: 'Music', imagen_url: null, orden: 1, activo: true },
  { nombre: 'Cumbia', descripcion: 'Domina el ritmo colombiano más popular. Clases para todos los niveles, desde principiantes hasta avanzados.', icono: 'Waves', imagen_url: null, orden: 2, activo: true },
  { nombre: 'Zumba', descripcion: 'Combina fitness y baile en una clase llena de energía. Quema calorías mientras te diviertes al ritmo de la música.', icono: 'Flame', imagen_url: null, orden: 3, activo: true },
  { nombre: 'Jumping', descripcion: 'Entrenamiento de alto impacto en trampolines individuales. Fortalece tu cuerpo y mejora tu resistencia cardiovascular.', icono: 'Zap', imagen_url: null, orden: 4, activo: true },
  { nombre: 'Yoga', descripcion: 'Encuentra tu equilibrio interior. Clases de yoga para todos los niveles enfocadas en flexibilidad, fuerza y meditación.', icono: 'Heart', imagen_url: null, orden: 5, activo: true },
]
