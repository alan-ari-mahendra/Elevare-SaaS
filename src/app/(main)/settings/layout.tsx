"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const tabs = [
    { name: "Profile", href: "/settings" },
    { name: "Billing", href: "/settings/billing" },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-6 bg-muted/30">
            <div className="mx-auto max-w-4xl">
              <h1 className="text-2xl font-bold tracking-tight text-foreground mb-6">Settings</h1>
              
              {/* Settings Tabs Navigation */}
              <div className="border-b mb-6">
                <nav className="-mb-px flex space-x-6" aria-label="Settings tabs">
                  {tabs.map((tab) => {
                    const isActive = pathname === tab.href
                    return (
                      <Link
                        key={tab.name}
                        href={tab.href}
                        className={cn(
                          "whitespace-nowrap border-b-2 pb-3 text-sm font-medium transition-colors",
                          isActive
                            ? "border-primary text-foreground"
                            : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                        )}
                      >
                        {tab.name}
                      </Link>
                    )
                  })}
                </nav>
              </div>

              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}