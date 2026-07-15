'use client'

import { useState } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-auto min-w-0">
        <AdminHeader email={email} onToggleSidebar={() => setSidebarOpen(true)} />
        <div className="flex-1 p-4 md:p-6 overflow-auto">{children}</div>
      </div>
    </div>
  )
}
