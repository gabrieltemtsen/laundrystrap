'use client'

import Link from 'next/link'
import { use, useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import type { Order, OrderItem } from '@/lib/types'
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
} from '@/components/ui'
import {
  ArrowLeft,
  CheckCircle2,
  CircleDot,
  Clock,
  MapPin,
  Printer,
  Shirt,
  Plus,
  X,
  Loader2,
} from 'lucide-react'

const ORDER_STATUSES = ['Awaiting Intake', 'In Wash', 'Ready for Pickup', 'Completed'] as const
type OrderStatus = typeof ORDER_STATUSES[number]

const ITEM_STATUSES = ['At intake', 'In wash', 'Drying', 'Folded', 'Bagged'] as const

function statusBadge(status: string) {
  if (status === 'Ready for Pickup') return <Badge variant="success">Ready for Pickup</Badge>
  if (status === 'In Wash') return <Badge variant="warn">In Wash</Badge>
  if (status === 'Completed') return <Badge variant="default">Completed</Badge>
  return <Badge>Awaiting Intake</Badge>
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
              className="inline-flex items-center gap-2 h-9 px-4 bg-[#0B7A75] text-white text-sm font-semibold rounded-lg hover:bg-[#096b66] transition-colors"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button onClick={onClose} className="w-9 h-9 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
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

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const orderId = id as any

  const order = useQuery(api.orders.getById, { orderId }) as Order | null | undefined
  const items = useQuery(api.items.listByOrder, { orderId }) as OrderItem[] | undefined
  const updateStatus = useMutation(api.orders.updateStatus)
  const addItem = useMutation(api.items.addToOrder)
  const updateItemStatus = useMutation(api.items.updateItemStatus)

  const [statusUpdating, setStatusUpdating] = useState(false)
  const [showPrint, setShowPrint] = useState(false)
  const [addingItem, setAddingItem] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [newItemName, setNewItemName] = useState('')
  const [addError, setAddError] = useState('')

  async function handleStatusChange(status: OrderStatus) {
    setStatusUpdating(true)
    try {
      await updateStatus({ orderId, status })
    } finally {
      setStatusUpdating(false)
    }
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
        <div className="flex items-center justify-center gap-2 py-24 text-sm text-white/30">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading order…
        </div>
      </AppShell>
    )
  }

  if (order === null) {
    return (
      <AppShell>
        <div className="flex flex-col items-center gap-4 py-24">
          <p className="text-white/40">Order not found.</p>
          <Link href="/ops" className="text-sm text-primary hover:underline flex items-center gap-1">
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

      <div className="flex flex-col gap-6">
        <div>
          <Link href="/ops" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white">{order.code}</h1>
              {statusBadge(order.status)}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/40">
              <span>Customer: <span className="text-white/70">{order.customerName}</span></span>
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
                <Printer className="h-4 w-4" />
                Print Tags
              </Button>
            )}
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
                const done = i < currentStatusIdx
                const current = i === currentStatusIdx
                const future = i > currentStatusIdx
                return (
                  <button
                    key={status}
                    disabled={statusUpdating || current}
                    onClick={() => handleStatusChange(status)}
                    className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                      current
                        ? 'border-primary/40 bg-primary/10 cursor-default'
                        : done
                        ? 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10'
                        : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      done ? 'bg-emerald-500/20 text-emerald-400' : current ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/20'
                    }`}>
                      {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : current ? <CircleDot className="h-3.5 w-3.5" /> : <div className="w-2 h-2 rounded-full bg-current opacity-30" />}
                    </div>
                    <span className={`text-sm font-medium ${current ? 'text-primary' : done ? 'text-emerald-300' : 'text-white/40'}`}>
                      {status}
                    </span>
                    {statusUpdating && current && <Loader2 className="ml-auto h-3.5 w-3.5 animate-spin text-white/30" />}
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
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {addingItem && (
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.08] p-3 space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      label="Tag ID"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="TAG-001"
                    />
                    <div className="col-span-2">
                      <Input
                        label="Item Name"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="e.g. White shirt"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                      />
                    </div>
                  </div>
                  {addError && <p className="text-xs text-red-400">{addError}</p>}
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
                <div className="flex flex-col items-center gap-2 py-10">
                  <Shirt className="h-8 w-8 text-white/15" />
                  <p className="text-sm text-white/30">No items tagged yet.</p>
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden border border-white/[0.06]">
                  <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-medium text-white/25 bg-white/[0.03]">
                    <div className="col-span-3">Tag</div>
                    <div className="col-span-4">Item</div>
                    <div className="col-span-3">Location</div>
                    <div className="col-span-2">Status</div>
                  </div>
                  {items.map((item: OrderItem) => (
                    <div key={item._id} className="grid grid-cols-12 gap-2 border-t border-white/[0.04] px-3 py-3 items-center">
                      <div className="col-span-3 font-mono text-xs text-white/60">{item.tagId}</div>
                      <div className="col-span-4 text-sm text-white/80 truncate">{item.name}</div>
                      <div className="col-span-3 text-xs text-white/40 truncate">{item.expectedLocation || '—'}</div>
                      <div className="col-span-2">
                        <select
                          value={item.status}
                          onChange={async (e) => {
                            await updateItemStatus({ itemId: item._id as any, status: e.target.value as any })
                          }}
                          className="h-7 w-full rounded-md border border-white/8 bg-white/5 px-2 text-[11px] text-white/70 outline-none focus:border-primary/50 cursor-pointer"
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
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 mt-2">
                  <p className="text-xs text-white/30 font-semibold uppercase tracking-wide mb-1">Notes</p>
                  <p className="text-sm text-white/60 leading-relaxed">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
