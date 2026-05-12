import type React from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { AppHeader } from '@/components/app-header'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex-1 p-6 bg-muted/30">
        <div className="mx-auto max-w-5xl">{children}</div>
    </main>
  )
}