import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function TaskDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
          <main className="flex-1 p-6 bg-muted/30">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
      </div>
    </SidebarProvider>
  )
}
