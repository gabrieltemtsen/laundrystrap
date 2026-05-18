'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import type { Price } from '@/lib/types'
import { AppShell } from '@/components/app-shell'
import { Spinner } from '@/components/ui'
import {
  X, Printer, ChevronRight, Camera, Plus,
} from 'lucide-react'

/* ─── types ──────────────────────────────────────────────────────── */
type IntakeItem = { tagId: string; name: string; service: string; qty: number; priceNgn: number; note: string }
type SelectedCustomer = { id: string; name: string; phone?: string; email?: string; address?: string; notes?: string; tier?: string; totalOrders?: number }
type OrderResult = { id: string; code: string }

/* ─── helpers ──────────────────────────────────────────────────────── */
function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

function autoTag(orderNum: number, itemIdx: number) {
  const today = new Date()
  const yy = String(today.getFullYear()).slice(2)
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  const ord = String(orderNum).padStart(4, '0')
  const itm = String(itemIdx).padStart(2, '0')
  return `ABJ-${yy}${mm}${dd}-${ord}-${itm}`
}

const ITEM_TYPES = [
  'Shirt', 'Trouser / Pants', 'Dress', 'Suit (2 piece)', 'Native Attire',
  'Bed Sheet', 'Duvet / Blanket', 'Jeans', 'Hoodie / Sweatshirt',
  'Socks (pair)', 'Underwear', 'Jacket / Coat',
]

const SERVICES = [
  'Wash & Fold', 'Wash & Iron', 'Dry Clean', 'Iron Only', 'Mixed',
]

const TIER_DISCOUNT: Record<string, number> = {
  Bronze: 0, Silver: 0.05, Gold: 0.10, Platinum: 0.15,
}

/* ─── print tags modal ──────────────────────────────────────────── */
function PrintTagsModal({ order, items, onClose }: {
  order: { code: string; customerName: string }
  items: IntakeItem[]
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Print Tags — {order.code}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{items.length} tag{items.length !== 1 ? 's' : ''} for {order.customerName}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 h-9 px-4 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
              <Printer className="h-4 w-4" /> Print
            </button>
            <button onClick={onClose} className="w-9 h-9 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.tagId} className="border-2 border-gray-800 rounded-xl p-3 flex flex-col justify-between bg-white" style={{ minHeight: 100 }}>
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

/* ─── checklist item ──────────────────────────────────────────────── */
function CheckItem({ done, required, title, sub, meta }: {
  done: boolean; required?: boolean; title: string; sub: string; meta: string
}) {
  return (
    <div className={`flex items-center gap-2.5 py-2.5 px-3 rounded-[10px] border text-[13px] transition-all ${
      done     ? 'border-emerald-500/30 bg-emerald-500/6'
      : required ? 'border-amber-500/30 bg-amber-500/5'
      : 'border-[var(--border)] bg-[var(--surface-2)]'
    }`}>
      <div className={`w-[18px] h-[18px] rounded-[5px] border-[1.5px] shrink-0 flex items-center justify-center ${
        done ? 'bg-emerald-500 border-emerald-500' : 'border-[var(--border-strong)]'
      }`}>
        {done && (
          <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polyline points="1.5 5 4 7.5 8.5 2" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[var(--text)] text-[13px]">{title}</div>
        <div className="text-[11px] text-[var(--muted)]">{sub}</div>
      </div>
      <div className={`text-[10.5px] font-bold shrink-0 ${required && !done ? 'text-[var(--warning)]' : 'text-[var(--muted)]'}`}>{meta}</div>
    </div>
  )
}

/* ─── main page ──────────────────────────────────────────────────── */
export default function IntakePage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const prefillId    = searchParams.get('customer') // e.g. /ops/intake?customer=<id>

  /* mutations */
  const createCustomer = useMutation(api.customers.create)
  const createOrder    = useMutation(api.orders.create)
  const addItem        = useMutation(api.items.addToOrder)

  /* prices */
  const pricesRaw = useQuery(api.prices.list, {})
  const prices    = pricesRaw as Price[] | undefined
  const priceMap  = new Map(prices?.map((p: Price) => [p.itemType, p.priceNgn]) ?? [])

  /* customer search */
  const [searchQ, setSearchQ]             = useState('')
  const [showResults, setShowResults]     = useState(false)
  const [selectedCust, setSelectedCust]   = useState<SelectedCustomer | null>(null)
  const searchRef                         = useRef<HTMLDivElement>(null)

  /* pre-fill customer from ?customer= URL param */
  const prefillRaw = useQuery(
    api.customers.getById,
    prefillId && !selectedCust ? { customerId: prefillId as any } : 'skip',
  )
  useEffect(() => {
    if (prefillRaw && !selectedCust) {
      const c = prefillRaw as any
      setSelectedCust({ id: c._id, name: c.name, phone: c.phone, email: c.email, address: c.address, notes: c.notes })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillRaw])
  const customersRaw = useQuery(
    api.customers.list,
    searchQ.length >= 2 ? { search: searchQ, limit: 8 } : 'skip',
  )
  const searchResults = (customersRaw as any[] | undefined) ?? []

  /* close dropdown on outside click */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowResults(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* order state */
  const [dueAt, setDueAt]         = useState('')
  const [turnaround, setTurnaround] = useState('Standard (24h) — Free')
  const [serviceType, setServiceType] = useState('Wash & Fold')
  const [dropoffSource, setDropoffSource] = useState('Walk-in')
  const [binLabel, setBinLabel]   = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')

  /* add-ons */
  const ADD_ONS = ['Starch — Light', 'Stain Treatment +₦500', 'Fragrance — Lavender', 'Hang Dry', 'Eco Wash']
  const [activeAddons, setActiveAddons] = useState<Set<string>>(new Set())
  function toggleAddon(a: string) {
    setActiveAddons((prev) => { const s = new Set(prev); s.has(a) ? s.delete(a) : s.add(a); return s })
  }

  /* photos (simulated) */
  const [photos, setPhotos] = useState<string[]>(['Stain · collar', 'Button missing', 'Bundle photo'])

  /* items */
  const [items, setItems]     = useState<IntakeItem[]>([])
  const ORDER_PREVIEW_NUM     = 50  // placeholder until order is created

  function addNewItem() {
    const idx = items.length + 1
    setItems((prev) => [...prev, {
      tagId:    autoTag(ORDER_PREVIEW_NUM, idx),
      name:     ITEM_TYPES[0],
      service:  'Wash & Iron',
      qty:      1,
      priceNgn: priceMap.get(ITEM_TYPES[0]) ?? 1200,
      note:     '',
    }])
  }

  function updateItem(idx: number, patch: Partial<IntakeItem>) {
    setItems((prev) => prev.map((it, i) => {
      if (i !== idx) return it
      const next = { ...it, ...patch }
      if (patch.name) next.priceNgn = priceMap.get(patch.name) ?? it.priceNgn
      return next
    }))
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  /* totals */
  const subtotal      = items.reduce((s, i) => s + i.priceNgn * i.qty, 0)
  const stainAddon    = activeAddons.has('Stain Treatment +₦500') ? 500 : 0
  const tier          = selectedCust?.tier ?? 'Bronze'
  const discountRate  = TIER_DISCOUNT[tier] ?? 0
  const discountAmt   = Math.round((subtotal + stainAddon) * discountRate)
  const total         = subtotal + stainAddon - discountAmt

  /* checklist */
  const checkCustomer = !!selectedCust
  const checkItems    = items.length > 0
  const checkPhotos   = photos.length >= 2
  const checkPayment  = false  // always require explicit action

  /* submit */
  const [creating, setCreating] = useState(false)
  const [result, setResult]     = useState<OrderResult | null>(null)
  const [error, setError]       = useState('')
  const [showPrint, setShowPrint] = useState(false)

  async function handleCreate() {
    if (!selectedCust && !searchQ.trim()) { setError('Please select or create a customer first.'); return }
    setCreating(true)
    setError('')
    try {
      let customerId: string
      if (selectedCust && selectedCust.id !== '__new__') {
        // Existing customer — use their Convex ID directly
        customerId = selectedCust.id
      } else {
        // New customer — create them first, then use the returned ID
        const name = selectedCust?.name ?? searchQ.trim()
        const res = await createCustomer({ name, phone: selectedCust?.phone || undefined })
        customerId = res.id
      }

      let dueAtMs: number | undefined
      if (dueAt) { const p = new Date(dueAt).getTime(); if (!isNaN(p)) dueAtMs = p }

      const noteParts = [
        serviceType,
        dropoffSource !== 'Walk-in' ? dropoffSource : '',
        binLabel ? `Bin: ${binLabel}` : '',
        [...activeAddons].join(', '),
        specialInstructions,
      ].filter(Boolean)

      const { id: orderId, code } = await createOrder({
        customerId: customerId as any,
        customerName: selectedCust?.name ?? searchQ.trim(),
        customerPhone: selectedCust?.phone,
        notes: noteParts.join(' | ') || undefined,
        dueAt: dueAtMs,
        totalPrice: total > 0 ? total : undefined,
      })

      for (const it of items) {
        await addItem({ orderId, tagId: it.tagId, name: it.name })
      }

      setResult({ id: orderId, code })
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong.')
    } finally {
      setCreating(false)
    }
  }

  /* ── success screen ─────────────────────────────────────────────── */
  if (result) {
    return (
      <AppShell>
        {showPrint && (
          <PrintTagsModal
            order={{ code: result.code, customerName: selectedCust?.name ?? searchQ }}
            items={items}
            onClose={() => setShowPrint(false)}
          />
        )}
        <div className="flex flex-col items-center justify-center gap-6 py-16 max-w-md mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-500/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <h2 className="font-['Montserrat'] text-2xl font-extrabold text-[var(--text)]">Order Created!</h2>
            <p className="mt-2 text-[var(--muted)] text-sm">Tags queued to label printer · WhatsApp confirmation sent to customer</p>
          </div>
          <div className="w-full rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] p-6">
            <p className="text-xs text-[var(--muted)] uppercase tracking-widest font-semibold mb-2">Reference Code</p>
            <p className="text-4xl font-black text-[var(--text)] tracking-wider font-mono">{result.code}</p>
            <p className="text-xs text-[var(--muted)] mt-3">Customer: {selectedCust?.name ?? searchQ}</p>
            {items.length > 0 && <p className="text-xs text-[var(--muted)]">{items.length} item{items.length !== 1 ? 's' : ''} tagged</p>}
            {total > 0 && <p className="text-sm font-bold mt-2" style={{ color: 'var(--naira)' }}>Total: ₦{total.toLocaleString()}</p>}
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {items.length > 0 && (
              <button onClick={() => setShowPrint(true)}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-[13px] font-semibold hover:border-[var(--border-strong)] transition-all">
                <Printer className="h-4 w-4" /> Print Tags
              </button>
            )}
            <button onClick={() => router.push('/ops/orders/' + result.id)}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-[10px] bg-gradient-to-br from-indigo-600 to-violet-700 text-white text-[13px] font-semibold shadow-[0_4px_14px_-4px_rgba(99,102,241,.5)] hover:brightness-110 transition-all">
              View Order <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </AppShell>
    )
  }

  /* ── intake form ─────────────────────────────────────────────────── */
  return (
    <AppShell>
      <div className="flex flex-col gap-5">

        {/* Page head */}
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-['Montserrat'] text-[30px] font-extrabold tracking-tight text-[var(--text)]">New Intake</h1>
            <p className="text-[var(--muted)] text-[13.5px] mt-1">Find or register customer → add items → tags print automatically</p>
          </div>
          <button onClick={() => router.push('/ops')}
            className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] border border-[var(--border)] bg-transparent text-[var(--text)] text-[13px] font-semibold hover:border-[var(--border-strong)] transition-all">
            Cancel
          </button>
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300 font-medium">{error}</div>
        )}

        {/* Two-column grid */}
        <div className="grid gap-[18px]" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'start' }}>

          {/* ═══════════════ LEFT COLUMN ═══════════════ */}
          <div className="flex flex-col gap-[18px]">

            {/* ── Customer Search ── */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] p-[18px]" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="flex items-center gap-2 font-bold text-[15px] text-[var(--text)] mb-1">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                Find or Register Customer
              </div>
              <div className="text-[12px] text-[var(--muted)] mb-3.5">Type a phone number — we'll match an existing customer or create a new one in one step.</div>

              {/* Search field + dropdown */}
              <div className="relative" ref={searchRef}>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10.5px] uppercase tracking-widest text-[var(--muted)] font-semibold">Phone, Name, or Email</label>
                  <input
                    className="h-11 w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface-2)] px-3 text-[14px] text-[var(--text)] placeholder:text-[var(--muted)] outline-none focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_var(--primary-glow)] transition-all"
                    placeholder="0801 234 5678 or Amara..."
                    value={searchQ}
                    onChange={(e) => { setSearchQ(e.target.value); setShowResults(true); if (selectedCust) setSelectedCust(null) }}
                    onFocus={() => setShowResults(true)}
                    autoComplete="off"
                  />
                </div>

                {/* Dropdown results */}
                {showResults && searchQ.length >= 2 && (
                  <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-[var(--surface-2)] border border-[var(--border-strong)] rounded-xl max-h-[260px] overflow-y-auto z-50 shadow-[0_12px_40px_-8px_rgba(0,0,0,.6)]">
                    {customersRaw === undefined ? (
                      <div className="flex items-center justify-center gap-2 py-4 text-sm text-[var(--muted)]">
                        <Spinner className="h-4 w-4" /> Searching…
                      </div>
                    ) : (
                      <>
                        {searchResults.map((c: any) => (
                          <div
                            key={c._id}
                            onClick={() => { setSelectedCust({ id: c._id, name: c.name, phone: c.phone, email: c.email, address: c.address, notes: c.notes, tier: 'Gold' }); setSearchQ(''); setShowResults(false) }}
                            className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-[var(--border)] last:border-0 cursor-pointer hover:bg-[var(--surface-3)] transition-all"
                          >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
                                 style={{ background: 'linear-gradient(135deg,#6366F1,#22D3EE)' }}>
                              {getInitials(c.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-[13.5px] text-[var(--text)]">{c.name}</div>
                              <div className="text-[11px] text-[var(--muted)]">{c.phone ?? c.email ?? 'No contact info'}</div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-[var(--muted)] shrink-0" />
                          </div>
                        ))}
                        {/* Create new option */}
                        <div
                          onClick={() => { setSelectedCust({ id: '__new__', name: searchQ.trim(), phone: '' }); setShowResults(false) }}
                          className="flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer bg-indigo-500/6 hover:bg-indigo-500/10 transition-all"
                        >
                          <div className="w-8 h-8 rounded-full bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0">
                            <Plus className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-[13.5px] text-indigo-300">Create new: "{searchQ}"</div>
                            <div className="text-[11px] text-[var(--muted)]">New customer profile</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Selected customer display */}
              {selectedCust && (
                <div className="mt-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl"
                       style={{ background: 'linear-gradient(135deg,rgba(99,102,241,.12),rgba(34,211,238,.04))', border: '1px solid rgba(99,102,241,.35)' }}>
                    <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-white font-bold text-[13px] shrink-0"
                         style={{ background: 'linear-gradient(135deg,#6366F1,#22D3EE)' }}>
                      {getInitials(selectedCust.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[14px] text-[var(--text)]">{selectedCust.name}</div>
                      <div className="text-[11.5px] text-[var(--text-2)] mt-0.5">
                        {[selectedCust.phone, selectedCust.address, selectedCust.totalOrders && `${selectedCust.totalOrders} orders`].filter(Boolean).join(' · ') || 'New customer'}
                      </div>
                    </div>
                    {selectedCust.tier && (
                      <span className="text-[10.5px] font-bold px-2 py-1 rounded-full shrink-0"
                            style={{ background: 'rgba(251,191,36,.15)', color: '#FCD34D' }}>
                        {selectedCust.tier.toUpperCase()}
                      </span>
                    )}
                    <button onClick={() => { setSelectedCust(null); setSearchQ('') }}
                      className="w-9 h-9 rounded-[10px] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-2)] hover:border-[var(--border-strong)] transition-all shrink-0">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {selectedCust.notes && (
                    <div className="mt-2 text-[11.5px] text-[var(--muted)] pl-1">
                      💡 Customer notes: <span className="text-[var(--text-2)]">{selectedCust.notes}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Order Details ── */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] p-[18px]" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="flex items-center gap-2 font-bold text-[15px] text-[var(--text)] mb-4">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                Order Details
              </div>

              {/* Row 2: due + turnaround */}
              <div className="grid grid-cols-2 gap-3 mb-3.5">
                <Field label="Due Date / Time">
                  <input type="datetime-local" value={dueAt} onChange={(e) => setDueAt(e.target.value)}
                    className="h-11 w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface-2)] px-3 text-[14px] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_var(--primary-glow)] transition-all" />
                </Field>
                <Field label="Turnaround">
                  <select value={turnaround} onChange={(e) => setTurnaround(e.target.value)}
                    className="h-11 w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface-2)] px-3 text-[14px] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_var(--primary-glow)] transition-all appearance-none cursor-pointer">
                    <option>Standard (24h) — Free</option>
                    <option>Express (12h) — +50%</option>
                    <option>Same Day (6h) — +100%</option>
                  </select>
                </Field>
              </div>

              {/* Row 3: service + source + bin */}
              <div className="grid grid-cols-3 gap-3 mb-3.5">
                <Field label="Service Type">
                  <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}
                    className="h-11 w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface-2)] px-3 text-[14px] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_var(--primary-glow)] transition-all appearance-none cursor-pointer">
                    {SERVICES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Drop-off Source">
                  <select value={dropoffSource} onChange={(e) => setDropoffSource(e.target.value)}
                    className="h-11 w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface-2)] px-3 text-[14px] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_var(--primary-glow)] transition-all appearance-none cursor-pointer">
                    <option>Walk-in</option>
                    <option>Pickup Driver</option>
                    <option>Corporate Bulk</option>
                    <option>Locker</option>
                  </select>
                </Field>
                <Field label="Bag / Bin Label">
                  <input value={binLabel} onChange={(e) => setBinLabel(e.target.value)} placeholder="BIN-12"
                    className="h-11 w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface-2)] px-3 text-[14px] text-[var(--text)] placeholder:text-[var(--muted)] outline-none focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_var(--primary-glow)] transition-all" />
                </Field>
              </div>

              {/* Special instructions */}
              <Field label="Special Instructions">
                <textarea value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Stain on collar, avoid bleach, fragrance-free..."
                  className="w-full min-h-[80px] rounded-[10px] border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-[14px] text-[var(--text)] placeholder:text-[var(--muted)] outline-none focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_var(--primary-glow)] transition-all resize-y font-['Inter']" />
              </Field>

              {/* Add-ons */}
              <div className="mt-3.5">
                <label className="block text-[10.5px] uppercase tracking-widest text-[var(--muted)] font-semibold mb-2">Add-ons</label>
                <div className="flex flex-wrap gap-2">
                  {ADD_ONS.map((a) => (
                    <button key={a} onClick={() => toggleAddon(a)}
                      className={`text-[10.5px] px-2 py-1 rounded-md font-semibold border cursor-pointer transition-all ${
                        activeAddons.has(a)
                          ? 'border-amber-500 bg-amber-500/12 text-amber-300'
                          : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-2)] hover:border-[var(--border-strong)]'
                      }`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Intake Photos ── */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] p-[18px]" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2 font-bold text-[15px] text-[var(--text)]">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                      <Camera className="h-3.5 w-3.5" />
                    </div>
                    Intake Photos
                  </div>
                  <div className="text-[12px] text-[var(--muted)] mt-0.5">Capture pre-existing damage — ends disputes before they start.</div>
                </div>
                <button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] border border-[var(--border)] bg-transparent text-[var(--text)] text-[13px] font-semibold hover:border-[var(--border-strong)] transition-all">
                  <Camera className="h-3.5 w-3.5" /> Open Camera
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2.5">
                {photos.map((p, i) => (
                  <div key={i} className="aspect-square rounded-[10px] flex items-center justify-center text-[11px] font-medium text-[var(--text-2)] relative"
                       style={{ background: 'linear-gradient(135deg,#2A3461,#1A2032)', border: '1px solid var(--border)' }}>
                    {p}
                    <span className="absolute top-1.5 right-1.5 w-[18px] h-[18px] bg-emerald-500 text-white rounded-full flex items-center justify-center text-[11px] font-bold">✓</span>
                  </div>
                ))}
                <button onClick={() => setPhotos((prev) => [...prev, 'Photo ' + (prev.length + 1)])}
                  className="aspect-square rounded-[10px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-2)] flex flex-col items-center justify-center gap-1 text-[var(--muted)] text-[11px] cursor-pointer hover:border-[var(--primary)] hover:text-[var(--primary-2)] transition-all">
                  <Plus className="h-4 w-4" />
                  Add photo
                </button>
              </div>
            </div>

            {/* ── Items & Tags ── */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] p-[18px]" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2 font-bold text-[15px] text-[var(--text)]">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                    </div>
                    Items &amp; Tags
                  </div>
                  <div className="text-[12px] text-[var(--muted)] mt-0.5">Tags are generated automatically — no typing. Format: BRANCH-DATE-ORDER-ITEM.</div>
                </div>
                {items.length > 0 && (
                  <button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] border border-[var(--border)] bg-transparent text-[var(--text)] text-[13px] font-semibold hover:border-[var(--border-strong)] transition-all">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                    Print all tags
                  </button>
                )}
              </div>

              {/* Item rows */}
              {items.length > 0 && (
                <div className="flex flex-col gap-2 mt-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="grid items-center gap-2 p-2.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-[10px]"
                         style={{ gridTemplateColumns: 'auto 1fr 1.2fr auto auto auto auto' }}>
                      <span className="font-mono text-[11px] font-semibold px-2 py-1 rounded-md text-white"
                            style={{ background: 'linear-gradient(135deg,#22D3EE,#6366F1)', boxShadow: '0 4px 10px -4px rgba(99,102,241,.4)' }}>
                        {item.tagId}
                      </span>
                      <select value={item.name} onChange={(e) => updateItem(idx, { name: e.target.value })}
                        className="h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-[13px] text-[var(--text)] outline-none focus:border-indigo-500/50 w-full">
                        {ITEM_TYPES.map((t) => <option key={t}>{t}</option>)}
                      </select>
                      <select value={item.service} onChange={(e) => updateItem(idx, { service: e.target.value })}
                        className="h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-[13px] text-[var(--text)] outline-none focus:border-indigo-500/50 w-full">
                        {SERVICES.map((s) => (
                          <option key={s}>{s}{priceMap.get(item.name) ? ` — ₦${priceMap.get(item.name)?.toLocaleString()}` : ''}</option>
                        ))}
                      </select>
                      <input type="number" value={item.qty} min={1} onChange={(e) => updateItem(idx, { qty: parseInt(e.target.value) || 1 })}
                        className="h-9 w-14 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-[13px] text-[var(--text)] outline-none focus:border-indigo-500/50" />
                      <button onClick={() => updateItem(idx, { note: item.note ? '' : 'Notes' })}
                        className={`text-[10.5px] px-2 py-1 rounded-md font-semibold border cursor-pointer transition-all ${item.note ? 'border-amber-500 bg-amber-500/12 text-amber-300' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-2)]'}`}>
                        Notes
                      </button>
                      <div className="font-mono text-[13px] font-semibold text-right" style={{ color: 'var(--naira)' }}>
                        ₦{(item.priceNgn * item.qty).toLocaleString()}
                      </div>
                      <button onClick={() => removeItem(idx)}
                        className="w-7 h-7 rounded-md border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-red-400 hover:border-red-400/30 transition-all">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add item bar */}
              <button onClick={addNewItem}
                className="mt-3 w-full flex items-center gap-2.5 py-2.5 px-3.5 rounded-[10px] text-indigo-300 font-semibold text-[13px] cursor-pointer transition-all hover:bg-indigo-500/10"
                style={{ background: 'rgba(99,102,241,.06)', border: '1px dashed rgba(99,102,241,.35)' }}>
                <Plus className="h-4 w-4" />
                Add another item · or scan barcode of item type
              </button>

              <div className="mt-3.5 pt-3.5 border-t border-[var(--border)] text-[11.5px] text-[var(--muted)]">
                <strong className="text-[var(--text-2)]">Per-kg option:</strong> Switch to weight-based pricing for bulk loads
                <span className="mx-1.5">·</span>
                <strong className="text-[var(--text-2)]">Bulk scan:</strong> Press scan trigger to capture multiple items in sequence
              </div>
            </div>

          </div>
          {/* ═══════════════ END LEFT COLUMN ═══════════════ */}

          {/* ═══════════════ RIGHT COLUMN ═══════════════ */}
          <div className="sticky top-0">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] p-[18px]" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="flex items-center gap-2 font-bold text-[15px] text-[var(--text)] mb-1">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                Intake Checklist
              </div>
              <div className="text-[12px] text-[var(--muted)] mb-3">All four must be complete to create the order.</div>

              <div className="flex flex-col gap-2">
                <CheckItem
                  done={checkCustomer}
                  title="Customer linked"
                  sub={checkCustomer ? `${selectedCust!.name}${selectedCust?.tier ? ` · ${selectedCust.tier} tier` : ''}` : 'Search or create above'}
                  meta={checkCustomer ? '✓' : ''}
                />
                <CheckItem
                  done={checkItems}
                  title="Items tagged"
                  sub={checkItems ? `${items.length} item${items.length !== 1 ? 's' : ''} · all tags auto-generated` : 'Add items below'}
                  meta={checkItems ? '✓' : ''}
                />
                <CheckItem
                  done={checkPhotos}
                  title="Photos captured"
                  sub={photos.length > 0 ? `${photos.length} condition photo${photos.length !== 1 ? 's' : ''} saved` : 'Capture damage photos'}
                  meta={checkPhotos ? '✓' : ''}
                />
                <CheckItem
                  done={checkPayment}
                  required={!checkPayment}
                  title="Payment captured"
                  sub={'Cash, transfer, or “pay at pickup”'}
                  meta={checkPayment ? '✓' : 'REQUIRED'}
                />
              </div>

              {/* Order summary */}
              <div className="mt-4 p-3 rounded-[10px] bg-[var(--surface-2)] space-y-0.5">
                <div className="flex justify-between py-1.5 text-[13px]">
                  <span className="text-[var(--muted)]">Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                  <span className="font-mono">₦{subtotal.toLocaleString()}</span>
                </div>
                {stainAddon > 0 && (
                  <div className="flex justify-between py-1.5 text-[13px]">
                    <span className="text-[var(--muted)]">Stain treatment</span>
                    <span className="font-mono">₦{stainAddon.toLocaleString()}</span>
                  </div>
                )}
                {discountAmt > 0 && (
                  <div className="flex justify-between py-1.5 text-[13px]">
                    <span className="text-[var(--muted)]">{tier} tier discount ({Math.round(discountRate * 100)}%)</span>
                    <span className="font-mono text-emerald-400">−₦{discountAmt.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2.5 mt-1.5 border-t border-[var(--border)] font-['Montserrat'] font-bold text-[16px]">
                  <span>Total</span>
                  <span className="font-mono" style={{ color: 'var(--naira)' }}>₦{total.toLocaleString()}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleCreate}
                disabled={creating}
                className="mt-3.5 w-full flex items-center justify-center gap-2 py-3 rounded-[10px] text-white text-[13px] font-semibold transition-all hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg,#6366F1,#7C3AED)', boxShadow: '0 4px 14px -4px rgba(99,102,241,.5)' }}>
                {creating ? <><Spinner className="h-4 w-4" /> Creating…</> : 'Create Order & Print Tags'}
              </button>
              <div className="text-[10.5px] text-[var(--muted)] text-center mt-2">
                Customer will receive WhatsApp confirmation with tracking link
              </div>
            </div>
          </div>
          {/* ═══════════════ END RIGHT COLUMN ═══════════════ */}

        </div>
      </div>
    </AppShell>
  )
}

/* ─── tiny helper component ─────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10.5px] uppercase tracking-widest text-[var(--muted)] font-semibold">{label}</label>
      {children}
    </div>
  )
}
