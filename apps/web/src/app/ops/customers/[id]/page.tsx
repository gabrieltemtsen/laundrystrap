'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import type { Customer, Order } from '@/lib/types'
import { AppShell } from '@/components/app-shell'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Textarea, Spinner, EmptyState, ButtonLink } from '@/components/ui'
import {
  ArrowLeft, Phone, Mail, MapPin,
  Edit2, Save, X, Package, CheckCircle2, Clock, Droplets, Plus,
} from 'lucide-react'

function statusBadge(status: string) {
  if (status === 'Ready for Pickup') return <Badge variant="success" dot>Ready</Badge>
  if (status === 'In Wash')          return <Badge variant="cyan" dot>In Wash</Badge>
  if (status === 'Completed')        return <Badge variant="default">Completed</Badge>
  return <Badge dot>Intake</Badge>
}

function statusIcon(status: string) {
  if (status === 'Ready for Pickup') return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
  if (status === 'In Wash')          return <Droplets className="h-4 w-4 text-cyan-400" />
  if (status === 'Completed')        return <CheckCircle2 className="h-4 w-4 text-[var(--muted)]" />
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

export default function CustomerProfilePage({ params }: { params: { id: string } }) {
  const customerId = params.id as any

  const customerRaw = useQuery(api.customers.getById, { customerId })
  const ordersRaw   = useQuery(api.customers.getOrdersByCustomer, { customerId })
  const customer    = customerRaw as Customer | null | undefined
  const orders      = ordersRaw as Order[] | undefined
  const updateCustomer = useMutation(api.customers.update)

  const [editing, setEditing] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [form, setForm]       = useState({ name: '', phone: '', email: '', address: '', notes: '' })

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
        <div className="flex items-center justify-center gap-2 py-24 text-sm text-[var(--muted)]">
          <Spinner className="h-5 w-5" /> Loading profile…
        </div>
      </AppShell>
    )
  }

  if (customer === null) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <p className="text-sm text-[var(--muted)]">Customer not found.</p>
          <Link href="/ops/customers" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to customers
          </Link>
        </div>
      </AppShell>
    )
  }

  const completedOrders = orders.filter((o: Order) => o.status === 'Completed').length
  const activeOrders    = orders.filter((o: Order) => o.status !== 'Completed').length

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Back nav */}
        <Link
          href="/ops/customers"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          All Customers
        </Link>

        {/* Profile header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-xl font-black text-indigo-400">
              {initials(customer.name)}
            </div>
            <div>
              <h1 className="text-2xl font-black text-[var(--text)]">{customer.name}</h1>
              <p className="text-sm text-[var(--muted)] mt-0.5">
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
                <ButtonLink href={`/ops/intake?customer=${customerId}`} variant="primary" size="sm">
                  <Plus className="h-4 w-4" />
                  New Order
                </ButtonLink>
              </>
            ) : (
              <>
                <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>
                  <X className="h-4 w-4" /> Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={saveEdit} disabled={saving}>
                  {saving ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />}
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
                    <Textarea label="Notes" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Detergent preference, special care…" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customer.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-[var(--muted)] shrink-0" />
                        <span className="text-sm text-[var(--text-2)]">{customer.phone}</span>
                      </div>
                    )}
                    {customer.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-[var(--muted)] shrink-0" />
                        <span className="text-sm text-[var(--text-2)]">{customer.email}</span>
                      </div>
                    )}
                    {customer.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-[var(--muted)] shrink-0 mt-0.5" />
                        <span className="text-sm text-[var(--text-2)]">{customer.address}</span>
                      </div>
                    )}
                    {!customer.phone && !customer.email && !customer.address && (
                      <p className="text-sm text-[var(--muted)] italic">No contact info on file.</p>
                    )}
                    {customer.notes && (
                      <div className="mt-3 pt-3 border-t border-[var(--border)]">
                        <p className="text-xs text-[var(--muted)] font-semibold uppercase tracking-wide mb-1">Notes</p>
                        <p className="text-sm text-[var(--text-2)] leading-relaxed">{customer.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardContent className="pt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3 text-center">
                  <p className="text-2xl font-black text-[var(--text)]">{orders.length}</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">Total Orders</p>
                </div>
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-center">
                  <p className="text-2xl font-black text-emerald-400">{completedOrders}</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">Completed</p>
                </div>
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-center col-span-2">
                  <p className="text-2xl font-black text-amber-400">{activeOrders}</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">Active Orders</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders list */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>All orders linked to this customer.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {orders.length === 0 ? (
                  <EmptyState
                    icon={Package}
                    title="No orders yet"
                    description="Create the first order for this customer."
                    action={
                      <ButtonLink href={`/ops/intake?customer=${customerId}`} variant="primary" size="sm">
                        <Plus className="h-4 w-4" /> Create first order
                      </ButtonLink>
                    }
                  />
                ) : (
                  <div>
                    {orders.map((order: Order) => (
                      <Link
                        key={order._id}
                        href={`/ops/orders/${order._id}`}
                        className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--surface-2)] transition-all group border-b border-[var(--border)]/60 last:border-0"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center shrink-0">
                          {statusIcon(order.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-[var(--text)] group-hover:text-indigo-400 transition-colors font-mono">
                              {order.code}
                            </span>
                            {statusBadge(order.status)}
                          </div>
                          <p className="text-xs text-[var(--muted)] mt-0.5">{formatDate(order.createdAt)}</p>
                        </div>
                        {order.totalPrice !== undefined && (
                          <div className="text-sm font-black shrink-0 font-mono" style={{ color: 'var(--naira)' }}>
                            ₦{order.totalPrice.toLocaleString()}
                          </div>
                        )}
                        {order.notes && (
                          <p className="hidden lg:block text-xs text-[var(--muted)] max-w-[180px] truncate">{order.notes}</p>
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
