'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import type { Order, OrderItem, Transaction } from '@/lib/types'
import { AppShell } from '@/components/app-shell'
import {
  Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle,
  Input, Spinner, EmptyState,
} from '@/components/ui'
import {
  ArrowLeft, CheckCircle2, CircleDot, Clock, MapPin, Printer, Shirt, Plus, X,
  CreditCard, AlertCircle,
} from 'lucide-react'

const METHOD_EMOJI: Record<string, string> = {
  Cash: '💵', Transfer: '🏦', Paystack: '💳', POS: '🖥️', Invoice: '📄',
}

function TxStatusPill({ status }: { status: string }) {
  if (status === 'Paid')    return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-emerald-400 bg-emerald-400/10">PAID</span>
  if (status === 'Pending') return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-amber-400 bg-amber-400/10">PENDING</span>
  if (status === 'Overdue') return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-red-400 bg-red-400/10">OVERDUE</span>
  return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-[var(--muted)] bg-[var(--surface-3)]">WAIVED</span>
}

// ── Collect Payment Modal ───────────────────────────────────────────────────
function CollectPaymentModal({
  order,
  onClose,
}: {
  order: Order
  onClose: () => void
}) {
  const createTransaction = useMutation(api.transactions.create)
  const [amount, setAmount] = useState(order.totalPrice?.toString() ?? '')
  const [method, setMethod] = useState<'Cash' | 'Transfer' | 'Paystack' | 'POS' | 'Invoice'>('Cash')
  const [reference, setReference] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    const amt = parseFloat(amount)
    if (!amount || isNaN(amt) || amt <= 0) { setError('Enter a valid amount.'); return }
    setSaving(true)
    setError('')
    try {
      await createTransaction({
        orderId: order._id as any,
        customerId: order.customerId as any,
        customerName: order.customerName,
        orderCode: order.code,
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
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
          <div>
            <h2 className="font-bold text-[var(--text)] text-[17px]">Collect Payment</h2>
            <p className="text-[12.5px] text-[var(--muted)] mt-0.5">{order.code} · {order.customerName}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-all">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
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
              placeholder={method === 'Paystack' ? 'PAY-XXXXXXXX' : method === 'Transfer' ? 'NIP/XXXXXX' : 'Receipt or note'}
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
              <AlertCircle className="h-4 w-4 shrink-0" />{error}
            </div>
          )}
        </div>
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
            {saving ? 'Recording…' : 'Confirm Payment'}
          </button>
        </div>
      </div>
    </div>
  )
}

const ORDER_STATUSES = ['Awaiting Intake', 'In Wash', 'Ready for Pickup', 'Completed'] as const
type OrderStatus = typeof ORDER_STATUSES[number]

const ITEM_STATUSES = ['At intake', 'In wash', 'Drying', 'Folded', 'Bagged'] as const

function statusBadge(status: string) {
  if (status === 'Ready for Pickup') return <Badge variant="success" dot>Ready for Pickup</Badge>
  if (status === 'In Wash')          return <Badge variant="cyan" dot>In Wash</Badge>
  if (status === 'Completed')        return <Badge variant="default">Completed</Badge>
  return <Badge dot>Awaiting Intake</Badge>
}

function PrintTagsModal({
  order,
  items,
  onClose,
}: {
  order: { code: string; customerName: string }
  items: { tagId: string; name: string }[]
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 no-print">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Print Tags — {order.code}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{items.length} tag{items.length !== 1 ? 's' : ''} for {order.customerName}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 h-9 px-4 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Printer className="h-4 w-4" /> Print
            </button>
            <button onClick={onClose} className="w-9 h-9 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div id="tag-print-area" className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.tagId} className="border-2 border-gray-800 rounded-xl p-3 flex flex-col justify-between bg-white" style={{ minHeight: '100px' }}>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">LaundryStrap</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5 truncate">{item.name}</p>
                </div>
                <div>
                  <p className="text-xl font-black text-gray-900 font-mono tracking-tight leading-none">{item.tagId}</p>
                  <p className="text-[9px] text-gray-400 mt-1">{order.code} · {order.customerName}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-400 text-center">Cut along dotted lines and attach to each garment</p>
        </div>
      </div>
    </div>
  )
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const orderId = params.id as any

  const order = useQuery(api.orders.getById, { orderId }) as Order | null | undefined
  const items = useQuery(api.items.listByOrder, { orderId }) as OrderItem[] | undefined
  const updateStatus     = useMutation(api.orders.updateStatus)
  const addItem          = useMutation(api.items.addToOrder)
  const updateItemStatus = useMutation(api.items.updateItemStatus)

  const transactions = useQuery(api.transactions.listByOrder, { orderId }) as Transaction[] | undefined

  const [statusUpdating, setStatusUpdating] = useState(false)
  const [showPrint, setShowPrint]           = useState(false)
  const [showPayment, setShowPayment]       = useState(false)
  const [addingItem, setAddingItem]         = useState(false)
  const [newTag, setNewTag]                 = useState('')
  const [newItemName, setNewItemName]       = useState('')
  const [addError, setAddError]             = useState('')

  async function handleStatusChange(status: OrderStatus) {
    setStatusUpdating(true)
    try { await updateStatus({ orderId, status }) }
    finally { setStatusUpdating(false) }
  }

  async function handleAddItem() {
    if (!newTag.trim() || !newItemName.trim()) return
    setAddError('')
    try {
      await addItem({ orderId, tagId: newTag.trim().toUpperCase(), name: newItemName.trim() })
      setNewTag('')
      setNewItemName('')
      setAddingItem(false)
    } catch (e: any) {
      setAddError(e?.message ?? 'Failed to add item.')
    }
  }

  if (order === undefined || items === undefined) {
    return (
      <AppShell>
        <div className="flex items-center justify-center gap-2 py-24 text-sm text-[var(--muted)]">
          <Spinner className="h-5 w-5" /> Loading order…
        </div>
      </AppShell>
    )
  }

  if (order === null) {
    return (
      <AppShell>
        <div className="flex flex-col items-center gap-4 py-24">
          <p className="text-[var(--muted)]">Order not found.</p>
          <Link href="/ops" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
          </Link>
        </div>
      </AppShell>
    )
  }

  const currentStatusIdx = ORDER_STATUSES.indexOf(order.status as OrderStatus)

  return (
    <AppShell>
      {showPrint && (
        <PrintTagsModal
          order={{ code: order.code, customerName: order.customerName }}
          items={items}
          onClose={() => setShowPrint(false)}
        />
      )}
      {showPayment && (
        <CollectPaymentModal order={order} onClose={() => setShowPayment(false)} />
      )}

      <div className="flex flex-col gap-6">
        {/* Back */}
        <Link href="/ops" className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>

        {/* Order header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-black text-[var(--text)] font-mono">{order.code}</h1>
              {statusBadge(order.status)}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--muted)]">
              <span>Customer: <span className="text-[var(--text-2)]">{order.customerName}</span></span>
              {order.customerPhone && <span>{order.customerPhone}</span>}
              {order.dueAt && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Due {new Date(order.dueAt).toLocaleString('en-NG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              {order.expectedLocation && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {order.expectedLocation}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {items.length > 0 && (
              <Button variant="secondary" size="sm" onClick={() => setShowPrint(true)}>
                <Printer className="h-4 w-4" /> Print Tags
              </Button>
            )}
            <button
              onClick={() => setShowPayment(true)}
              className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-white text-[13px] font-semibold transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(135deg,#6366F1,#7C3AED)', boxShadow: '0 4px 14px -4px rgba(99,102,241,.5)' }}
            >
              <CreditCard className="h-4 w-4" />
              Collect Payment
            </button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          {/* Status timeline */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>Advance the order through the workflow.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {ORDER_STATUSES.map((status, i) => {
                const done    = i < currentStatusIdx
                const current = i === currentStatusIdx
                return (
                  <button
                    key={status}
                    disabled={statusUpdating || current}
                    onClick={() => handleStatusChange(status)}
                    className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                      current
                        ? 'border-indigo-500/40 bg-indigo-500/10 cursor-default'
                        : done
                        ? 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10'
                        : 'border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--surface-3)]'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      done ? 'bg-emerald-500/20 text-emerald-400' : current ? 'bg-indigo-500/20 text-indigo-400' : 'bg-[var(--surface-3)] text-[var(--muted)]'
                    }`}>
                      {done    ? <CheckCircle2 className="h-3.5 w-3.5" />
                       : current ? <CircleDot className="h-3.5 w-3.5" />
                       : <div className="w-2 h-2 rounded-full bg-current opacity-30" />}
                    </div>
                    <span className={`text-sm font-medium ${current ? 'text-indigo-300' : done ? 'text-emerald-300' : 'text-[var(--muted)]'}`}>
                      {status}
                    </span>
                    {statusUpdating && current && <Spinner className="ml-auto h-3.5 w-3.5" />}
                  </button>
                )
              })}
            </CardContent>
          </Card>

          {/* Items */}
          <Card className="lg:col-span-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Items ({items.length})</CardTitle>
                  <CardDescription>Each tag is a chain-of-custody record.</CardDescription>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setAddingItem(!addingItem)}>
                  <Plus className="h-4 w-4" /> Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {addingItem && (
                <div className="rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3 space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <Input label="Tag ID" value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="TAG-001" />
                    <div className="col-span-2">
                      <Input label="Item Name" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="e.g. White shirt" onKeyDown={(e) => e.key === 'Enter' && handleAddItem()} />
                    </div>
                  </div>
                  {addError && <p className="text-xs text-red-400 font-medium">{addError}</p>}
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" onClick={handleAddItem}>
                      <Plus className="h-3.5 w-3.5" /> Add
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { setAddingItem(false); setAddError('') }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {items.length === 0 ? (
                <EmptyState icon={Shirt} title="No items tagged yet" description="Add tags to track every garment." />
              ) : (
                <div className="rounded-xl overflow-hidden border border-[var(--border)]">
                  <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest bg-[var(--surface-2)] border-b border-[var(--border)]">
                    <div className="col-span-3">Tag</div>
                    <div className="col-span-4">Item</div>
                    <div className="col-span-3">Location</div>
                    <div className="col-span-2">Status</div>
                  </div>
                  {items.map((item: OrderItem) => (
                    <div key={item._id} className="grid grid-cols-12 gap-2 border-t border-[var(--border)]/60 px-3 py-3 items-center hover:bg-[var(--surface-2)] transition-all">
                      <div className="col-span-3 font-mono text-xs text-[var(--text-2)]">{item.tagId}</div>
                      <div className="col-span-4 text-sm text-[var(--text)] truncate">{item.name}</div>
                      <div className="col-span-3 text-xs text-[var(--muted)] truncate">{item.expectedLocation || '—'}</div>
                      <div className="col-span-2">
                        <select
                          value={item.status}
                          onChange={async (e) => {
                            await updateItemStatus({ itemId: item._id as any, status: e.target.value as any })
                          }}
                          className="h-7 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-3)] px-2 text-[11px] text-[var(--text-2)] outline-none focus:border-indigo-500/50 cursor-pointer"
                        >
                          {ITEM_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {order.notes && (
                <div className="rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3 mt-2">
                  <p className="text-xs text-[var(--muted)] font-bold uppercase tracking-widest mb-1">Notes</p>
                  <p className="text-sm text-[var(--text-2)] leading-relaxed">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>All transactions recorded for this order.</CardDescription>
              </div>
              <button
                onClick={() => setShowPayment(true)}
                className="inline-flex items-center gap-2 h-8 px-3.5 rounded-[10px] text-white text-[12px] font-semibold transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg,#6366F1,#7C3AED)' }}
              >
                <CreditCard className="h-3.5 w-3.5" />
                Collect Payment
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {transactions === undefined ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-[var(--muted)]">
                <Spinner className="h-4 w-4" /> Loading…
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <CreditCard className="h-8 w-8 text-[var(--muted)] opacity-40" />
                <p className="text-sm text-[var(--muted)]">No payments recorded yet.</p>
                {order.totalPrice && (
                  <p className="text-xs text-[var(--muted)]">
                    Order total: <span className="font-mono font-bold" style={{ color: 'var(--naira)' }}>₦{order.totalPrice.toLocaleString()}</span>
                  </p>
                )}
              </div>
            ) : (
              <div>
                {/* Summary bar */}
                <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between">
                  <span className="text-xs text-[var(--muted)] font-semibold uppercase tracking-widest">
                    {transactions.length} payment{transactions.length !== 1 ? 's' : ''}
                  </span>
                  <span className="text-sm font-mono font-black" style={{ color: 'var(--naira)' }}>
                    ₦{transactions.filter(t => t.status === 'Paid').reduce((s, t) => s + t.amountNgn, 0).toLocaleString()} collected
                  </span>
                </div>
                {transactions.map((tx: Transaction) => (
                  <div key={tx._id} className="flex items-center gap-4 px-5 py-3.5 border-b border-[var(--border)]/60 last:border-0 hover:bg-[var(--surface-2)] transition-all">
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface-3)] flex items-center justify-center text-lg shrink-0">
                      {METHOD_EMOJI[tx.method]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[var(--text)]">{tx.method}</span>
                        <TxStatusPill status={tx.status} />
                      </div>
                      <p className="text-xs text-[var(--muted)] mt-0.5">
                        {new Date(tx.createdAt).toLocaleString('en-NG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        {tx.reference && ` · Ref: ${tx.reference}`}
                        {tx.collectedBy && ` · By: ${tx.collectedBy}`}
                      </p>
                    </div>
                    <div className="font-mono font-black text-sm shrink-0" style={{ color: 'var(--naira)' }}>
                      ₦{tx.amountNgn.toLocaleString()}
                    </div>
                  </div>
                ))}
                {order.totalPrice && (
                  <div className="px-5 py-3 bg-[var(--surface-2)] border-t border-[var(--border)] flex items-center justify-between">
                    <span className="text-xs text-[var(--muted)]">
                      Order total: <span className="font-mono font-semibold text-[var(--text-2)]">₦{order.totalPrice.toLocaleString()}</span>
                    </span>
                    {(() => {
                      const paid = transactions.filter(t => t.status === 'Paid').reduce((s, t) => s + t.amountNgn, 0)
                      const balance = order.totalPrice - paid
                      return balance > 0 ? (
                        <span className="text-xs text-red-400 font-semibold">Balance due: ₦{balance.toLocaleString()}</span>
                      ) : (
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Fully paid
                        </span>
                      )
                    })()}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </AppShell>
  )
}
