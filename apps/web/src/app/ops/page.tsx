'use client'

import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Order } from '@/lib/types'
import { AppShell } from '@/components/app-shell'
import { Badge, ButtonLink, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import {
  ArrowRight, Clock, MapPin, QrCode,
  Users, TrendingUp, CheckCircle2, Loader2, ClipboardList,
} from 'lucide-react'

function statusBadge(status: string) {
  if (status === 'Ready for Pickup') return <Badge variant="success">Ready</Badge>
  if (status === 'In Wash')          return <Badge variant="indigo">In Wash</Badge>
  if (status === 'Completed')        return <Badge variant="default">Done</Badge>
  return <Badge>Intake</Badge>
}

function formatDue(dueAt?: number) {
  if (!dueAt) return '—'
  const d        = new Date(dueAt)
  const today    = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const time = d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
  if (d.toDateString() === today.toDateString())    return `Today ${time}`
  if (d.toDateString() === tomorrow.toDateString()) return `Tomorrow ${time}`
  return d.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }) + ' ' + time
}

export default function DashboardPage() {
  const ordersRaw = useQuery(api.orders.list, { limit: 50 })
  const counts    = useQuery(api.orders.counts, {}) as
    | { awaitingIntake: number; inProgress: number; ready: number }
    | undefined

  const orders       = ordersRaw as Order[] | undefined
  const activeOrders = orders?.filter((o: Order) => o.status !== 'Completed') ?? []

  const stats = [
    {
      label: 'Awaiting Intake',
      value: counts?.awaitingIntake,
      icon: Clock,
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-400',
      accent: 'border-l-2 border-amber-500',
    },
    {
      label: 'In Progress',
      value: counts?.inProgress,
      icon: TrendingUp,
      iconBg: 'bg-indigo-500/10',
      iconColor: 'text-indigo-400',
      accent: 'border-l-2 border-indigo-500',
    },
    {
      label: 'Ready for Pickup',
      value: counts?.ready,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
      accent: 'border-l-2 border-emerald-500',
    },
    {
      label: 'Total Orders',
      value: orders?.length,
      icon: Users,
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
      accent: 'border-l-2 border-purple-500',
    },
  ]

  return (
    <AppShell>
      <div className="flex flex-col gap-6">

        {/* Page header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Today&apos;s Queue</h1>
            <p className="mt-1 text-sm text-zinc-500">Track every order — from intake to pickup.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ButtonLink href="/ops/scan" variant="secondary" size="sm">
              <QrCode className="h-4 w-4" />
              Scan Tag
            </ButtonLink>
            <ButtonLink href="/ops/intake" variant="primary" size="sm">
              <ClipboardList className="h-4 w-4" />
              New Intake
              <ArrowRight className="h-3.5 w-3.5" />
            </ButtonLink>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} className={`rounded-2xl bg-zinc-900 border border-zinc-800 p-5 ${s.accent}`}>
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide leading-tight">{s.label}</p>
                  <div className={`w-8 h-8 rounded-xl ${s.iconBg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-4 w-4 ${s.iconColor}`} />
                  </div>
                </div>
                <p className="text-3xl font-black text-white">
                  {s.value === undefined
                    ? <Loader2 className="h-6 w-6 animate-spin text-zinc-600 inline" />
                    : s.value}
                </p>
              </div>
            )
          })}
        </div>

        {/* Active queue */}
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
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-zinc-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading orders…
              </div>
            ) : activeOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <ClipboardList className="h-6 w-6 text-indigo-400" />
                </div>
                <p className="text-sm text-zinc-500">No active orders. Start a new intake!</p>
                <ButtonLink href="/ops/intake" variant="primary" size="sm">
                  <ClipboardList className="h-4 w-4" />
                  New Intake
                </ButtonLink>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* Table header */}
                <div className="grid grid-cols-12 gap-2 border-b border-zinc-800 px-5 py-2.5 text-xs font-semibold text-zinc-600 uppercase tracking-wide">
                  <div className="col-span-4">Order / Customer</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-3 flex items-center gap-1"><Clock className="h-3 w-3" /> Due</div>
                  <div className="col-span-3 flex items-center gap-1"><MapPin className="h-3 w-3" /> Location</div>
                </div>

                {activeOrders.map((o: Order) => (
                  <Link
                    key={o._id}
                    href={`/ops/orders/${o._id}`}
                    className="grid grid-cols-12 gap-2 border-b border-zinc-800/60 px-5 py-4 text-sm hover:bg-zinc-800/40 group transition-all last:border-0"
                  >
                    <div className="col-span-4">
                      <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">{o.code}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{o.customerName}</div>
                    </div>
                    <div className="col-span-2 flex items-center">{statusBadge(o.status)}</div>
                    <div className="col-span-3 text-zinc-500 text-xs flex items-center">{formatDue(o.dueAt)}</div>
                    <div className="col-span-3 text-zinc-600 text-xs flex items-center truncate">
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
