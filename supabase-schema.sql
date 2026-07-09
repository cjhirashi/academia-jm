-- =============================================
-- Academia JM — Schema de Supabase
-- Ejecuta este script en el SQL Editor de Supabase
-- =============================================

-- Servicios / Clases
create table if not exists servicios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  icono text default 'Music',
  imagen_url text,
  orden int default 0,
  activo boolean default true,
  created_at timestamptz default now()
);

-- Horarios (grilla semanal)
create table if not exists horarios (
  id uuid primary key default gen_random_uuid(),
  servicio_id uuid references servicios(id) on delete cascade,
  dia_semana int not null check (dia_semana between 1 and 7),
  hora_inicio time not null,
  hora_fin time not null,
  salon text
);

-- Profesores
create table if not exists profesores (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  especialidad text,
  bio text,
  foto_url text,
  orden int default 0,
  activo boolean default true,
  created_at timestamptz default now()
);

-- Relación profesores ↔ servicios (muchos a muchos)
create table if not exists servicio_profesores (
  servicio_id uuid references servicios(id) on delete cascade,
  profesor_id uuid references profesores(id) on delete cascade,
  primary key (servicio_id, profesor_id)
);

-- Galería por servicio (fotos específicas de cada clase)
create table if not exists servicio_galeria (
  id uuid primary key default gen_random_uuid(),
  servicio_id uuid references servicios(id) on delete cascade,
  url text not null,
  alt text,
  orden int default 0
);

-- Galería de imágenes
create table if not exists galeria (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt text,
  orden int default 0,
  created_at timestamptz default now()
);

-- Información de contacto (fila única id=1)
create table if not exists contacto (
  id int primary key default 1,
  telefono text,
  whatsapp text,
  email text,
  direccion text,
  horario_atencion text,
  facebook_url text,
  instagram_url text
);

-- Insertar datos iniciales de la academia
insert into servicios (nombre, descripcion, icono, orden) values
  ('Salsa', 'Aprende los pasos y el ritmo de la salsa con nuestros instructores certificados.', 'Music', 1),
  ('Cumbia', 'Domina el ritmo colombiano más popular. Clases para todos los niveles.', 'Waves', 2),
  ('Zumba', 'Combina fitness y baile en una clase llena de energía. Quema calorías bailando.', 'Flame', 3),
  ('Jumping', 'Entrenamiento de alto impacto en trampolines individuales. Fortalece tu cuerpo.', 'Zap', 4),
  ('Yoga', 'Encuentra tu equilibrio interior. Flexibilidad, fuerza y meditación.', 'Heart', 5)
on conflict do nothing;

insert into contacto (id, telefono, whatsapp, direccion, horario_atencion, facebook_url) values
  (1, '55 3465 0764', '5553465764', 'Calle Monte Naranjo #146, Col. Jesús del Monte, Cuajimalpa de Morelos, 05260, CDMX', 'Lun-Vie: 7:00-21:00 | Sáb: 9:00-14:00', 'https://facebook.com/AcademiaJM')
on conflict (id) do nothing;

-- =============================================
-- RLS (Row Level Security)
-- =============================================

-- Habilitar RLS en todas las tablas
alter table servicios enable row level security;
alter table horarios enable row level security;
alter table galeria enable row level security;
alter table contacto enable row level security;

-- Lectura pública para todos
create policy "Lectura publica servicios" on servicios for select using (true);
create policy "Lectura publica horarios" on horarios for select using (true);
create policy "Lectura publica galeria" on galeria for select using (true);
create policy "Lectura publica contacto" on contacto for select using (true);

-- Escritura solo para usuarios autenticados (administradores)
create policy "Admin servicios" on servicios for all using (auth.role() = 'authenticated');
create policy "Admin horarios" on horarios for all using (auth.role() = 'authenticated');
create policy "Admin galeria" on galeria for all using (auth.role() = 'authenticated');
create policy "Admin contacto" on contacto for all using (auth.role() = 'authenticated');

-- Nuevas tablas
alter table profesores enable row level security;
alter table servicio_profesores enable row level security;
alter table servicio_galeria enable row level security;

create policy "Lectura publica profesores" on profesores for select using (true);
create policy "Lectura publica servicio_profesores" on servicio_profesores for select using (true);
create policy "Lectura publica servicio_galeria" on servicio_galeria for select using (true);

create policy "Admin profesores" on profesores for all using (auth.role() = 'authenticated');
create policy "Admin servicio_profesores" on servicio_profesores for all using (auth.role() = 'authenticated');
create policy "Admin servicio_galeria" on servicio_galeria for all using (auth.role() = 'authenticated');

-- =============================================
-- Storage Buckets
-- =============================================
-- Crear manualmente en Supabase Dashboard > Storage:
-- 1. Bucket "galeria" — público
-- 2. Bucket "servicios" — público
