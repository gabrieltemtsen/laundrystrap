'use client'

import Link from 'next/link'
import { use, useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import type { Customer, Order } from '@/lib/types'
import { AppShell } from '@/components/app-shell'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Textarea } from '@/components/ui'
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Edit2,
  Save,
  X,
  Package,
  CheckCircle2,
  Clock,
  Droplets,
  Loader2,
  Plus,
} from 'lucide-react'

function statusBadge(status: string) {
  if (status === 'Ready for Pickup') return <Badge variant="success">Ready</Badge>
  if (status === 'In Wash') return <Badge variant="warn">In Wash</Badge>
  if (status === 'Completed') return <Badge variant="default">Completed</Badge>
  return <Badge>Intake</Badge>
}

function statusIcon(status: string) {
  if (status === 'Ready for Pickup') return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
  if (status === 'In Wash') return <Droplets className="h-4 w-4 text-blue-400" />
  if (status === 'Completed') return <CheckCircle2 className="h-4 w-4 text-white/30" />
  return <Clock className="h-4 w-4 text-amber-400" />
}

function formatDate(ms: number) {
  return new Date(ms).toLocaleDateString('en-NG', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]?.toUpperCase() ?? '').join('')
}

export default function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const customerId = id as any

  const customerRaw = useQuery(api.customers.getById, { customerId })
  const ordersRaw = useQuery(api.customers.getOrdersByCustomer, { customerId })
  const customer = customerRaw as Customer | null | undefined
  const orders = ordersRaw as Order[] | undefined
  const updateCustomer = useMutation(api.customers.update)

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', notes: '' })

  function startEdit() {
    if (!customer) return
    setForm({
      name: customer.name ?? '',
      phone: customer.phone ?? '',
      email: customer.email ?? '',
      address: customer.address ?? '',
      notes: customer.notes ?? '',
    })
    setEditing(true)
  }

  async function saveEdit() {
    if (!customer) return
    setSaving(true)
    try {
      await updateCustomer({
        customerId,
        name: form.name || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
        address: form.address || undefined,
        notes: form.notes || undefined,
      })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  if (customer === undefined || orders === undefined) {
    return (
      <AppShell>
        <div className="flex items-center justify-center gap-2 py-24 text-sm text-white/30">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading profile…
        </div>
      </AppShell>
    )
  }

  if (customer === null) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <p className="text-sm text-white/40">Customer not found.</p>
          <Link href="/ops/customers" className="text-sm text-primary hover:underline flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to customers
          </Link>
        </div>
      </AppShell>
    )
  }

  const completedOrders = orders.filter((o: Order) => o.status === 'Completed').length
  const activeOrders = orders.filter((o: Order) => o.status !== 'Completed').length

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Back nav */}
        <Link
          href="/ops/customers"
          className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          All customers
        </Link>

        {/* Profile header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 ring-1 ring-primary/20 flex items-center justify-center text-xl font-bold text-primary">
              {initials(customer.name)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{customer.name}</h1>
              <p className="text-sm text-white/40 mt-0.5">
                Customer since {new Date(customer.createdAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!editing ? (
              <>
                <Button variant="secondary" size="sm" onClick={startEdit}>
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </Button>
                <Link
                  href={`/ops/intake?customer=${customerId}`}
                  className="inline-flex items-center gap-2 h-9 px-3 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  New Order
                </Link>
              </>
            ) : (
              <>
                <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={saveEdit} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          {/* Profile card */}
          <div className="lg:col-span-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Contact information and notes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {editing ? (
                  <div className="space-y-3">
                    <Input label="Full Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                    <Input label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                    <Input label="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                    <Input label="Address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
                    <Textarea
                      label="Notes"
                      value={form.notes}
                      onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                      placeholder="Detergent preference, special care…"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customer.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-white/30 shrink-0" />
                        <span className="text-sm text-white/80">{customer.phone}</span>
                      </div>
                    )}
                    {customer.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-white/30 shrink-0" />
                        <span className="text-sm text-white/80">{customer.email}</span>
                      </div>
                    )}
                    {customer.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-white/30 shrink-0 mt-0.5" />
                        <span className="text-sm text-white/80">{customer.address}</span>
                      </div>
                    )}
                    {!customer.phone && !customer.email && !customer.address && (
                      <p className="text-sm text-white/25 italic">No contact info on file.</p>
                    )}
                    {customer.notes && (
                      <div className="mt-3 pt-3 border-t border-white/[0.06]">
                        <p className="text-xs text-white/30 font-medium mb-1">Notes</p>
                        <p className="text-sm text-white/60 leading-relaxed">{customer.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardContent className="pt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/[0.04] p-3 text-center">
                  <p className="text-2xl font-bold text-white">{orders.length}</p>
                  <p className="text-xs text-white/30 mt-0.5">Total Orders</p>
                </div>
                <div className="rounded-xl bg-white/[0.04] p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-400">{completedOrders}</p>
                  <p className="text-xs text-white/30 mt-0.5">Completed</p>
                </div>
                <div className="rounded-xl bg-white/[0.04] p-3 text-center col-span-2">
                  <p className="text-2xl font-bold text-amber-400">{activeOrders}</p>
                  <p className="text-xs text-white/30 mt-0.5">Active Orders</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders list */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>All orders linked to this customer.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-12">
                    <Package className="h-8 w-8 text-white/15" />
                    <p className="text-sm text-white/30">No orders yet for this customer.</p>
                    <Link
                      href={`/ops/intake?customer=${customerId}`}
                      className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Create first order
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.04]">
                    {orders.map((order: Order) => (
                      <Link
                        key={order._id}
                        href={`/ops/orders/${order._id}`}
                        className="flex items-center gap-4 px-4 py-4 hover:bg-white/[0.03] transition-all group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                          {statusIcon(order.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-white group-hover:text-primary transition-colors">
                              {order.code}
                            </span>
                            {statusBadge(order.status)}
                          </div>
                          <p className="text-xs text-white/30 mt-0.5">{formatDate(order.createdAt)}</p>
                        </div>
                        {order.totalPrice !== undefined && (
                          <div className="text-sm font-semibold text-white/60 shrink-0">
                            ₦{order.totalPrice.toLocaleString()}
                          </div>
                        )}
                        {order.notes && (
                          <p className="hidden lg:block text-xs text-white/30 max-w-[180px] truncate">{order.notes}</p>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
