import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

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
        <AdminHeader email={user.email ?? ''} />
        <div className="flex-1 p-6 overflow-auto">{children}</div>
      </div>
    </div>
  )
}
