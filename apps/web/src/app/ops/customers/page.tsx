'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { AppShell } from '@/components/app-shell'
import { Badge, ButtonLink, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui'
import { Search, User, Phone, Mail, Plus, ArrowRight, Loader2, Users } from 'lucide-react'

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
}

const AVATAR_COLORS = [
  'bg-violet-500/20 text-violet-300',
  'bg-blue-500/20 text-blue-300',
  'bg-emerald-500/20 text-emerald-300',
  'bg-amber-500/20 text-amber-300',
  'bg-rose-500/20 text-rose-300',
  'bg-cyan-500/20 text-cyan-300',
]

function avatarColor(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length
  return AVATAR_COLORS[idx]
}

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const customers = useQuery(api.customers.list, { search: search || undefined })

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Customers</h1>
            <p className="mt-1 text-sm text-white/40">
              {customers === undefined ? 'Loading…' : `${customers.length} customer${customers.length !== 1 ? 's' : ''} on record`}
            </p>
          </div>
          <ButtonLink href="/ops/intake" variant="primary" size="sm">
            <Plus className="h-4 w-4" />
            New Customer + Order
          </ButtonLink>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, or email…"
            className="w-full h-11 rounded-xl border border-white/[0.08] bg-white/[0.04] pl-10 pr-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>

        {/* Customer list */}
        <Card>
          <CardHeader>
            <CardTitle>All Customers</CardTitle>
            <CardDescription>Click a customer to view their profile and order history.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {customers === undefined ? (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-white/30">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading customers…
              </div>
            ) : customers.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-14">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                  <Users className="h-7 w-7 text-white/20" />
                </div>
                <p className="text-sm text-white/30">
                  {search ? `No customers matching "${search}"` : 'No customers yet. Create one during intake.'}
                </p>
                {!search && (
                  <ButtonLink href="/ops/intake" variant="primary" size="sm">
                    <Plus className="h-4 w-4" />
                    New Intake
                  </ButtonLink>
                )}
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {/* Table header */}
                <div className="hidden md:grid md:grid-cols-12 gap-3 px-4 py-2.5 text-xs font-medium text-white/25">
                  <div className="col-span-4">Customer</div>
                  <div className="col-span-3">Contact</div>
                  <div className="col-span-3">Joined</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {customers.map((c) => (
                  <Link
                    key={c._id}
                    href={`/ops/customers/${c._id}`}
                    className="flex md:grid md:grid-cols-12 gap-3 px-4 py-4 items-center hover:bg-white/[0.03] transition-all group"
                  >
                    {/* Avatar + name */}
                    <div className="col-span-4 flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(c.name)}`}>
                        {initials(c.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-white group-hover:text-primary transition-colors truncate">{c.name}</p>
                        {c.address && <p className="text-xs text-white/30 truncate">{c.address}</p>}
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="hidden md:flex col-span-3 flex-col gap-1">
                      {c.phone && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
                          <Phone className="h-3 w-3" />
                          {c.phone}
                        </span>
                      )}
                      {c.email && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-white/40 truncate">
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="truncate">{c.email}</span>
                        </span>
                      )}
                      {!c.phone && !c.email && <span className="text-xs text-white/20">—</span>}
                    </div>

                    {/* Joined */}
                    <div className="hidden md:flex col-span-3 items-center text-xs text-white/30">
                      {new Date(c.createdAt).toLocaleDateString('en-NG', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex col-span-2 justify-end">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-primary/60 group-hover:text-primary transition-colors">
                        View profile
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>

                    {/* Mobile arrow */}
                    <ArrowRight className="ml-auto h-4 w-4 text-white/20 shrink-0 md:hidden" />
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
