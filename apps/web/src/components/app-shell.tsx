'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { cn } from '@/lib/cn'
import { ButtonLink, Container } from '@/components/ui'
import {
  ClipboardList,
  LayoutDashboard,
  QrCode,
  Shirt,
  Sparkles,
  Search,
  Users,
  Tag,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react'

const nav = [
  { href: '/ops', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/ops/intake', label: 'New Intake', icon: ClipboardList, exact: false },
  { href: '/ops/scan', label: 'Scan Tag', icon: QrCode, exact: false },
  { href: '/ops/customers', label: 'Customers', icon: Users, exact: false },
  { href: '/ops/prices', label: 'Price Settings', icon: Tag, exact: false },
]

function NavItem({ item, pathname, onClick }: { item: typeof nav[0]; pathname: string; onClick?: () => void }) {
  const active = item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(item.href + '/')
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
        active
          ? 'bg-primary/15 text-primary ring-1 ring-primary/20'
          : 'text-white/50 hover:bg-white/5 hover:text-white/90',
      )}
    >
      <Icon
        className={cn(
          'h-4 w-4 shrink-0 transition-colors',
          active ? 'text-primary' : 'text-white/30 group-hover:text-white/60',
        )}
      />
      <span className="flex-1">{item.label}</span>
      {active && <ChevronRight className="h-3 w-3 text-primary/50" />}
    </Link>
  )
}

function SidebarContent({ pathname, onLinkClick }: { pathname: string; onLinkClick?: () => void }) {
  return (
    <>
      <div className="flex h-14 shrink-0 items-center gap-3 px-4 border-b border-white/[0.06]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 ring-1 ring-primary/30">
          <Shirt className="h-4 w-4 text-primary" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold text-white">LaundryStrap</div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-white/30">Ops Console</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {nav.map((item) => (
          <NavItem key={item.href} item={item} pathname={pathname} onClick={onLinkClick} />
        ))}
      </nav>

      <div className="px-3 pb-4">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/50">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Quick tip
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-white/30">
            Tag every item at intake — no tag means no chain of custody.
          </p>
        </div>
      </div>
    </>
  )
}

function SidebarNav({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-white/[0.06] bg-[#07101f] md:flex md:flex-col">
      <SidebarContent pathname={pathname} />
    </aside>
  )
}

function MobileDrawer({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute left-0 top-0 bottom-0 w-60 bg-[#07101f] flex flex-col border-r border-white/10">
        <div className="flex h-14 shrink-0 items-center justify-between px-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 ring-1 ring-primary/30">
              <Shirt className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-sm font-bold text-white">LaundryStrap</span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <SidebarContent pathname={pathname} onLinkClick={onClose} />
        </div>
      </aside>
    </div>
  )
}

function Topbar({ onMenuClick, title }: { onMenuClick: () => void; title: string }) {
  return (
    <header className="sticky top-0 z-10 border-b border-white/[0.06] bg-[#070e1c]/90 backdrop-blur">
      <Container className="flex h-14 items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-white">{title}</span>
        </div>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <div className="flex w-full max-w-sm items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-white/30 cursor-pointer hover:border-white/15 transition-all">
            <Search className="h-3.5 w-3.5" />
            Search orders, tags, customers…
            <kbd className="ml-auto text-[10px] bg-white/10 px-1.5 py-0.5 rounded font-mono text-white/40">⌘K</kbd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ButtonLink href="/ops/intake" variant="primary" size="sm">
            <ClipboardList className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Intake</span>
          </ButtonLink>
          <ButtonLink href="/ops/scan" variant="secondary" size="sm" className="hidden sm:inline-flex">
            <QrCode className="h-3.5 w-3.5" />
            Scan
          </ButtonLink>
        </div>
      </Container>
    </header>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const title = React.useMemo(() => {
    if (pathname === '/ops') return 'Dashboard'
    if (pathname.startsWith('/ops/intake')) return 'New Intake'
    if (pathname.startsWith('/ops/scan')) return 'Scan Tag'
    if (pathname.startsWith('/ops/customers')) return 'Customers'
    if (pathname.startsWith('/ops/prices')) return 'Price Settings'
    if (pathname.startsWith('/ops/orders/')) return 'Order Detail'
    return 'Ops'
  }, [pathname])

  return (
    <div className="min-h-screen">
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} pathname={pathname} />
      <div className="flex">
        <SidebarNav pathname={pathname} />
        <div className="min-w-0 flex-1">
          <Topbar onMenuClick={() => setMobileOpen(true)} title={title} />
          <main className="py-6">
            <Container>{children}</Container>
          </main>
        </div>
      </div>
    </div>
  )
}
