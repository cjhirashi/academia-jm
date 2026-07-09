import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { ThemeToggle } from '@/components/ThemeToggle'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="flex items-center justify-between border-b border-border/60 px-6 py-3 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <p className="text-sm text-muted-foreground">Panel de administración</p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{user.email}</span>
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 p-6 overflow-auto">{children}</div>
      </div>
    </div>
  )
}
