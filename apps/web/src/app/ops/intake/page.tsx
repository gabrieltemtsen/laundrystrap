'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import type { Price } from '@/lib/types'
import { AppShell } from '@/components/app-shell'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
  Spinner,
} from '@/components/ui'
import {
  CheckCircle2,
  Plus,
  Printer,
  ShieldCheck,
  User,
  X,
  Shirt,
} from 'lucide-react'

type OrderResult = { id: string; code: string; customerId?: string }

function PrintableTags({
  order,
  items,
  onClose,
}: {
  order: { code: string; customerName: string }
  items: { tagId: string; name: string }[]
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Print Tags — {order.code}</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {items.length} tag{items.length !== 1 ? 's' : ''} for {order.customerName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 h-9 px-4 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div id="tag-print-area" className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.tagId}
                className="border-2 border-gray-800 rounded-xl p-3 flex flex-col justify-between bg-white"
                style={{ minHeight: '100px' }}
              >
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

export default function IntakePage() {
  const router = useRouter()
  const createCustomer = useMutation(api.customers.create)
  const createOrder    = useMutation(api.orders.create)
  const addItem        = useMutation(api.items.addToOrder)
  const pricesRaw      = useQuery(api.prices.list, {})
  const prices         = pricesRaw as Price[] | undefined

  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', address: '', notes: '' })
  const [order, setOrder]       = useState({ dueAt: '', service: '', bin: '', source: 'Walk-in', notes: '' })
  const [items, setItems]       = useState<{ tagId: string; name: string; priceNgn: number }[]>([])
  const [newTag, setNewTag]           = useState('')
  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')

  const [creating, setCreating] = useState(false)
  const [result, setResult]     = useState<OrderResult | null>(null)
  const [errors, setErrors]     = useState<string[]>([])
  const [showPrint, setShowPrint] = useState(false)

  const priceMap  = new Map(prices?.map((p: Price) => [p.itemType, p.priceNgn]) ?? [])
  const totalPrice = items.reduce((sum, i) => sum + i.priceNgn, 0)

  function addItemRow() {
    if (!newTag.trim() || !newItemName.trim()) return
    const tagId = newTag.trim().toUpperCase()
    if (items.find((i) => i.tagId === tagId)) {
      setErrors(['Tag ID already added to this order.'])
      return
    }
    const p = priceMap.get(newItemName) ?? (parseFloat(newItemPrice) || 0)
    setItems((prev) => [...prev, { tagId, name: newItemName.trim(), priceNgn: p }])
    setNewTag('')
    setNewItemName('')
    setNewItemPrice('')
    setErrors([])
  }

  function removeItem(tagId: string) {
    setItems((prev) => prev.filter((i) => i.tagId !== tagId))
  }

  function updateItemPrice(tagId: string, price: string) {
    const p = parseFloat(price) || 0
    setItems((prev) => prev.map((i) => (i.tagId === tagId ? { ...i, priceNgn: p } : i)))
  }

  async function handleCreate() {
    const errs: string[] = []
    if (!customer.name.trim()) errs.push('Customer name is required.')
    if (errs.length) { setErrors(errs); return }

    setCreating(true)
    setErrors([])
    try {
      const { id: customerId } = await createCustomer({
        name: customer.name.trim(),
        phone: customer.phone.trim() || undefined,
        email: customer.email.trim() || undefined,
        address: customer.address.trim() || undefined,
        notes: customer.notes.trim() || undefined,
      })

      let dueAtMs: number | undefined
      if (order.dueAt) {
        const parsed = new Date(order.dueAt).getTime()
        if (!isNaN(parsed)) dueAtMs = parsed
      }

      const notesParts = [order.service, order.bin && `Bin: ${order.bin}`, order.source, order.notes].filter(Boolean)

      const { id: orderId, code } = await createOrder({
        customerId,
        customerName: customer.name.trim(),
        customerPhone: customer.phone.trim() || undefined,
        notes: notesParts.join(' | ') || undefined,
        dueAt: dueAtMs,
        totalPrice: totalPrice > 0 ? totalPrice : undefined,
      })

      for (const item of items) {
        await addItem({ orderId, tagId: item.tagId, name: item.name })
      }

      setResult({ id: orderId, code, customerId })
    } catch (e: any) {
      setErrors([e?.message ?? 'Something went wrong. Please try again.'])
    } finally {
      setCreating(false)
    }
  }

  /* ── Success screen ── */
  if (result) {
    return (
      <AppShell>
        {showPrint && (
          <PrintableTags
            order={{ code: result.code, customerName: customer.name }}
            items={items}
            onClose={() => setShowPrint(false)}
          />
        )}
        <div className="flex flex-col items-center justify-center gap-6 py-12 max-w-md mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[var(--text)]">Order Created!</h2>
            <p className="mt-2 text-[var(--muted)] text-sm">Share the code below with the customer to track their order.</p>
          </div>
          <div className="w-full rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] p-6">
            <p className="text-xs text-[var(--muted)] uppercase tracking-widest font-semibold mb-2">Reference Code</p>
            <p className="text-4xl font-black text-[var(--text)] tracking-wider font-mono">{result.code}</p>
            <p className="text-xs text-[var(--muted)] mt-3">Customer: {customer.name}</p>
            {items.length > 0 && <p className="text-xs text-[var(--muted)]">{items.length} item{items.length !== 1 ? 's' : ''} tagged</p>}
            {totalPrice > 0 && <p className="text-sm font-semibold text-emerald-400 mt-2">Total: ₦{totalPrice.toLocaleString()}</p>}
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {items.length > 0 && (
              <Button variant="secondary" onClick={() => setShowPrint(true)}>
                <Printer className="h-4 w-4" />
                Print Tags
              </Button>
            )}
            <Button variant="primary" onClick={() => router.push('/ops/orders/' + result.id)}>
              View Order
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setCustomer({ name: '', phone: '', email: '', address: '', notes: '' })
                setOrder({ dueAt: '', service: '', bin: '', source: 'Walk-in', notes: '' })
                setItems([])
                setResult(null)
              }}
            >
              New Intake
            </Button>
          </div>
        </div>
      </AppShell>
    )
  }

  /* ── Intake form ── */
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--text)]">New Intake</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Register customer, create order, tag items — in that order.</p>
        </div>

        {errors.length > 0 && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 space-y-1">
            {errors.map((e) => <p key={e} className="text-sm text-red-300 font-medium">{e}</p>)}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-12">
          {/* ── Left: forms ── */}
          <div className="lg:col-span-7 space-y-5">
            {/* Customer */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div>
                    <CardTitle>Customer Profile</CardTitle>
                    <CardDescription>Saved and linked to all future orders.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                <Input label="Full Name *" value={customer.name} onChange={(e) => setCustomer((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Amara Okafor" />
                <Input label="Phone" value={customer.phone} onChange={(e) => setCustomer((f) => ({ ...f, phone: e.target.value }))} placeholder="+234 801 234 5678" />
                <Input label="Email (optional)" value={customer.email} onChange={(e) => setCustomer((f) => ({ ...f, email: e.target.value }))} placeholder="amara@example.com" />
                <Input label="Address" value={customer.address} onChange={(e) => setCustomer((f) => ({ ...f, address: e.target.value }))} placeholder="12 Allen Ave, Ikeja" />
                <div className="md:col-span-2">
                  <Textarea label="Customer Notes" value={customer.notes} onChange={(e) => setCustomer((f) => ({ ...f, notes: e.target.value }))} placeholder="Detergent preference, fragrance-free, hang dry…" />
                </div>
              </CardContent>
            </Card>

            {/* Order details */}
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>Add service info and due date.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                <Input label="Due Date / Time" type="datetime-local" value={order.dueAt} onChange={(e) => setOrder((f) => ({ ...f, dueAt: e.target.value }))} />
                <Input label="Service Type" value={order.service} onChange={(e) => setOrder((f) => ({ ...f, service: e.target.value }))} placeholder="Wash & Fold, Dry Clean…" />
                <Input label="Bag / Bin Label" value={order.bin} onChange={(e) => setOrder((f) => ({ ...f, bin: e.target.value }))} placeholder="BIN-12" hint="Physical container reference." />
                <Input label="Drop-off Source" value={order.source} onChange={(e) => setOrder((f) => ({ ...f, source: e.target.value }))} placeholder="Walk-in" />
                <div className="md:col-span-2">
                  <Textarea label="Special Instructions" value={order.notes} onChange={(e) => setOrder((f) => ({ ...f, notes: e.target.value }))} placeholder="Stain on collar, iron only, avoid bleach…" />
                </div>
              </CardContent>
            </Card>

            {/* Items & Tags */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Items &amp; Tags</CardTitle>
                    <CardDescription>Tag every piece — one tag per item.</CardDescription>
                  </div>
                  {items.length > 0 && <Badge variant="success">{items.length} tagged</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add item row */}
                <div className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-3">
                    <Input
                      label="Tag ID"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addItemRow()}
                      placeholder="TAG-001"
                    />
                  </div>
                  <div className="col-span-5">
                    <label className="block text-xs font-semibold text-[var(--text-2)] uppercase tracking-wide mb-1.5">Item</label>
                    <select
                      value={newItemName}
                      onChange={(e) => {
                        setNewItemName(e.target.value)
                        const p = priceMap.get(e.target.value)
                        if (p !== undefined) setNewItemPrice(String(p))
                      }}
                      className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm text-[var(--text)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    >
                      <option value="">Select item…</option>
                      {prices?.map((p: Price) => (
                        <option key={p.itemType} value={p.itemType}>{p.itemType}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <div className="relative">
                      <span className="absolute left-3 top-[34px] text-sm text-[var(--muted)]">₦</span>
                      <Input label="Price" type="number" value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value)} placeholder="0" min="0" className="pl-7" />
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Button variant="primary" size="sm" onClick={addItemRow} className="w-full h-10">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Items table */}
                {items.length > 0 && (
                  <div className="rounded-xl overflow-hidden border border-[var(--border)]">
                    <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest bg-[var(--surface-2)] border-b border-[var(--border)]">
                      <div className="col-span-3">Tag</div>
                      <div className="col-span-5">Item</div>
                      <div className="col-span-3">Price</div>
                      <div className="col-span-1" />
                    </div>
                    {items.map((item) => (
                      <div key={item.tagId} className="grid grid-cols-12 gap-2 border-t border-[var(--border)]/60 px-3 py-2.5 items-center hover:bg-[var(--surface-2)] transition-all">
                        <div className="col-span-3 font-mono text-xs text-[var(--text-2)]">{item.tagId}</div>
                        <div className="col-span-5 text-sm text-[var(--text)] truncate">{item.name}</div>
                        <div className="col-span-3">
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]">₦</span>
                            <input
                              type="number"
                              value={item.priceNgn || ''}
                              onChange={(e) => updateItemPrice(item.tagId, e.target.value)}
                              className="h-7 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-3)] pl-6 pr-2 text-xs text-[var(--text)] outline-none focus:border-indigo-500/50"
                              min="0"
                            />
                          </div>
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <button onClick={() => removeItem(item.tagId)} className="w-6 h-6 rounded flex items-center justify-center text-[var(--muted)] hover:text-red-400 hover:bg-red-400/10 transition-all">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {totalPrice > 0 && (
                      <div className="border-t border-[var(--border)] px-3 py-2.5 flex justify-end bg-[var(--surface-2)]">
                        <span className="text-sm font-black text-emerald-400 font-mono">Total: ₦{totalPrice.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ── Right: checklist ── */}
          <div className="lg:col-span-5 space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Intake Checklist</CardTitle>
                <CardDescription>Complete before creating the order.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Customer name check */}
                <div className={`flex items-start gap-3 rounded-xl border p-3 transition-all ${customer.name ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-[var(--border)] bg-[var(--surface-2)]'}`}>
                  <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${customer.name ? 'border-emerald-400 bg-emerald-400/20' : 'border-[var(--muted)]'}`}>
                    {customer.name && <div className="w-2 h-2 rounded-full bg-emerald-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--text)]">Customer name</p>
                    <p className="text-xs text-[var(--muted)]">Required to save profile.</p>
                  </div>
                  {customer.name && <Badge variant="success">Done</Badge>}
                </div>

                {/* Items check */}
                <div className={`flex items-start gap-3 rounded-xl border p-3 transition-all ${items.length > 0 ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-amber-500/20 bg-amber-500/5'}`}>
                  <ShieldCheck className={`mt-0.5 h-4 w-4 shrink-0 ${items.length > 0 ? 'text-emerald-400' : 'text-amber-400'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--text)]">Tag every item</p>
                    <p className="text-xs text-[var(--muted)]">No tag = no chain of custody.</p>
                  </div>
                  {items.length > 0 ? <Badge variant="success">{items.length}</Badge> : <Badge variant="warn">Required</Badge>}
                </div>

                {/* Pro tip */}
                <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-2)] p-3.5">
                  <p className="text-xs font-bold text-indigo-400 mb-1">Pro tip</p>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    If you&apos;re slammed — fill the name and hit Create. You can add tags from the order page later.
                  </p>
                </div>

                {/* Summary */}
                {(customer.name || items.length > 0) && (
                  <div className="rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3.5 space-y-1.5">
                    <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest">Summary</p>
                    {customer.name && <p className="text-sm text-[var(--text)]"><span className="text-[var(--muted)]">Customer:</span> {customer.name}</p>}
                    {customer.phone && <p className="text-sm text-[var(--text)]"><span className="text-[var(--muted)]">Phone:</span> {customer.phone}</p>}
                    <p className="text-sm text-[var(--text)]"><span className="text-[var(--muted)]">Items:</span> {items.length} tagged</p>
                    {totalPrice > 0 && <p className="text-sm font-bold text-emerald-400 font-mono">Total: ₦{totalPrice.toLocaleString()}</p>}
                  </div>
                )}

                <Button
                  variant="primary"
                  className="w-full h-12 text-base font-bold"
                  onClick={handleCreate}
                  disabled={creating || !customer.name.trim()}
                >
                  {creating ? (
                    <><Spinner className="h-5 w-5" /> Creating…</>
                  ) : (
                    <><Shirt className="h-5 w-5" /> Create Order</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
