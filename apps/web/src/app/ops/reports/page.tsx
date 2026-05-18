'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import type { Order, Transaction } from '@/lib/types'
import { AppShell } from '@/components/app-shell'
import { Spinner } from '@/components/ui'

const BAR_DATA = [
  { day: 'Mon', orders: 38, revenue: 142 },
  { day: 'Tue', orders: 45, revenue: 168 },
  { day: 'Wed', orders: 41, revenue: 155 },
  { day: 'Thu', orders: 52, revenue: 184 },
  { day: 'Fri', orders: 60, revenue: 221 },
  { day: 'Sat', orders: 67, revenue: 248 },
  { day: 'Sun', orders: 29, revenue: 104 },
]
const maxRevenue = Math.max(...BAR_DATA.map((d) => d.revenue))

export default function ReportsPage() {
  const ordersRaw      = useQuery(api.orders.list, { limit: 200 })
  const transactionsRaw = useQuery(api.transactions.list, { limit: 500 })
  const orders         = ordersRaw as Order[] | undefined
  const transactions   = transactionsRaw as Transaction[] | undefined

  const todayStart = useMemo(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime()
  }, [])

  const counts = useMemo(() => ({
    inWash:    orders?.filter((o) => o.status === 'In Wash').length ?? 0,
    ready:     orders?.filter((o) => o.status === 'Ready for Pickup').length ?? 0,
    awaiting:  orders?.filter((o) => o.status === 'Awaiting Intake').length ?? 0,
    completed: orders?.filter((o) => o.status === 'Completed').length ?? 0,
    total:     orders?.length ?? 0,
  }), [orders])

  const revenueTotal = useMemo(() =>
    transactions?.filter((t) => t.status === 'Paid').reduce((s, t) => s + t.amountNgn, 0) ?? 0,
  [transactions])

  const revenueToday = useMemo(() =>
    transactions?.filter((t) => t.status === 'Paid' && t.createdAt >= todayStart)
      .reduce((s, t) => s + t.amountNgn, 0) ?? 0,
  [transactions, todayStart])

  const avgOrderValue = counts.total > 0 && revenueTotal > 0
    ? Math.round(revenueTotal / counts.total)
    : 0

  // Live status cards (clickable → filtered orders list)
  const STATUS_CARDS = [
    {
      label:   'Awaiting Intake',
      count:   counts.awaiting,
      color:   '#38BDF8',
      accent:  '#38BDF8',
      dot:     'bg-sky-400',
      href:    '/ops/orders?status=Awaiting+Intake',
      desc:    'Sorting queue',
    },
    {
      label:   'In Wash',
      count:   counts.inWash,
      color:   '#06B6D4',
      accent:  '#06B6D4',
      dot:     'bg-cyan-400',
      href:    '/ops/orders?status=In+Wash',
      desc:    'Currently washing',
    },
    {
      label:   'Ready for Pickup',
      count:   counts.ready,
      color:   '#10B981',
      accent:  '#10B981',
      dot:     'bg-emerald-400',
      href:    '/ops/orders?status=Ready+for+Pickup',
      desc:    'Awaiting customer',
    },
    {
      label:   'Completed',
      count:   counts.completed,
      color:   '#A78BFA',
      accent:  '#A78BFA',
      dot:     'bg-violet-400',
      href:    '/ops/orders?status=Completed',
      desc:    'All time',
    },
  ]

  return (
    <AppShell>
      <div className="flex flex-col gap-5">

        {/* Page head */}
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-['Montserrat'] text-[30px] font-extrabold tracking-tight text-[var(--text)]">Reports</h1>
            <p className="text-[var(--muted)] text-[13.5px] mt-1">
              Weekly snapshot · revenue, volume, and service breakdown
            </p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] border border-[var(--border)] bg-transparent text-[var(--text)] text-[13px] font-semibold hover:border-[var(--border-strong)] transition-all">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export CSV
            </button>
            <button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] border border-[var(--border)] bg-transparent text-[var(--text)] text-[13px] font-semibold hover:border-[var(--border-strong)] transition-all">
              This Week ▾
            </button>
          </div>
        </div>

        {/* Live order status cards — CLICKABLE */}
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[var(--muted)] font-semibold mb-2.5">Live Order Status — click to view orders</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {STATUS_CARDS.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="relative overflow-hidden bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 flex flex-col gap-2 hover:border-[var(--border-strong)] hover:-translate-y-0.5 transition-all group"
              >
                <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(80% 50% at 100% 0%, ${s.accent} 0%, transparent 60%)`, opacity: 0.15 }} />
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <span className="text-[10.5px] uppercase tracking-widest text-[var(--muted)] font-semibold">{s.label}</span>
                </div>
                <div className="font-['Montserrat'] text-[36px] font-extrabold tracking-tight leading-none" style={{ color: s.color }}>
                  {orders === undefined ? <Spinner className="h-7 w-7" /> : s.count}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[var(--muted)]">{s.desc}</span>
                  <span className="text-[11px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">View →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Orders',    value: orders === undefined ? '…' : String(counts.total),      delta: 'All time',            up: true,  accent: '#6366F1' },
            { label: 'Gross Revenue',   value: transactions === undefined ? '…' : revenueTotal >= 1000 ? `₦${(revenueTotal/1000).toFixed(0)}k` : `₦${revenueTotal}`, delta: 'From paid transactions', up: true,  accent: '#22D3EE' },
            { label: 'Avg Order Value', value: avgOrderValue > 0 ? `₦${avgOrderValue.toLocaleString()}` : '—', delta: 'Revenue ÷ orders', up: true,  accent: '#10B981' },
            { label: 'Revenue Today',   value: transactions === undefined ? '…' : revenueToday > 0 ? `₦${(revenueToday/1000).toFixed(1)}k` : '₦0', delta: 'Paid today',   up: false, accent: '#A78BFA' },
          ].map((s) => (
            <div key={s.label} className="relative overflow-hidden bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 flex flex-col gap-1.5">
              <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(80% 50% at 100% 0%, ${s.accent} 0%, transparent 60%)`, opacity: 0.18 }} />
              <div className="text-[10.5px] uppercase tracking-widest text-[var(--muted)] font-semibold">{s.label}</div>
              <div className="font-['Montserrat'] text-[28px] font-extrabold tracking-tight" style={{ color: s.accent === '#22D3EE' || s.accent === '#10B981' || s.accent === '#A78BFA' ? 'var(--naira)' : 'var(--text)' }}>
                {s.value}
              </div>
              <div className={`text-[11.5px] ${s.up ? 'text-emerald-400' : 'text-[var(--text-2)]'}`}>{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Bar chart card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] p-[18px]" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="flex items-center gap-2 font-bold text-[15px] text-[var(--text)] mb-4">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
            </div>
            Revenue This Week <span className="text-[12px] font-normal text-[var(--muted)] ml-1">(sample data)</span>
          </div>
          <div className="flex items-end gap-2 h-[200px] px-2 pb-0">
            {BAR_DATA.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md hover:brightness-125 transition-all cursor-pointer"
                  style={{
                    height: `${(d.revenue / maxRevenue) * 180}px`,
                    background: 'linear-gradient(180deg,#6366F1,rgba(99,102,241,.2))',
                  }}
                  title={`₦${d.revenue}k`}
                />
                <div className="text-[10px] text-[var(--muted)] font-mono">{d.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Order status breakdown table */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-2 font-bold text-[15px] text-[var(--text)]">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </div>
            Order Status Breakdown
          </div>
          <div className="grid gap-4 px-5 py-2.5 text-[10.5px] uppercase tracking-widest text-[var(--muted)] font-semibold border-b border-[var(--border)]"
               style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr' }}>
            <div>Status</div><div>Count</div><div>% of total</div><div>Action</div>
          </div>
          {STATUS_CARDS.map((s, i) => (
            <div
              key={s.label}
              className={`grid gap-4 px-5 py-3.5 items-center text-[13px] hover:bg-[var(--surface-2)] transition-all ${i < STATUS_CARDS.length - 1 ? 'border-b border-[var(--border)]/60' : ''}`}
              style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr' }}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                <span className="font-semibold text-[var(--text)]">{s.label}</span>
              </div>
              <div className="font-mono font-bold text-[var(--text-2)]">
                {orders === undefined ? <Spinner className="h-3.5 w-3.5" /> : s.count}
              </div>
              <div className="font-mono text-[var(--muted)]">
                {orders === undefined || counts.total === 0 ? '—' : `${Math.round((s.count / counts.total) * 100)}%`}
              </div>
              <Link
                href={s.href}
                className="inline-flex items-center gap-1 h-7 px-3 rounded-lg border border-[var(--border)] text-[11.5px] font-semibold text-[var(--text-2)] hover:text-indigo-400 hover:border-indigo-500/40 transition-all w-fit"
              >
                View orders →
              </Link>
            </div>
          ))}
        </div>

      </div>
    </AppShell>
  )
}
