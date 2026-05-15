'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import type { Transaction, Order } from '@/lib/types'
import { AppShell } from '@/components/app-shell'
import { Badge, Button, Input, Spinner } from '@/components/ui'
import { X, CreditCard, ArrowDownLeft, CheckCircle2, Clock, AlertCircle, FileText } from 'lucide-react'

const METHOD_EMOJI: Record<string, string> = {
  Cash: '💵',
  Transfer: '🏦',
  Paystack: '💳',
  POS: '🖥️',
  Invoice: '📄',
}

const FILTER_CHIPS = ['All', 'Cash', 'Transfer', 'Paystack', 'POS', 'Invoice', 'Unpaid'] as const
type FilterChip = typeof FILTER_CHIPS[number]

function statusPill(status: string) {
  if (status === 'Paid')    return <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full text-emerald-400 bg-emerald-400/10"><span className="w-1.5 h-1.5 rounded-full bg-current" />PAID</span>
  if (status === 'Pending') return <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full text-amber-400 bg-amber-400/10"><span className="w-1.5 h-1.5 rounded-full bg-current" />PENDING</span>
  if (status === 'Overdue') return <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full text-red-400 bg-red-400/10"><span className="w-1.5 h-1.5 rounded-full bg-current" />OVERDUE</span>
  if (status === 'Waived')  return <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full text-[var(--muted)] bg-[var(--surface-3)]"><span className="w-1.5 h-1.5 rounded-full bg-current" />WAIVED</span>
  return null
}

function avatarBg(name: string) {
  const GRADS = [
    'linear-gradient(135deg,#6366F1,#7C3AED)',
    'linear-gradient(135deg,#38BDF8,#0EA5E9)',
    'linear-gradient(135deg,#10B981,#059669)',
    'linear-gradient(135deg,#F59E0B,#D97706)',
    'linear-gradient(135deg,#FB923C,#EA580C)',
    'linear-gradient(135deg,#A78BFA,#7C3AED)',
  ]
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff
  return GRADS[h % GRADS.length]
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]?.toUpperCase() ?? '').join('')
}

function formatDate(ms: number) {
  return new Date(ms).toLocaleString('en-NG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// ── Record Payment Modal ────────────────────────────────────────────────────
function RecordPaymentModal({
  onClose,
  prefillOrder,
}: {
  onClose: () => void
  prefillOrder?: Order | null
}) {
  const createTransaction = useMutation(api.transactions.create)

  const [orderSearch, setOrderSearch] = useState(prefillOrder ? prefillOrder.code : '')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(prefillOrder ?? null)
  const [amount, setAmount] = useState(prefillOrder?.totalPrice?.toString() ?? '')
  const [method, setMethod] = useState<'Cash' | 'Transfer' | 'Paystack' | 'POS' | 'Invoice'>('Cash')
  const [reference, setReference] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const searchResults = useQuery(
    api.orders.list,
    orderSearch.length >= 2 && !selectedOrder ? { search: orderSearch, limit: 8 } : 'skip',
  ) as Order[] | undefined

  async function handleSubmit() {
    if (!selectedOrder) { setError('Please select an order.'); return }
    const amt = parseFloat(amount)
    if (!amount || isNaN(amt) || amt <= 0) { setError('Enter a valid amount.'); return }
    setSaving(true)
    setError('')
    try {
      await createTransaction({
        orderId: selectedOrder._id as any,
        customerId: selectedOrder.customerId as any,
        customerName: selectedOrder.customerName,
        orderCode: selectedOrder.code,
        amountNgn: amt,
        method,
        status: 'Paid',
        reference: reference.trim() || undefined,
        notes: notes.trim() || undefined,
      })
      onClose()
    } catch (e: any) {
      setError(e?.message ?? 'Failed to record payment.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--border)] overflow-hidden"
           style={{ background: 'var(--surface)', boxShadow: '0 24px 48px -12px rgba(0,0,0,.7)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
          <div>
            <h2 className="font-bold text-[var(--text)] text-[17px]">Record Payment</h2>
            <p className="text-[12.5px] text-[var(--muted)] mt-0.5">Collect cash, transfer or log a Paystack reference</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-all">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">

          {/* Order search */}
          <div className="relative">
            <label className="block text-[11.5px] font-semibold text-[var(--muted)] uppercase tracking-widest mb-1.5">Order</label>
            {selectedOrder ? (
              <div className="flex items-center gap-3 p-3 rounded-xl border border-indigo-500/40 bg-indigo-500/10">
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-bold text-indigo-300 font-mono text-sm">{selectedOrder.code}</span>
                  <span className="text-xs text-[var(--muted)] truncate">{selectedOrder.customerName}
                    {selectedOrder.totalPrice ? ` · ₦${selectedOrder.totalPrice.toLocaleString()}` : ''}
                  </span>
                </div>
                <button onClick={() => { setSelectedOrder(null); setOrderSearch(''); setAmount('') }}
                  className="text-[var(--muted)] hover:text-red-400 transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <>
                <input
                  value={orderSearch}
                  onChange={(e) => { setOrderSearch(e.target.value); setShowDropdown(true) }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search by order code or customer…"
                  className="w-full h-10 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3.5 text-[13.5px] text-[var(--text)] placeholder:text-[var(--muted)] outline-none focus:border-indigo-500/60 transition-all"
                />
                {showDropdown && searchResults && searchResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xl">
                    {searchResults.map((o: Order) => (
                      <button
                        key={o._id}
                        onClick={() => {
                          setSelectedOrder(o)
                          setOrderSearch(o.code)
                          if (o.totalPrice) setAmount(o.totalPrice.toString())
                          setShowDropdown(false)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-2)] transition-all text-left border-b border-[var(--border)] last:border-0"
                      >
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-bold text-[var(--text)] font-mono text-sm">{o.code}</span>
                          <span className="text-xs text-[var(--muted)] truncate">{o.customerName} · {o.status}</span>
                        </div>
                        {o.totalPrice && (
                          <span className="text-sm font-mono font-bold shrink-0" style={{ color: 'var(--naira)' }}>
                            ₦{o.totalPrice.toLocaleString()}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
                {showDropdown && orderSearch.length >= 2 && searchResults === undefined && (
                  <div className="absolute z-10 mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-center text-sm text-[var(--muted)]">
                    <Spinner className="h-4 w-4 mx-auto" />
                  </div>
                )}
                {showDropdown && orderSearch.length >= 2 && searchResults?.length === 0 && (
                  <div className="absolute z-10 mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-center text-sm text-[var(--muted)]">
                    No orders found
                  </div>
                )}
              </>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-[11.5px] font-semibold text-[var(--muted)] uppercase tracking-widest mb-1.5">Amount (₦)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full h-10 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3.5 text-[13.5px] text-[var(--text)] placeholder:text-[var(--muted)] outline-none focus:border-indigo-500/60 transition-all font-mono"
            />
          </div>

          {/* Method */}
          <div>
            <label className="block text-[11.5px] font-semibold text-[var(--muted)] uppercase tracking-widest mb-1.5">Payment Method</label>
            <div className="grid grid-cols-5 gap-1.5">
              {(['Cash', 'Transfer', 'Paystack', 'POS', 'Invoice'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border text-xs font-semibold transition-all ${
                    method === m
                      ? 'border-indigo-500/60 bg-indigo-500/15 text-indigo-300'
                      : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  <span className="text-lg leading-none">{METHOD_EMOJI[m]}</span>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Reference */}
          <div>
            <label className="block text-[11.5px] font-semibold text-[var(--muted)] uppercase tracking-widest mb-1.5">
              Reference <span className="normal-case text-[10px] opacity-60">(optional)</span>
            </label>
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder={method === 'Paystack' ? 'e.g. PAY-XXXXXXXX' : method === 'Transfer' ? 'e.g. NIP/XXXXXX' : 'Receipt or note'}
              className="w-full h-10 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3.5 text-[13.5px] text-[var(--text)] placeholder:text-[var(--muted)] outline-none focus:border-indigo-500/60 transition-all"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11.5px] font-semibold text-[var(--muted)] uppercase tracking-widest mb-1.5">
              Notes <span className="normal-case text-[10px] opacity-60">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Any additional notes…"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3.5 py-2.5 text-[13.5px] text-[var(--text)] placeholder:text-[var(--muted)] outline-none focus:border-indigo-500/60 transition-all resize-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-[var(--border)] text-[var(--text)] text-sm font-semibold hover:border-[var(--border-strong)] transition-all">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 h-10 rounded-xl text-white text-sm font-bold transition-all hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,#6366F1,#7C3AED)', boxShadow: '0 4px 14px -4px rgba(99,102,241,.5)' }}
          >
            {saving ? <Spinner className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            {saving ? 'Recording…' : 'Record Payment'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function PaymentsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterChip>('All')
  const [showModal, setShowModal] = useState(false)

  const transactionsRaw = useQuery(api.transactions.list, { limit: 200 })
  const transactions = transactionsRaw as Transaction[] | undefined

  // Derived stats
  const todayStart = useMemo(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime()
  }, [])

  const collectedToday = useMemo(() =>
    transactions?.filter((t) => t.status === 'Paid' && t.createdAt >= todayStart)
      .reduce((s, t) => s + t.amountNgn, 0) ?? 0,
  [transactions, todayStart])

  const outstanding = useMemo(() =>
    transactions?.filter((t) => t.status === 'Pending' || t.status === 'Overdue')
      .reduce((s, t) => s + t.amountNgn, 0) ?? 0,
  [transactions])

  const outstandingCount = useMemo(() =>
    transactions?.filter((t) => t.status === 'Pending' || t.status === 'Overdue').length ?? 0,
  [transactions])

  const invoiced = useMemo(() =>
    transactions?.filter((t) => t.method === 'Invoice')
      .reduce((s, t) => s + t.amountNgn, 0) ?? 0,
  [transactions])

  const cashToday = useMemo(() =>
    transactions?.filter((t) => t.method === 'Cash' && t.status === 'Paid' && t.createdAt >= todayStart)
      .reduce((s, t) => s + t.amountNgn, 0) ?? 0,
  [transactions, todayStart])

  const STAT_CARDS = [
    { label: 'Collected Today',     value: `₦${(collectedToday / 1000).toFixed(0)}k`, delta: collectedToday > 0 ? `${transactions?.filter(t => t.status === 'Paid' && t.createdAt >= todayStart).length} payments today` : 'No payments yet today', deltaUp: collectedToday > 0, accent: '#10B981' },
    { label: 'Outstanding',         value: `₦${(outstanding / 1000).toFixed(0)}k`,     delta: `${outstandingCount} order${outstandingCount !== 1 ? 's' : ''} awaiting`,       deltaUp: false, accent: '#EF4444' },
    { label: 'Corporate Invoiced',  value: `₦${(invoiced / 1000).toFixed(0)}k`,         delta: 'Total invoiced',                                                               deltaUp: false, accent: '#F59E0B' },
    { label: 'Cash Drawer',         value: `₦${(cashToday / 1000).toFixed(0)}k`,        delta: 'Cash collected today',                                                         deltaUp: false, accent: '#A78BFA' },
  ]

  // Filtered transactions
  const filtered = useMemo(() => {
    if (!transactions) return []
    if (activeFilter === 'All') return transactions
    if (activeFilter === 'Unpaid') return transactions.filter((t) => t.status !== 'Paid' && t.status !== 'Waived')
    return transactions.filter((t) => t.method === activeFilter)
  }, [transactions, activeFilter])

  return (
    <AppShell>
      {showModal && <RecordPaymentModal onClose={() => setShowModal(false)} />}

      <div className="flex flex-col gap-5">

        {/* Page head */}
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-['Montserrat'] text-[30px] font-extrabold tracking-tight text-[var(--text)]">Payments</h1>
            <p className="text-[var(--muted)] text-[13.5px] mt-1">
              Track every kobo · cash, transfer, Paystack &amp; Flutterwave reconciled in one place
            </p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] border border-[var(--border)] bg-transparent text-[var(--text)] text-[13px] font-semibold hover:border-[var(--border-strong)] transition-all">
              Reconcile Paystack
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-white text-[13px] font-semibold transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(135deg,#6366F1,#7C3AED)', boxShadow: '0 4px 14px -4px rgba(99,102,241,.5)' }}
            >
              <CreditCard className="h-4 w-4" />
              Record Payment
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {STAT_CARDS.map((s) => (
            <div key={s.label} className="relative overflow-hidden bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 flex flex-col gap-1.5">
              <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(80% 50% at 100% 0%, ${s.accent} 0%, transparent 60%)`, opacity: 0.18 }} />
              <div className="text-[10.5px] uppercase tracking-widest text-[var(--muted)] font-semibold">{s.label}</div>
              <div className="font-['Montserrat'] text-[28px] font-extrabold tracking-tight" style={{ color: 'var(--naira)' }}>{s.value}</div>
              <div className={`text-[11.5px] flex items-center gap-1 ${s.deltaUp ? 'text-emerald-400' : 'text-[var(--text-2)]'}`}>{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Transactions card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 font-bold text-[15px] text-[var(--text)]">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              </div>
              Recent Transactions
              {transactions !== undefined && (
                <span className="ml-1 text-[11px] font-normal text-[var(--muted)]">({filtered.length})</span>
              )}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {FILTER_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => setActiveFilter(chip)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${
                    activeFilter === chip
                      ? 'bg-[var(--primary)] text-white border-transparent'
                      : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-2)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Column header */}
          <div
            className="hidden sm:grid gap-3.5 px-5 py-2.5 text-[10.5px] uppercase tracking-widest text-[var(--muted)] font-semibold border-b border-[var(--border)]"
            style={{ gridTemplateColumns: 'auto 1.4fr 1fr 1fr auto auto' }}
          >
            <div style={{ width: 30 }} />
            <div>Order / Customer</div>
            <div>Method</div>
            <div>Status</div>
            <div>Amount</div>
            <div />
          </div>

          {/* Loading */}
          {transactions === undefined && (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-[var(--muted)]">
              <Spinner className="h-5 w-5" /> Loading transactions…
            </div>
          )}

          {/* Empty */}
          {transactions !== undefined && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-[var(--muted)]" />
              </div>
              <p className="text-sm text-[var(--muted)]">No transactions yet.</p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 h-8 px-4 rounded-xl text-white text-xs font-semibold"
                style={{ background: 'linear-gradient(135deg,#6366F1,#7C3AED)' }}
              >
                Record first payment
              </button>
            </div>
          )}

          {/* Transaction rows */}
          {filtered.map((tx: Transaction) => {
            const isUnpaid = tx.status !== 'Paid' && tx.status !== 'Waived'
            return (
              <div
                key={tx._id}
                className="grid gap-3.5 items-center px-5 py-3.5 border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)] transition-all"
                style={{ gridTemplateColumns: 'auto 1.4fr 1fr 1fr auto auto' }}
              >
                {/* Avatar */}
                <div
                  className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-[12px] font-bold text-white shrink-0"
                  style={{ background: avatarBg(tx.customerName) }}
                >
                  {initials(tx.customerName)}
                </div>

                {/* Name / order */}
                <div>
                  <div className="font-semibold text-[13.5px] text-[var(--text)]">{tx.customerName}</div>
                  <div className="text-[11.5px] text-[var(--muted)] mt-0.5 font-mono">
                    {tx.orderCode} · {formatDate(tx.createdAt)}
                  </div>
                </div>

                {/* Method */}
                <div className="flex items-center gap-2 text-[13px] text-[var(--text-2)]">
                  <span className="w-7 h-7 rounded-lg bg-[var(--surface-3)] flex items-center justify-center text-[15px]">
                    {METHOD_EMOJI[tx.method]}
                  </span>
                  {tx.method}
                </div>

                {/* Status pill */}
                {statusPill(tx.status)}

                {/* Amount */}
                <div className="font-mono font-bold text-[var(--text)]">
                  ₦{tx.amountNgn.toLocaleString()}
                </div>

                {/* Action */}
                {isUnpaid ? (
                  <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center h-8 px-3 rounded-lg border text-[12px] font-semibold transition-all bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-transparent hover:brightness-110"
                  >
                    Collect
                  </button>
                ) : (
                  <button className="inline-flex items-center h-8 px-3 rounded-lg border border-[var(--border)] bg-transparent text-[var(--text)] text-[12px] font-semibold hover:border-[var(--border-strong)] transition-all">
                    Receipt
                  </button>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </AppShell>
  )
}
