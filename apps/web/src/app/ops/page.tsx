'use client'

import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { AppShell } from '@/components/app-shell'
import { Badge, ButtonLink, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { ArrowRight, Clock, MapPin, QrCode, Sparkles, Users, TrendingUp, CheckCircle2, Loader2 } from 'lucide-react'

function statusBadge(status: string) {
  if (status === 'Ready for Pickup') return <Badge variant="success">Ready</Badge>
  if (status === 'In Wash') return <Badge variant="warn">In Wash</Badge>
  if (status === 'Completed') return <Badge variant="default">Done</Badge>
  return <Badge>Intake</Badge>
}

function formatDue(dueAt?: number) {
  if (!dueAt) return '—'
  const d = new Date(dueAt)
  const today = new Date()
  const isToday = d.toDateString() === today.toDateString()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const isTomorrow = d.toDateString() === tomorrow.toDateString()
  const time = d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
  if (isToday) return `Today ${time}`
  if (isTomorrow) return `Tomorrow ${time}`
  return d.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }) + ' ' + time
}

export default function DashboardPage() {
  const orders = useQuery(api.orders.list, { limit: 50 })
  const counts = useQuery(api.orders.counts, {})

  const activeOrders = orders?.filter((o) => o.status !== 'Completed') ?? []

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Today's Queue</h1>
            <p className="mt-1 text-sm text-white/40">
              Track every order — from intake to pickup.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ButtonLink href="/ops/scan" variant="secondary" size="sm">
              <QrCode className="h-4 w-4" />
              Scan Tag
            </ButtonLink>
            <ButtonLink href="/ops/intake" variant="primary" size="sm">
              <Sparkles className="h-4 w-4" />
              New Intake
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-white/40 font-medium uppercase tracking-wide">Awaiting Intake</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {counts === undefined ? <Loader2 className="h-6 w-6 animate-spin text-white/30" /> : counts.awaitingIntake}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-amber-400" />
                </div>
              </div>
              <p className="mt-2 text-xs text-white/30">Goal: clear before lunch</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-white/40 font-medium uppercase tracking-wide">In Progress</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {counts === undefined ? <Loader2 className="h-6 w-6 animate-spin text-white/30" /> : counts.inProgress}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                </div>
              </div>
              <p className="mt-2 text-xs text-white/30">Washing or drying</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-white/40 font-medium uppercase tracking-wide">Ready</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {counts === undefined ? <Loader2 className="h-6 w-6 animate-spin text-white/30" /> : counts.ready}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
              </div>
              <p className="mt-2 text-xs text-white/30">Awaiting pickup</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-white/40 font-medium uppercase tracking-wide">Total Orders</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {orders === undefined ? <Loader2 className="h-6 w-6 animate-spin text-white/30" /> : orders.length}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="mt-2 text-xs text-white/30">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Queue table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Queue</CardTitle>
                <CardDescription>Open an order to update status, add items, or print tags.</CardDescription>
              </div>
              <ButtonLink href="/ops/customers" variant="ghost" size="sm">
                <Users className="h-4 w-4" />
                All customers
              </ButtonLink>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {orders === undefined ? (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-white/30">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading orders…
              </div>
            ) : activeOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-14">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white/20" />
                </div>
                <p className="text-sm text-white/30">No active orders. Start a new intake!</p>
                <ButtonLink href="/ops/intake" variant="primary" size="sm">
                  <Sparkles className="h-4 w-4" />
                  New Intake
                </ButtonLink>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* Header row */}
                <div className="grid grid-cols-12 gap-2 border-b border-white/[0.06] px-4 py-2.5 text-xs font-medium text-white/30">
                  <div className="col-span-4">Order / Customer</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-3 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Due
                  </div>
                  <div className="col-span-3 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Location
                  </div>
                </div>

                {activeOrders.map((o) => (
                  <Link
                    key={o._id}
                    href={`/ops/orders/${o._id}`}
                    className="grid grid-cols-12 gap-2 border-b border-white/[0.04] px-4 py-3.5 text-sm transition-all hover:bg-white/[0.03] group last:border-0"
                  >
                    <div className="col-span-4">
                      <div className="font-semibold text-white group-hover:text-primary transition-colors">{o.code}</div>
                      <div className="text-xs text-white/40 mt-0.5">{o.customerName}</div>
                    </div>
                    <div className="col-span-2 flex items-center">{statusBadge(o.status)}</div>
                    <div className="col-span-3 text-white/60 text-xs flex items-center">{formatDue(o.dueAt)}</div>
                    <div className="col-span-3 text-white/50 text-xs flex items-center truncate">
                      {o.expectedLocation || '—'}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
