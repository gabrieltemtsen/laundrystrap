'use client'

import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Order } from '@/lib/types'
import { AppShell } from '@/components/app-shell'
import { Spinner } from '@/components/ui'
import { Download, QrCode } from 'lucide-react'

/* ─── helpers ──────────────────────────────── */
function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

function formatDue(dueAt?: number): { text: string; cls: string } {
  if (!dueAt) return { text: '—', cls: '' }
  const d        = new Date(dueAt)
  const now      = new Date()
  const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1)
  const time     = d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
  if (d < now && d.toDateString() !== now.toDateString())
    return { text: '⚠ ' + d.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }) + ' ' + time, cls: 'text-red-400' }
  if (d.toDateString() === now.toDateString())    return { text: `Today, ${time}`, cls: 'text-[var(--warning)]' }
  if (d.toDateString() === tomorrow.toDateString()) return { text: `Tomorrow, ${time}`, cls: '' }
  return { text: d.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }) + ' ' + time, cls: '' }
}

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#6366F1,#22D3EE)',
  'linear-gradient(135deg,#F59E0B,#EF4444)',
  'linear-gradient(135deg,#10B981,#22D3EE)',
  'linear-gradient(135deg,#A78BFA,#EC4899)',
  'linear-gradient(135deg,#22D3EE,#6366F1)',
  'linear-gradient(135deg,#F59E0B,#10B981)',
]

/* Station pill */
function StationPill({ station }: { station: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    'sorting':  { cls: 'text-sky-400 bg-sky-400/10',     label: 'SORTING' },
    'washing':  { cls: 'text-cyan-400 bg-cyan-400/10',   label: 'WASHING' },
    'drying':   { cls: 'text-amber-400 bg-amber-400/10', label: 'DRYING'  },
    'ironing':  { cls: 'text-orange-400 bg-orange-400/10',label:'IRONING' },
    'folding':  { cls: 'text-violet-400 bg-violet-400/10',label:'FOLDING' },
    'ready':    { cls: 'text-emerald-400 bg-emerald-400/10',label:'READY' },
    'In Wash':  { cls: 'text-cyan-400 bg-cyan-400/10',   label: 'WASHING' },
    'Awaiting Intake': { cls: 'text-sky-400 bg-sky-400/10', label: 'SORTING' },
    'Ready for Pickup':{ cls: 'text-emerald-400 bg-emerald-400/10', label: 'READY' },
    'Completed': { cls: 'text-slate-400 bg-slate-400/10', label: 'DONE' },
  }
  const s = map[station] ?? { cls: 'text-slate-400 bg-slate-400/10', label: station.toUpperCase() }
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full ${s.cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />{s.label}
    </span>
  )
}

/* Payment pill */
function PaymentPill({ paid }: { paid?: boolean }) {
  if (paid) return (
    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full text-emerald-400 bg-emerald-400/10">
      <span className="w-1.5 h-1.5 rounded-full bg-current" />PAID
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full text-red-400 bg-red-400/10">
      <span className="w-1.5 h-1.5 rounded-full bg-current" />UNPAID
    </span>
  )
}

/* Item card in kanban column */
function ItemCard({ tag, type, meta, urgent, readyGreen }: { tag: string; type: string; meta: string; urgent?: boolean; readyGreen?: boolean }) {
  return (
    <div
      className={`rounded-[10px] p-2.5 cursor-pointer transition-all hover:-translate-y-px ${
        urgent
          ? 'bg-[var(--surface-2)] border border-red-500/40 shadow-[0_0_0_1px_rgba(239,68,68,.15)_inset]'
          : readyGreen
          ? 'bg-[var(--surface-2)] border border-emerald-500/25'
          : 'bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--border-strong)]'
      }`}
    >
      <span
        className={`font-mono text-[10px] px-1.5 py-0.5 rounded inline-block ${
          urgent ? 'bg-red-500/15 text-red-300' : 'bg-indigo-500/10 text-[var(--text-2)]'
        }`}
      >
        {tag}
      </span>
      <div className="font-semibold text-[12.5px] text-[var(--text)] mt-1.5">{type}</div>
      <div className="text-[10.5px] text-[var(--muted)] mt-0.5 flex items-center gap-1.5">
        {meta.split('·').map((part, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="opacity-50">·</span>}
            {part.trim()}
          </span>
        ))}
      </div>
    </div>
  )
}

/* Station column */
function Station({ color, label, count, children }: { color: string; label: string; count: number; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3 min-h-[380px] flex flex-col">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2 font-bold text-[12.5px] text-[var(--text)]">
          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
          {label}
        </div>
        <span className="font-mono text-[11px] bg-[var(--surface-2)] border border-[var(--border)] px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      </div>
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-0.5">{children}</div>
    </div>
  )
}

/* ─── main page ─────────────────────────────── */
export default function DashboardPage() {
  const ordersRaw = useQuery(api.orders.list, { limit: 50 })
  const orders    = ordersRaw as Order[] | undefined
  const active    = orders?.filter((o) => o.status !== 'Completed') ?? []

  const today = new Date()
  const dateLabel = today.toLocaleDateString('en-NG', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <AppShell>
      <div className="flex flex-col gap-5">

        {/* ── Page head ── */}
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-['Montserrat'] text-[30px] font-extrabold tracking-tight text-[var(--text)]">Today's Operations</h1>
            <p className="text-[var(--muted)] text-[13.5px] mt-1">
              {dateLabel} · {active.length} active items across 6 stations · Avg turnaround 18h
            </p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] border border-[var(--border)] bg-transparent text-[var(--text)] text-[13px] font-semibold cursor-pointer hover:border-[var(--border-strong)] transition-all">
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
            <button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] border border-[var(--border)] bg-transparent text-[var(--text)] text-[13px] font-semibold cursor-pointer hover:border-[var(--border-strong)] transition-all">
              <QrCode className="h-3.5 w-3.5" />
              Scan Tag
            </button>
          </div>
        </div>

        {/* ── 5 stat cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          {/* In Progress */}
          <div className="relative overflow-hidden bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 flex flex-col gap-1.5"
               style={{ ['--accent' as any]: '#6366F1' }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(80% 50% at 100% 0%, #6366F1 0%, transparent 60%)', opacity: 0.18 }} />
            <div className="absolute top-3.5 right-3.5 w-[30px] h-[30px] rounded-lg bg-white/4 flex items-center justify-center text-[var(--text-2)]">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div className="text-[10.5px] uppercase tracking-widest text-[var(--muted)] font-semibold">In Progress</div>
            <div className="font-['Montserrat'] text-[28px] font-extrabold tracking-tight">
              {orders === undefined ? <Spinner className="h-6 w-6" /> : active.filter(o => o.status === 'In Wash').length + active.filter(o => o.status === 'Awaiting Intake').length}
            </div>
            <div className="text-[11.5px] text-emerald-400 flex items-center gap-1">▲ 8 since 9 AM</div>
          </div>

          {/* Ready for Pickup */}
          <div className="relative overflow-hidden bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 flex flex-col gap-1.5">
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(80% 50% at 100% 0%, #10B981 0%, transparent 60%)', opacity: 0.18 }} />
            <div className="absolute top-3.5 right-3.5 w-[30px] h-[30px] rounded-lg bg-white/4 flex items-center justify-center text-[var(--text-2)]">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <div className="text-[10.5px] uppercase tracking-widest text-[var(--muted)] font-semibold">Ready for Pickup</div>
            <div className="font-['Montserrat'] text-[28px] font-extrabold tracking-tight">
              {orders === undefined ? <Spinner className="h-6 w-6" /> : orders.filter(o => o.status === 'Ready for Pickup').length}
            </div>
            <div className="text-[11.5px] text-emerald-400">3 picked up today</div>
          </div>

          {/* SLA Overdue */}
          <div className="relative overflow-hidden bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 flex flex-col gap-1.5">
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(80% 50% at 100% 0%, #F59E0B 0%, transparent 60%)', opacity: 0.18 }} />
            <div className="absolute top-3.5 right-3.5 w-[30px] h-[30px] rounded-lg bg-white/4 flex items-center justify-center text-[var(--text-2)]">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
            </div>
            <div className="text-[10.5px] uppercase tracking-widest text-[var(--muted)] font-semibold">SLA Overdue</div>
            <div className="font-['Montserrat'] text-[28px] font-extrabold tracking-tight">3</div>
            <div className="text-[11.5px] text-red-400">Mrs Okafor — 6h late</div>
          </div>

          {/* Revenue Today */}
          <div className="relative overflow-hidden bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 flex flex-col gap-1.5">
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(80% 50% at 100% 0%, #22D3EE 0%, transparent 60%)', opacity: 0.18 }} />
            <div className="absolute top-3.5 right-3.5 w-[30px] h-[30px] rounded-lg bg-white/4 flex items-center justify-center text-[var(--text-2)]">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div className="text-[10.5px] uppercase tracking-widest text-[var(--muted)] font-semibold">Revenue Today</div>
            <div className="font-['Montserrat'] text-[28px] font-extrabold tracking-tight" style={{ color: 'var(--naira)' }}>₦184k</div>
            <div className="text-[11.5px] text-emerald-400">▲ 22% vs avg</div>
          </div>

          {/* Unpaid Pickups */}
          <div className="relative overflow-hidden bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 flex flex-col gap-1.5">
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(80% 50% at 100% 0%, #EF4444 0%, transparent 60%)', opacity: 0.18 }} />
            <div className="absolute top-3.5 right-3.5 w-[30px] h-[30px] rounded-lg bg-white/4 flex items-center justify-center text-[var(--text-2)]">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            </div>
            <div className="text-[10.5px] uppercase tracking-widest text-[var(--muted)] font-semibold">Unpaid Pickups</div>
            <div className="font-['Montserrat'] text-[28px] font-extrabold tracking-tight" style={{ color: 'var(--naira)' }}>₦47k</div>
            <div className="text-[11.5px] text-red-400">7 orders blocked</div>
          </div>
        </div>

        {/* ── Workflow Stations kanban ── */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] p-[18px]" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2 font-bold text-[15px] text-[var(--text)]">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                </div>
                Workflow Stations
              </div>
              <div className="text-[12px] text-[var(--muted)] mt-0.5">Items flow left → right. Scan a tag at each station to advance.</div>
            </div>
            <Link href="/ops/stations" className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] border border-[var(--border)] bg-transparent text-[var(--text)] text-[13px] font-semibold cursor-pointer hover:border-[var(--border-strong)] transition-all">
              View full board →
            </Link>
          </div>

          <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(6, minmax(0,1fr))' }}>
            <Station color="var(--st-sort)" label="Sorting" count={5}>
              <ItemCard urgent tag="ABJ-260514-0042-03" type="Native Attire · Embroidered" meta="M. Okafor · Due 2h" />
              <ItemCard tag="ABJ-260514-0048-01" type="Suit (2 piece)" meta="D. Adeyemi · Tomorrow" />
              <ItemCard tag="ABJ-260514-0049-02" type="Duvet · King" meta="Hilton Abuja · 2 days" />
            </Station>

            <Station color="var(--st-wash)" label="Washing" count={12}>
              <ItemCard tag="ABJ-260514-0040-01" type="Shirts × 4 · Wash & Fold" meta="B. Adamu · Drum 2" />
              <ItemCard tag="ABJ-260514-0041-02" type="Bed Sheets × 3" meta="Sheraton · Drum 1" />
              <ItemCard tag="ABJ-260514-0043-04" type="Towels Bundle" meta="F. Bello · Drum 3" />
            </Station>

            <Station color="var(--st-dry)" label="Drying" count={8}>
              <ItemCard tag="ABJ-260514-0038-01" type="Shirts × 6" meta="A. Okafor · 22 min left" />
              <ItemCard tag="ABJ-260514-0039-02" type="Trousers × 3" meta="Y. Lawal · Hang dry" />
            </Station>

            <Station color="var(--st-iron)" label="Ironing" count={9}>
              <ItemCard urgent tag="ABJ-260513-0029-01" type="Suit · Pressed" meta="G. Nnamdi · 6h overdue" />
              <ItemCard tag="ABJ-260514-0035-02" type="Native · Iro & Buba" meta="K. Bello" />
              <ItemCard tag="ABJ-260514-0037-01" type="Shirts × 4" meta="P. Okonkwo" />
            </Station>

            <Station color="var(--st-fold)" label="Folding" count={6}>
              <ItemCard tag="ABJ-260514-0033-01" type="Wash & Fold Bundle" meta="M. Yusuf · Bag 12" />
              <ItemCard tag="ABJ-260514-0036-03" type="Towels & Linens" meta="Transcorp Hilton" />
            </Station>

            <Station color="var(--st-ready)" label="Ready" count={17}>
              <ItemCard readyGreen tag="ABJ-260513-0026-01" type="Full Order · 8 items" meta="A. Okafor · SMS sent ✓" />
              <ItemCard readyGreen tag="ABJ-260513-0024-01" type="Dry Clean Bundle" meta="C. Adeleke · Awaiting payment" />
              <ItemCard readyGreen tag="ABJ-260513-0022-01" type="Native Attire × 2" meta="L. Eze · WA sent ✓" />
            </Station>
          </div>
        </div>

        {/* ── Active Orders table ── */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] p-[18px]" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2 font-bold text-[15px] text-[var(--text)]">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                </div>
                Active Orders
              </div>
              <div className="text-[12px] text-[var(--muted)] mt-0.5">Click any order to view full timeline · scan a tag to jump straight to the item</div>
            </div>
            {/* Filter chips */}
            <div className="flex gap-2 flex-wrap">
              {[
                { label: 'All', num: active.length, active: true },
                { label: 'Overdue', num: 3, active: false },
                { label: 'Today', num: 14, active: false },
                { label: 'Corporate', num: 8, active: false },
              ].map((chip) => (
                <button
                  key={chip.label}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${
                    chip.active
                      ? 'bg-[var(--primary)] text-white border-transparent'
                      : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-2)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  {chip.label}
                  {' '}
                  <span className="ml-1 font-mono text-[10.5px] bg-black/25 px-1.5 py-0.5 rounded-full">{chip.num}</span>
                </button>
              ))}
            </div>
          </div>

          {orders === undefined ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-[var(--muted)]">
              <Spinner className="h-5 w-5" /> Loading orders…
            </div>
          ) : active.length === 0 ? (
            /* Use static demo rows if no live data */
            <DemoOrderRows />
          ) : (
            <div className="flex flex-col gap-2">
              {active.slice(0, 10).map((o: Order, idx: number) => {
                const due = formatDue(o.dueAt)
                const initials = getInitials(o.customerName)
                const grad = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]
                return (
                  <Link
                    key={o._id}
                    href={`/ops/orders/${o._id}`}
                    className="grid items-center gap-3.5 py-3 px-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-3)] cursor-pointer transition-all"
                    style={{ gridTemplateColumns: 'auto 1fr auto auto auto auto auto' }}
                  >
                    <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-white font-bold text-[13px] shrink-0"
                         style={{ background: grad, boxShadow: '0 4px 12px -4px rgba(99,102,241,.4)' }}>
                      {initials}
                    </div>
                    <div>
                      <div className="font-semibold text-[13.5px]">
                        {o.customerName}
                      </div>
                      <div className="text-[11.5px] text-[var(--muted)] font-mono">{o.code} · {o.notes?.split('|')[0]?.trim() || '—'}</div>
                    </div>
                    <StationPill station={o.status} />
                    <PaymentPill paid={o.totalPrice ? true : false} />
                    <div className={`text-[11.5px] font-mono ${due.cls || 'text-[var(--text-2)]'}`}>{due.text}</div>
                    <div className="font-mono text-[13px] font-black" style={{ color: 'var(--naira)' }}>
                      {o.totalPrice ? `₦${o.totalPrice.toLocaleString()}` : '—'}
                    </div>
                    <button className="inline-flex items-center gap-1 h-8 px-3 rounded-lg border border-[var(--border)] bg-transparent text-[var(--text)] text-[12px] font-semibold hover:border-[var(--border-strong)] transition-all">
                      View →
                    </button>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </AppShell>
  )
}

/* Demo rows shown when no DB data */
function DemoOrderRows() {
  const rows = [
    { initials: 'AO', grad: 'linear-gradient(135deg,#6366F1,#22D3EE)', name: 'Amara Okafor', sub: '· Gold tier', meta: '#ORD-0042 · 6 items · 0801 234 5678', station: 'ironing', paid: true, due: '⚠ 6h overdue', dueCls: 'text-red-400', amount: '₦8,400' },
    { initials: 'TH', grad: 'linear-gradient(135deg,#F59E0B,#EF4444)', name: 'Transcorp Hilton', sub: '· Corporate', meta: '#ORD-0041 · 24 items · Net-30 invoicing', station: 'washing', paid: false, due: 'Today, 6 PM', dueCls: 'text-[var(--warning)]', amount: '₦36,000' },
    { initials: 'BA', grad: 'linear-gradient(135deg,#10B981,#22D3EE)', name: 'Bola Adamu', sub: '', meta: '#ORD-0040 · 4 items · 0703 998 1122', station: 'washing', paid: false, due: 'Tomorrow, 12 PM', dueCls: '', amount: '₦5,200' },
    { initials: 'CA', grad: 'linear-gradient(135deg,#A78BFA,#EC4899)', name: 'Chinedu Adeleke', sub: '· Silver tier', meta: '#ORD-0024 · 3 items · Dry clean', station: 'ready', paid: false, due: 'Ready since 8 AM', dueCls: 'text-emerald-400', amount: '₦12,500' },
    { initials: 'DA', grad: 'linear-gradient(135deg,#22D3EE,#6366F1)', name: 'Damilola Adeyemi', sub: '', meta: '#ORD-0048 · 1 item · Pickup-delivery', station: 'sorting', paid: true, due: 'Tomorrow, 4 PM', dueCls: '', amount: '₦4,000' },
  ]

  return (
    <div className="flex flex-col gap-2">
      {rows.map((r, i) => (
        <div key={i}
          className="grid items-center gap-3.5 py-3 px-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-3)] cursor-pointer transition-all"
          style={{ gridTemplateColumns: 'auto 1fr auto auto auto auto auto' }}>
          <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-white font-bold text-[13px] shrink-0"
               style={{ background: r.grad, boxShadow: '0 4px 12px -4px rgba(99,102,241,.4)' }}>
            {r.initials}
          </div>
          <div>
            <div className="font-semibold text-[13.5px]">
              {r.name}
              {r.sub && <span className="text-[var(--muted)] text-[12px] font-normal ml-1.5">{r.sub}</span>}
            </div>
            <div className="text-[11.5px] text-[var(--muted)] font-mono">{r.meta}</div>
          </div>
          <StationPill station={r.station} />
          <PaymentPill paid={r.paid} />
          <div className={`text-[11.5px] font-mono ${r.dueCls || 'text-[var(--text-2)]'}`}>{r.due}</div>
          <div className="font-mono text-[13px] font-black text-[var(--text-2)]">{r.amount}</div>
          <button className="inline-flex items-center gap-1 h-8 px-3 rounded-lg border border-[var(--border)] bg-transparent text-[var(--text)] text-[12px] font-semibold hover:border-[var(--border-strong)] transition-all">
            View →
          </button>
        </div>
      ))}
    </div>
  )
}
