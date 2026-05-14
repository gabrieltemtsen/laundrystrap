'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import type { Order } from '@/lib/types'
import { AppShell } from '@/components/app-shell'
import { Badge, ButtonLink, Card, CardContent, CardHeader, CardTitle, CardDescription, EmptyState, Spinner, PageHeader } from '@/components/ui'
import { Clock, MapPin, ClipboardList, Filter, Search } from 'lucide-react'

type StatusFilter = 'all' | 'Awaiting Intake' | 'In Wash' | 'Ready for Pickup' | 'Completed'

function StatusPill({ status }: { status: string }) {
  if (status === 'Ready for Pickup') return <Badge variant="success" dot>Ready</Badge>
  if (status === 'In Wash')          return <Badge variant="cyan" dot>In Wash</Badge>
  if (status === 'Completed')        return <Badge variant="default">Done</Badge>
  return <Badge variant="warn" dot>Intake</Badge>
}

function formatDue(dueAt?: number) {
  if (!dueAt) return '—'
  const d        = new Date(dueAt)
  const today    = new Date()
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)
  const time = d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
  if (d < today && d.toDateString() !== today.toDateString()) return <span className="text-red-400">Overdue</span>
  if (d.toDateString() === today.toDateString())    return `Today ${time}`
  if (d.toDateString() === tomorrow.toDateString()) return `Tomorrow ${time}`
  return d.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }) + ' ' + time
}

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: 'All',           value: 'all'              },
  { label: 'Awaiting',      value: 'Awaiting Intake'  },
  { label: 'In Wash',       value: 'In Wash'          },
  { label: 'Ready',         value: 'Ready for Pickup' },
  { label: 'Completed',     value: 'Completed'        },
]

export default function OrdersPage() {
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')
  const ordersRaw = useQuery(api.orders.list, { limit: 200 })
  const orders    = ordersRaw as Order[] | undefined

  const filtered = orders?.filter((o) => {
    const matchStatus = filter === 'all' || o.status === filter
    const matchSearch = !search ||
      o.code.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  }) ?? []

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Orders"
          description="All laundry orders across every status."
          actions={
            <ButtonLink href="/ops/intake" variant="primary" size="sm">
              <ClipboardList className="h-4 w-4" />
              New Intake
            </ButtonLink>
          }
        />

        {/* Search + filter row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order code or customer…"
              className="w-full h-10 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] pl-10 pr-4 text-sm text-[var(--text)] placeholder:text-[var(--muted)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <div className="flex gap-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === tab.value
                    ? 'bg-indigo-600 text-white shadow-[0_2px_8px_rgba(99,102,241,.35)]'
                    : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-3)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {filter === 'all' ? 'All Orders' : filter}
                  {orders !== undefined && (
                    <span className="ml-2 text-xs font-normal text-[var(--muted)]">({filtered.length})</span>
                  )}
                </CardTitle>
                <CardDescription>Click any row to open the order detail.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {orders === undefined ? (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-[var(--muted)]">
                <Spinner className="h-5 w-5" /> Loading orders…
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="No orders found"
                description={search ? `No orders match "${search}"` : 'No orders for this status.'}
              />
            ) : (
              <div className="overflow-x-auto">
                <div className="grid grid-cols-12 gap-2 border-b border-[var(--border)] px-5 py-2.5 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">
                  <div className="col-span-3">Order / Customer</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Total</div>
                  <div className="col-span-3 flex items-center gap-1"><Clock className="h-3 w-3" /> Due</div>
                  <div className="col-span-2 flex items-center gap-1"><MapPin className="h-3 w-3" /> Notes</div>
                </div>

                {filtered.map((o: Order) => (
                  <Link
                    key={o._id}
                    href={`/ops/orders/${o._id}`}
                    className="grid grid-cols-12 gap-2 border-b border-[var(--border)]/60 px-5 py-4 text-sm hover:bg-[var(--surface-2)] group transition-all last:border-0"
                  >
                    <div className="col-span-3">
                      <div className="font-bold text-[var(--text)] group-hover:text-indigo-400 transition-colors font-mono text-xs">{o.code}</div>
                      <div className="text-xs text-[var(--muted)] mt-0.5">{o.customerName}</div>
                    </div>
                    <div className="col-span-2 flex items-center"><StatusPill status={o.status} /></div>
                    <div className="col-span-2 flex items-center font-mono text-xs font-black" style={{ color: o.totalPrice ? 'var(--naira)' : 'var(--muted)' }}>
                      {o.totalPrice ? `₦${o.totalPrice.toLocaleString()}` : '—'}
                    </div>
                    <div className="col-span-3 text-[var(--muted)] text-xs flex items-center">{formatDue(o.dueAt)}</div>
                    <div className="col-span-2 text-[var(--muted)] text-xs flex items-center truncate">{o.notes?.split('|')[0]?.trim() || '—'}</div>
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
