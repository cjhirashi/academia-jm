import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { AdminShell } from '@/components/admin/AdminShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let user = null
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      user = data.user
    }
  } catch { /* sin sesión */ }

  if (!user) {
    return <>{children}</>
  }

  return (
    <AdminShell email={user.email ?? ''}>
      {children}
    </AdminShell>
  )
}
