import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let user = null
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      user = data.user
    }
  } catch { /* sin sesión */ }

  // Sin usuario: solo renderiza children (página de login)
  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="flex items-center justify-between border-b border-border/60 px-6 py-3 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <p className="text-sm text-muted-foreground">Panel de administración</p>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </header>
        <div className="flex-1 p-6 overflow-auto">{children}</div>
      </div>
    </div>
  )
}
