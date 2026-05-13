'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { cn } from '@/lib/cn'
import { ButtonLink, Container } from '@/components/ui'
import { ClipboardList, LayoutDashboard, QrCode, Shirt, Sparkles, Search } from 'lucide-react'

const nav = [
  { href: '/ops', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/ops/intake', label: 'New Intake', icon: ClipboardList },
  { href: '/ops/scan', label: 'Scan', icon: QrCode },
]

function SidebarNav() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border/60 bg-black/20 md:block">
      <div className="flex h-16 items-center gap-2 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 ring-1 ring-primary/30">
          <Shirt className="h-5 w-5 text-primary" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold">LaundryStrap</div>
          <div className="text-xs text-muted">Ops Console</div>
        </div>
      </div>

      <nav className="px-3">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition',
                active ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/5 hover:text-white',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-6 px-5">
        <div className="rounded-lg border border-border/60 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-primary" />
            Workflow tip
          </div>
          <p className="mt-2 text-xs text-muted">
            Intake fast: tag every item, then photo the whole bag. You can fill details later—don’t leave untagged garments.
          </p>
        </div>
      </div>
    </aside>
  )
}

function Topbar() {
  const pathname = usePathname()

  const title = React.useMemo(() => {
    if (pathname === '/ops') return 'Dashboard'
    if (pathname.startsWith('/ops/intake')) return 'Intake'
    if (pathname.startsWith('/ops/scan')) return 'Scan'
    if (pathname.startsWith('/ops/orders/')) return 'Order'
    return 'Ops'
  }, [pathname])

  return (
    <header className="sticky top-0 z-10 border-b border-border/60 bg-black/25 backdrop-blur supports-[backdrop-filter]:bg-black/25">
      <Container className="flex h-16 items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 ring-1 ring-primary/30">
            <Shirt className="h-5 w-5 text-primary" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">{title}</div>
            <div className="hidden text-xs text-muted md:block">LaundryStrap Ops</div>
          </div>
        </div>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-border/60 bg-white/5 px-3 py-2 text-xs text-muted">
            <Search className="h-4 w-4" />
            Search orders, tags, customers…
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ButtonLink href="/ops/intake" variant="primary" size="sm">
            <ClipboardList className="h-4 w-4" />
            New intake
          </ButtonLink>
          <ButtonLink href="/ops/scan" variant="secondary" size="sm" className="hidden sm:inline-flex">
            <QrCode className="h-4 w-4" />
            Scan
          </ButtonLink>
        </div>
      </Container>
    </header>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="flex">
        <SidebarNav />
        <div className="min-w-0 flex-1">
          <Topbar />
          <main className="py-6">
            <Container>{children}</Container>
          </main>
        </div>
      </div>
    </div>
  )
}
