'use client'

import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import type { Order, Transaction } from '@/lib/types'
import { AppShell } from '@/components/app-shell'
import { Spinner } from '@/components/ui'
import { Search, ClipboardList, Clock, Download } from 'lucide-react'

type StatusFilter = 'all' | 'Awaiting Intake' | 'In Wash' | 'Ready for Pickup' | 'Completed'

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: 'All',       value: 'all'               },
  { label: 'Awaiting',  value: 'Awaiting Intake'   },
  { label: 'In Wash',   value: 'In Wash'           },
  { label: 'Ready',     value: 'Ready for Pickup'  },
  { label: 'Completed', value: 'Completed'         },
]

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#6366F1,#22D3EE)',
  'linear-gradient(135deg,#F59E0B,#EF4444)',
  'linear-gradient(135deg,#10B981,#22D3EE)',
  'linear-gradient(135deg,#A78BFA,#EC4899)',
  'linear-gradient(135deg,#22D3EE,#6366F1)',
  'linear-gradient(135deg,#EC4899,#F59E0B)',
]

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

function StationPill({ status }: { status: string }) {
  if (status === 'Ready for Pickup') return (
    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full text-emerald-400 bg-emerald-400/10">
      <span className="w-1.5 h-1.5 rounded-full bg-current" />READY
    </span>
  )
  if (status === 'In Wash') return (
    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full text-cyan-400 bg-cyan-400/10">
      <span className="w-1.5 h-1.5 rounded-full bg-current" />WASHING
    </span>
  )
  if (status === 'Completed') return (
    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full text-slate-400 bg-slate-400/10">
      DONE
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full text-sky-400 bg-sky-400/10">
      <span className="w-1.5 h-1.5 rounded-full bg-current" />SORTING
    </span>
  )
}

function formatDue(dueAt?: number, orderStatus?: string) {
  if (!dueAt) return { text: '—', cls: '' }
  // Completed orders are never "overdue" — they're done
  if (orderStatus === 'Completed') {
    return { text: new Date(dueAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }), cls: 'text-[var(--muted)]' }
  }
  const d        = new Date(dueAt)
  const now      = new Date()
  const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1)
  const time     = d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
  if (d < now)
    return { text: '⚠ Overdue', cls: 'text-red-400' }
  if (d.toDateString() === now.toDateString())
    return { text: `Today, ${time}`, cls: 'text-[var(--warning)]' }
  if (d.toDateString() === tomorrow.toDateString())
    return { text: `Tomorrow, ${time}`, cls: '' }
  return { text: d.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }) + ' ' + time, cls: '' }
}

export default function OrdersPage() {
  const searchParams = useSearchParams()
  const urlStatus    = searchParams.get('status') as StatusFilter | null

  const [filter, setFilter] = useState<StatusFilter>(
    urlStatus && STATUS_TABS.some((t) => t.value === urlStatus) ? urlStatus : 'all'
  )
  const [search, setSearch] = useState('')

  // Sync filter if URL param changes
  useEffect(() => {
    if (urlStatus && STATUS_TABS.some((t) => t.value === urlStatus)) {
      setFilter(urlStatus)
    }
  }, [urlStatus])

  const ordersRaw      = useQuery(api.orders.list, { limit: 200 })
  const transactionsRaw = useQuery(api.transactions.list, { limit: 500 })
  const orders         = ordersRaw as Order[] | undefined
  const transactions   = transactionsRaw as Transaction[] | undefined

  // Build a map: orderId → total amount paid (Paid status only)
  const paidMap = useMemo(() => {
    const m = new Map<string, number>()
    if (!transactions) return m
    for (const t of transactions) {
      if (t.status === 'Paid') {
        m.set(t.orderId, (m.get(t.orderId) ?? 0) + t.amountNgn)
      }
    }
    return m
  }, [transactions])

  const filtered = orders?.filter((o) => {
    const matchStatus = filter === 'all' || o.status === filter
    const matchSearch = !search ||
      o.code.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  }) ?? []

  const activeCount = orders?.filter(o => o.status !== 'Completed').length ?? 0

  return (
    <AppShell>
      <div className="flex flex-col gap-5">

        {/* Page head */}
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-['Montserrat'] text-[30px] font-extrabold tracking-tight text-[var(--text)]">Orders</h1>
            <p className="text-[var(--muted)] text-[13.5px] mt-1">
              {orders === undefined ? 'Loading…' : `${orders.length} total orders · ${activeCount} active · all laundry orders across every status`}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] border border-[var(--border)] bg-transparent text-[var(--text)] text-[13px] font-semibold hover:border-[var(--border-strong)] transition-all">
              <Download className="h-3.5 w-3.5" /> Export
            </button>
            <Link href="/ops/intake"
              className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-white text-[13px] font-semibold transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(135deg,#6366F1,#7C3AED)', boxShadow: '0 4px 14px -4px rgba(99,102,241,.5)' }}>
              <ClipboardList className="h-3.5 w-3.5" /> New Intake
            </Link>
          </div>
        </div>

        {/* Search + status tabs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by tag, phone, customer, or order #..."
              className="w-full h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-10 pr-4 text-sm text-[var(--text)] placeholder:text-[var(--muted)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
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

        {/* Orders table */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-2 font-bold text-[15px] text-[var(--text)]">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                {filter === 'all' ? 'All Orders' : filter}
                {orders !== undefined && (
                  <span className="text-xs font-normal text-[var(--muted)]">({filtered.length})</span>
                )}
              </div>
              <div className="text-[12px] text-[var(--muted)] mt-0.5">Click any order to view full timeline · scan a tag to jump straight to the item</div>
            </div>
          </div>

          {/* Header row */}
          <div className="hidden sm:grid gap-3.5 px-5 py-2.5 text-[10.5px] uppercase tracking-widest text-[var(--muted)] font-semibold border-b border-[var(--border)]"
               style={{ gridTemplateColumns: 'auto 1fr auto auto auto auto auto' }}>
            <div style={{ width: 34 }} />
            <div>Order / Customer</div>
            <div>Station</div>
            <div>Payment</div>
            <div className="flex items-center gap-1"><Clock className="h-3 w-3" />Due</div>
            <div>Amount</div>
            <div />
          </div>

          {/* Rows */}
          {orders === undefined ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-[var(--muted)]">
              <Spinner className="h-5 w-5" /> Loading orders…
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="w-12 h-12 rounded-xl bg-[var(--surface-2)] flex items-center justify-center text-[var(--muted)]">
                <ClipboardList className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-[var(--text)]">No orders found</p>
              <p className="text-xs text-[var(--muted)]">{search ? `No orders match "${search}"` : 'No orders for this status.'}</p>
            </div>
          ) : (
            filtered.map((o: Order, idx: number) => {
              const due      = formatDue(o.dueAt, o.status)
              const initials = getInitials(o.customerName)
              const grad     = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]

              // Real payment status from transactions
              const paidAmt    = paidMap.get(o._id) ?? 0
              const isFullPaid = o.totalPrice != null && paidAmt >= o.totalPrice
              const isPartial  = paidAmt > 0 && !isFullPaid
              const isUnpaid   = !isFullPaid && paidAmt === 0 && o.totalPrice != null

              return (
                <Link
                  key={o._id}
                  href={`/ops/orders/${o._id}`}
                  className="grid gap-3.5 items-center px-5 py-3.5 border-b border-[var(--border)]/60 last:border-0 hover:bg-[var(--surface-2)] group transition-all cursor-pointer"
                  style={{ gridTemplateColumns: 'auto 1fr auto auto auto auto auto' }}
                >
                  <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-white font-bold text-[13px] shrink-0"
                       style={{ background: grad, boxShadow: '0 4px 12px -4px rgba(99,102,241,.4)' }}>
                    {initials}
                  </div>
                  <div>
                    <div className="font-semibold text-[13.5px] text-[var(--text)] group-hover:text-indigo-300 transition-colors">
                      {o.customerName}
                    </div>
                    <div className="text-[11.5px] text-[var(--muted)] font-mono mt-0.5">
                      {o.code} · {o.notes?.split('|')[0]?.trim() || '—'}
                    </div>
                  </div>
                  <StationPill status={o.status} />

                  {/* Payment pill — based on actual transactions, not just whether a price exists */}
                  {transactions === undefined ? (
                    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full text-[var(--muted)] bg-[var(--surface-3)]">…</span>
                  ) : isFullPaid ? (
                    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full text-emerald-400 bg-emerald-400/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />PAID
                    </span>
                  ) : isPartial ? (
                    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full text-amber-400 bg-amber-400/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />PARTIAL
                    </span>
                  ) : isUnpaid ? (
                    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full text-red-400 bg-red-400/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />UNPAID
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full text-[var(--muted)] bg-[var(--surface-3)]">
                      NO PRICE
                    </span>
                  )}

                  <div className={`text-[11.5px] font-mono ${due.cls || 'text-[var(--text-2)]'}`}>{due.text}</div>
                  <div className="font-mono text-[13px] font-black" style={{ color: isFullPaid ? 'var(--naira)' : isPartial ? 'var(--warning)' : 'var(--muted)' }}>
                    {o.totalPrice ? `₦${o.totalPrice.toLocaleString()}` : '—'}
                    {isPartial && <span className="text-[10px] ml-1 opacity-70">(₦{paidAmt.toLocaleString()} paid)</span>}
                  </div>
                  <button className="inline-flex items-center h-8 px-3 rounded-lg border border-[var(--border)] bg-transparent text-[var(--text)] text-[12px] font-semibold hover:border-[var(--border-strong)] transition-all">
                    View →
                  </button>
                </Link>
              )
            })
          )}
        </div>

      </div>
    </AppShell>
  )
}
