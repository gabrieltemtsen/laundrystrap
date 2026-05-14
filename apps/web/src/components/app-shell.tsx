'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { cn } from '@/lib/cn'
import { ButtonLink, Container } from '@/components/ui'
import {
  LayoutDashboard,
  ClipboardList,
  Layers,
  ShoppingBag,
  Users,
  CreditCard,
  Tag,
  BarChart3,
  Truck,
  MessageSquare,
  Settings,
  Menu,
  X,
  Zap,
  Search,
  Bell,
  QrCode,
  ChevronRight,
  Wifi,
  ZapOff,
} from 'lucide-react'

/* ─────────────────────────────────────────────
   Nav structure
───────────────────────────────────────────── */
type NavItem = {
  href: string
  label: string
  icon: React.ElementType
  exact?: boolean
  badge?: string | number
  badgeVariant?: 'new' | 'alert' | 'count'
}

const navSections: Array<{ title: string; items: NavItem[] }> = [
  {
    title: 'Operations',
    items: [
      { href: '/ops',           label: 'Dashboard',        icon: LayoutDashboard, exact: true  },
      { href: '/ops/intake',    label: 'New Intake',       icon: ClipboardList,   exact: false },
      { href: '/ops/stations',  label: 'Stations',         icon: Layers,          exact: false, badge: 'NEW', badgeVariant: 'new' },
      { href: '/ops/orders',    label: 'Orders',           icon: ShoppingBag,     exact: false },
      { href: '/ops/customers', label: 'Customers',        icon: Users,           exact: false },
    ],
  },
  {
    title: 'Money',
    items: [
      { href: '/ops/payments',  label: 'Payments',         icon: CreditCard,      exact: false, badge: 7, badgeVariant: 'alert' },
      { href: '/ops/prices',    label: 'Pricing & Services', icon: Tag,           exact: false },
      { href: '/ops/reports',   label: 'Reports',          icon: BarChart3,       exact: false, badge: 'NEW', badgeVariant: 'new' },
    ],
  },
  {
    title: 'Logistics',
    items: [
      { href: '/ops/delivery',  label: 'Pickup & Delivery', icon: Truck,          exact: false, badge: 'NEW', badgeVariant: 'new' },
      { href: '/ops/comms',     label: 'Communications',   icon: MessageSquare,   exact: false, badge: 'NEW', badgeVariant: 'new' },
      { href: '/ops/settings',  label: 'Settings',         icon: Settings,        exact: false },
    ],
  },
]

function isActive(item: NavItem, pathname: string) {
  return item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(item.href + '/')
}

/* ─────────────────────────────────────────────
   Badge chip (sidebar)
───────────────────────────────────────────── */
function NavBadge({ badge, variant }: { badge: string | number; variant?: string }) {
  if (variant === 'new') {
    return (
      <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-gradient-to-r from-indigo-500/30 to-cyan-500/30 text-cyan-300 border border-cyan-500/25">
        NEW
      </span>
    )
  }
  if (variant === 'alert') {
    return (
      <span className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black px-1">
        {badge}
      </span>
    )
  }
  return (
    <span className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[var(--surface-3)] text-[var(--muted)] text-[10px] font-bold px-1">
      {badge}
    </span>
  )
}

/* ─────────────────────────────────────────────
   Single nav item
───────────────────────────────────────────── */
function NavItem({ item, pathname, onClick }: { item: NavItem; pathname: string; onClick?: () => void }) {
  const active = isActive(item, pathname)
  const Icon   = item.icon

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
        active
          ? 'bg-gradient-to-r from-indigo-500/18 to-indigo-500/6 border border-indigo-500/35 text-[var(--text)]'
          : 'text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-2)] border border-transparent',
      )}
    >
      <Icon
        className={cn(
          'h-4 w-4 shrink-0 transition-colors',
          active ? 'text-indigo-400' : 'text-[var(--muted)] group-hover:text-[var(--text-2)]',
        )}
      />
      <span className="flex-1 leading-none">{item.label}</span>
      {item.badge !== undefined && (
        <NavBadge badge={item.badge} variant={item.badgeVariant} />
      )}
      {active && !item.badge && <ChevronRight className="h-3 w-3 text-indigo-400/60 shrink-0" />}
    </Link>
  )
}

/* ─────────────────────────────────────────────
   Sidebar inner
───────────────────────────────────────────── */
function SidebarInner({ pathname, onLinkClick }: { pathname: string; onLinkClick?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* ── Logo ── */}
      <div className="flex h-14 shrink-0 items-center gap-3 px-4 border-b border-[var(--border)]">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-[0_4px_12px_rgba(99,102,241,.4)] shrink-0">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <div className="leading-tight min-w-0">
          <div className="text-sm font-black text-[var(--text)] tracking-tight">
            Laundry<span className="text-indigo-400">Strap</span>
          </div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--muted)] flex items-center gap-1">
            Ops Console
            <span className="text-indigo-500/60">· v2</span>
          </div>
        </div>
      </div>

      {/* ── Nav sections ── */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {navSections.map((section) => (
          <div key={section.title}>
            <div className="px-3 mb-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-[var(--muted)]/60">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavItem key={item.href} item={item} pathname={pathname} onClick={onLinkClick} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Branch footer card ── */}
      <div className="px-2 pb-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-[var(--text-2)]">Wuse II Branch</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[var(--muted)]">
            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> 3 staff online</span>
            <span className="flex items-center gap-1 text-emerald-400"><Wifi className="h-3 w-3" /> Power: ON</span>
          </div>
        </div>

        <Link
          href="/"
          className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-[var(--muted)] hover:text-[var(--text-2)] hover:bg-[var(--surface-2)] transition-all"
        >
          <Zap className="h-3 w-3 text-indigo-400 shrink-0" />
          View customer site
        </Link>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Desktop sidebar
───────────────────────────────────────────── */
function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-[var(--border)] bg-[var(--bg-grad-2,#070912)] md:flex md:flex-col h-screen sticky top-0">
      <SidebarInner pathname={pathname} />
    </aside>
  )
}

/* ─────────────────────────────────────────────
   Mobile drawer
───────────────────────────────────────────── */
function MobileDrawer({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute left-0 top-0 bottom-0 w-60 bg-[var(--bg-grad-2,#070912)] flex flex-col border-r border-[var(--border)]">
        <div className="flex h-14 shrink-0 items-center justify-between px-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-black text-[var(--text)] tracking-tight">
              Laundry<span className="text-indigo-400">Strap</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-all"
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

/* ─────────────────────────────────────────────
   Topbar
───────────────────────────────────────────── */
function Topbar({ onMenuClick, title }: { onMenuClick: () => void; title: string }) {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between gap-3">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-all"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-bold text-[var(--text)]">{title}</span>
        </div>

        {/* Centre search */}
        <div className="hidden flex-1 items-center justify-center md:flex">
          <div className="flex w-full max-w-sm items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs text-[var(--muted)] cursor-pointer hover:border-[var(--border-strong)] hover:text-[var(--text-2)] transition-all">
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span>Search orders, tags, customers…</span>
            <kbd className="ml-auto text-[10px] bg-[var(--surface-3)] px-1.5 py-0.5 rounded font-mono text-[var(--muted)] border border-[var(--border)]">⌘K</kbd>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Bell */}
          <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-all">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 border-2 border-[var(--surface)]" />
          </button>

          {/* QR scan */}
          <ButtonLink href="/ops/scan" variant="secondary" size="sm" className="hidden sm:inline-flex">
            <QrCode className="h-3.5 w-3.5" />
            Scan
          </ButtonLink>

          {/* New intake */}
          <ButtonLink href="/ops/intake" variant="primary" size="sm">
            <ClipboardList className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Intake</span>
          </ButtonLink>
        </div>
      </Container>
    </header>
  )
}

/* ─────────────────────────────────────────────
   AppShell
───────────────────────────────────────────── */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname                    = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const title = React.useMemo(() => {
    if (pathname === '/ops')                     return 'Dashboard'
    if (pathname.startsWith('/ops/intake'))      return 'New Intake'
    if (pathname.startsWith('/ops/stations'))    return 'Stations'
    if (pathname.startsWith('/ops/orders'))      return 'Orders'
    if (pathname.startsWith('/ops/customers'))   return 'Customers'
    if (pathname.startsWith('/ops/payments'))    return 'Payments'
    if (pathname.startsWith('/ops/prices'))      return 'Pricing & Services'
    if (pathname.startsWith('/ops/reports'))     return 'Reports'
    if (pathname.startsWith('/ops/delivery'))    return 'Pickup & Delivery'
    if (pathname.startsWith('/ops/comms'))       return 'Communications'
    if (pathname.startsWith('/ops/settings'))    return 'Settings'
    if (pathname.startsWith('/ops/scan'))        return 'Scan Tag'
    return 'Ops'
  }, [pathname])

  return (
    <div className="ops-root min-h-screen flex">
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} pathname={pathname} />
      <Sidebar pathname={pathname} />
      <div className="min-w-0 flex-1 flex flex-col">
        <Topbar onMenuClick={() => setMobileOpen(true)} title={title} />
        <main className="flex-1 py-6">
          <Container>{children}</Container>
        </main>
      </div>
    </div>
  )
}
