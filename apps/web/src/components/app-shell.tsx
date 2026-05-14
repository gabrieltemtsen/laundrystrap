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
  Users,
  Tag,
  Menu,
  X,
  Zap,
  Search,
  ChevronRight,
} from 'lucide-react'

const nav = [
  { href: '/ops',           label: 'Dashboard',      icon: LayoutDashboard, exact: true  },
  { href: '/ops/intake',    label: 'New Intake',     icon: ClipboardList,   exact: false },
  { href: '/ops/scan',      label: 'Scan Tag',       icon: QrCode,          exact: false },
  { href: '/ops/customers', label: 'Customers',      icon: Users,           exact: false },
  { href: '/ops/prices',    label: 'Price Settings', icon: Tag,             exact: false },
]

function isActive(item: typeof nav[0], pathname: string) {
  return item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(item.href + '/')
}

function NavItem({
  item,
  pathname,
  onClick,
}: {
  item: typeof nav[0]
  pathname: string
  onClick?: () => void
}) {
  const active = isActive(item, pathname)
  const Icon   = item.icon

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
        active
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
          : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-100',
      )}
    >
      <Icon
        className={cn(
          'h-4 w-4 shrink-0 transition-colors',
          active ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-300',
        )}
      />
      <span className="flex-1">{item.label}</span>
      {active && <ChevronRight className="h-3 w-3 text-white/60" />}
    </Link>
  )
}

function SidebarInner({ pathname, onLinkClick }: { pathname: string; onLinkClick?: () => void }) {
  return (
    <>
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center gap-3 px-4 border-b border-zinc-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/30">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-black text-white tracking-tight">
            Laundry<span className="text-indigo-400">Strap</span>
          </div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Ops Console</div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {nav.map((item) => (
          <NavItem key={item.href} item={item} pathname={pathname} onClick={onLinkClick} />
        ))}
      </nav>

      {/* Footer link */}
      <div className="px-3 pb-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-xl bg-zinc-800/50 border border-zinc-800 px-3 py-2.5 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all"
        >
          <Zap className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
          View customer site
        </Link>
      </div>
    </>
  )
}

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-zinc-800 bg-zinc-950 md:flex md:flex-col">
      <SidebarInner pathname={pathname} />
    </aside>
  )
}

function MobileDrawer({
  open,
  onClose,
  pathname,
}: {
  open: boolean
  onClose: () => void
  pathname: string
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute left-0 top-0 bottom-0 w-60 bg-zinc-950 flex flex-col border-r border-zinc-800">
        <div className="flex h-14 shrink-0 items-center justify-between px-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-black text-white tracking-tight">
              Laundry<span className="text-indigo-400">Strap</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <SidebarInner pathname={pathname} onLinkClick={onClose} />
        </div>
      </aside>
    </div>
  )
}

function Topbar({ onMenuClick, title }: { onMenuClick: () => void; title: string }) {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <Container className="flex h-14 items-center justify-between gap-3">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-bold text-white">{title}</span>
        </div>

        {/* Centre search */}
        <div className="hidden flex-1 items-center justify-center md:flex">
          <div className="flex w-full max-w-sm items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-600 cursor-pointer hover:border-zinc-700 hover:text-zinc-500 transition-all">
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span>Search orders, tags, customers…</span>
            <kbd className="ml-auto text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-zinc-600 border border-zinc-700">⌘K</kbd>
          </div>
        </div>

        {/* Right */}
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
  const pathname                    = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const title = React.useMemo(() => {
    if (pathname === '/ops')                   return 'Dashboard'
    if (pathname.startsWith('/ops/intake'))    return 'New Intake'
    if (pathname.startsWith('/ops/scan'))      return 'Scan Tag'
    if (pathname.startsWith('/ops/customers')) return 'Customers'
    if (pathname.startsWith('/ops/prices'))    return 'Price Settings'
    if (pathname.startsWith('/ops/orders/'))   return 'Order Detail'
    return 'Ops'
  }, [pathname])

  return (
    <div className="min-h-screen">
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} pathname={pathname} />
      <div className="flex">
        <Sidebar pathname={pathname} />
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
