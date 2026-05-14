'use client'

import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Order } from '@/lib/types'
import { AppShell } from '@/components/app-shell'
import { Badge, ButtonLink, Card, CardContent, CardHeader, CardTitle, CardDescription, EmptyState, Spinner, PageHeader } from '@/components/ui'
import {
  ArrowRight, Clock, MapPin, QrCode,
  Users, TrendingUp, CheckCircle2, ClipboardList,
  Layers, DollarSign, Filter,
} from 'lucide-react'

/* ─────────────────────────────────────────────
   Status badge
───────────────────────────────────────────── */
function StatusPill({ status }: { status: string }) {
  if (status === 'Ready for Pickup') return <Badge variant="success" dot>Ready</Badge>
  if (status === 'In Wash')          return <Badge variant="cyan" dot>Washing</Badge>
  if (status === 'Completed')        return <Badge variant="default">Done</Badge>
  if (status === 'In Progress')      return <Badge variant="indigo" dot>In Progress</Badge>
  return <Badge variant="default" dot>Intake</Badge>
}

function formatDue(dueAt?: number) {
  if (!dueAt) return '—'
  const d        = new Date(dueAt)
  const today    = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const time = d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
  if (d.toDateString() === today.toDateString())    return `Today ${time}`
  if (d.toDateString() === tomorrow.toDateString()) return `Tomorrow ${time}`
  return d.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }) + ' ' + time
}

/* ─────────────────────────────────────────────
   Station kanban column
───────────────────────────────────────────── */
type StationDef = {
  key: string
  label: string
  color: string
  bg: string
  border: string
  glow: string
  count?: number
}

function KanbanColumn({ station }: { station: StationDef }) {
  return (
    <div className={`rounded-2xl border ${station.border} bg-[var(--surface)] p-4 flex flex-col gap-3 min-w-[130px] ${station.glow}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${station.bg} shrink-0`} />
          <span className="text-xs font-bold text-[var(--text-2)]">{station.label}</span>
        </div>
        <span className={`text-xs font-black ${station.color} bg-current/10 rounded-lg px-1.5 py-0.5 tabular-nums`}
              style={{ backgroundColor: `color-mix(in srgb, currentColor 12%, transparent)` }}>
          {station.count ?? 0}
        </span>
      </div>
      <div className="flex-1 min-h-[80px] rounded-xl border border-dashed border-[var(--border)] flex items-center justify-center">
        <span className="text-[10px] text-[var(--muted)]/50 font-medium">
          {station.count === 0 ? 'Empty' : `${station.count} item${(station.count ?? 0) > 1 ? 's' : ''}`}
        </span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Dashboard page
───────────────────────────────────────────── */
export default function DashboardPage() {
  const ordersRaw = useQuery(api.orders.list, { limit: 50 })
  const counts    = useQuery(api.orders.counts, {}) as
    | { awaitingIntake: number; inProgress: number; ready: number }
    | undefined

  const orders       = ordersRaw as Order[] | undefined
  const activeOrders = orders?.filter((o: Order) => o.status !== 'Completed') ?? []

  /* Stat cards */
  const stats = [
    {
      label: 'Awaiting Intake',
      value: counts?.awaitingIntake,
      icon: Clock,
      accent: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      glow: 'shadow-[0_0_22px_rgba(245,158,11,.12)]',
    },
    {
      label: 'In Progress',
      value: counts?.inProgress,
      icon: TrendingUp,
      accent: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      glow: 'shadow-[0_0_22px_rgba(99,102,241,.12)]',
    },
    {
      label: 'Ready for Pickup',
      value: counts?.ready,
      icon: CheckCircle2,
      accent: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      glow: 'shadow-[0_0_22px_rgba(16,185,129,.12)]',
    },
    {
      label: 'Total Orders',
      value: orders?.length,
      icon: Users,
      accent: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      glow: 'shadow-[0_0_22px_rgba(168,139,250,.12)]',
    },
  ]

  /* Kanban station data */
  const stations: StationDef[] = [
    { key: 'intake', label: 'Intake',    color: 'text-slate-400',  bg: 'bg-slate-400',   border: 'border-slate-500/20', glow: '' },
    { key: 'sort',   label: 'Sorting',   color: 'text-sky-400',    bg: 'bg-sky-400',     border: 'border-sky-500/20',   glow: 'shadow-[0_0_16px_rgba(56,189,248,.08)]' },
    { key: 'wash',   label: 'Washing',   color: 'text-cyan-400',   bg: 'bg-cyan-400',    border: 'border-cyan-500/20',  glow: 'shadow-[0_0_16px_rgba(6,182,212,.08)]'  },
    { key: 'dry',    label: 'Drying',    color: 'text-amber-400',  bg: 'bg-amber-400',   border: 'border-amber-500/20', glow: 'shadow-[0_0_16px_rgba(245,158,11,.08)]' },
    { key: 'iron',   label: 'Ironing',   color: 'text-orange-400', bg: 'bg-orange-400',  border: 'border-orange-500/20',glow: 'shadow-[0_0_16px_rgba(251,146,60,.08)]'  },
    { key: 'fold',   label: 'Folding',   color: 'text-violet-400', bg: 'bg-violet-400',  border: 'border-violet-500/20',glow: 'shadow-[0_0_16px_rgba(167,139,250,.08)]' },
    { key: 'ready',  label: 'Ready',     color: 'text-emerald-400',bg: 'bg-emerald-400', border: 'border-emerald-500/20',glow:'shadow-[0_0_16px_rgba(16,185,129,.08)]'  },
  ]

  return (
    <AppShell>
      <div className="flex flex-col gap-6">

        {/* Page header */}
        <PageHeader
          title="Today's Queue"
          description="Track every order — from intake to pickup."
          actions={
            <>
              <ButtonLink href="/ops/scan" variant="secondary" size="sm">
                <QrCode className="h-4 w-4" />
                Scan Tag
              </ButtonLink>
              <ButtonLink href="/ops/intake" variant="primary" size="sm">
                <ClipboardList className="h-4 w-4" />
                New Intake
                <ArrowRight className="h-3.5 w-3.5" />
              </ButtonLink>
            </>
          }
        />

        {/* Stats cards */}
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all hover:-translate-y-0.5 ${s.glow}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${s.accent}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-[var(--muted)] text-xs font-semibold uppercase tracking-widest mb-1">{s.label}</div>
                <div className="text-3xl font-black text-[var(--text)]">
                  {s.value === undefined
                    ? <Spinner className="h-6 w-6 inline" />
                    : s.value}
                </div>
              </div>
            )
          })}
        </div>

        {/* Station kanban */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-[var(--text)]">Station Board</h2>
              <p className="text-xs text-[var(--muted)]">Live garment flow across all wash stations</p>
            </div>
            <ButtonLink href="/ops/stations" variant="ghost" size="sm">
              <Layers className="h-3.5 w-3.5" />
              Manage Stations
            </ButtonLink>
          </div>
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
              {stations.map((station) => (
                <KanbanColumn key={station.key} station={station} />
              ))}
            </div>
          </div>
        </div>

        {/* Active queue */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle>Active Queue</CardTitle>
                <CardDescription>Open an order to update status, add items, or print tags.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <ButtonLink href="/ops/customers" variant="ghost" size="sm">
                  <Users className="h-4 w-4" />
                  All Customers
                </ButtonLink>
                <button className="h-8 px-3 text-xs inline-flex items-center gap-2 rounded-xl font-semibold transition-all bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--surface-3)] border border-[var(--border)]">
                  <Filter className="h-3.5 w-3.5" />
                  Filter
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {orders === undefined ? (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-[var(--muted)]">
                <Spinner className="h-5 w-5" />
                Loading orders…
              </div>
            ) : activeOrders.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="No active orders"
                description="Start a new intake to get the queue rolling."
                action={
                  <ButtonLink href="/ops/intake" variant="primary" size="sm">
                    <ClipboardList className="h-4 w-4" />
                    New Intake
                  </ButtonLink>
                }
              />
            ) : (
              <div className="overflow-x-auto">
                {/* Table header */}
                <div className="grid grid-cols-12 gap-2 border-b border-[var(--border)] px-5 py-2.5 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">
                  <div className="col-span-4">Order / Customer</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-3 flex items-center gap-1"><Clock className="h-3 w-3" /> Due</div>
                  <div className="col-span-3 flex items-center gap-1"><MapPin className="h-3 w-3" /> Location</div>
                </div>

                {activeOrders.map((o: Order) => (
                  <Link
                    key={o._id}
                    href={`/ops/orders/${o._id}`}
                    className="grid grid-cols-12 gap-2 border-b border-[var(--border)]/60 px-5 py-4 text-sm hover:bg-[var(--surface-2)] group transition-all last:border-0"
                  >
                    <div className="col-span-4">
                      <div className="font-bold text-[var(--text)] group-hover:text-indigo-400 transition-colors font-mono text-xs">{o.code}</div>
                      <div className="text-xs text-[var(--muted)] mt-0.5">{o.customerName}</div>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <StatusPill status={o.status} />
                    </div>
                    <div className="col-span-3 text-[var(--muted)] text-xs flex items-center">{formatDue(o.dueAt)}</div>
                    <div className="col-span-3 text-[var(--muted)] text-xs flex items-center truncate">
                      {o.expectedLocation || '—'}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </AppShell>
  )
}
