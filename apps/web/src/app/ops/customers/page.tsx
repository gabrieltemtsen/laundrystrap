'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import type { Customer } from '@/lib/types'
import { AppShell } from '@/components/app-shell'
import { ButtonLink, Card, CardContent, CardHeader, CardTitle, CardDescription, EmptyState, Spinner, PageHeader } from '@/components/ui'
import { Phone, Mail, Plus, ArrowRight, Users, Search } from 'lucide-react'

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]?.toUpperCase() ?? '').join('')
}

const AVATAR_COLORS = [
  'bg-violet-500/20 text-violet-300 border-violet-500/20',
  'bg-blue-500/20 text-blue-300 border-blue-500/20',
  'bg-emerald-500/20 text-emerald-300 border-emerald-500/20',
  'bg-amber-500/20 text-amber-300 border-amber-500/20',
  'bg-rose-500/20 text-rose-300 border-rose-500/20',
  'bg-cyan-500/20 text-cyan-300 border-cyan-500/20',
]

function avatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
}

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const customersRaw = useQuery(api.customers.list, { search: search || undefined })
  const customers    = customersRaw as Customer[] | undefined

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Customers"
          description={customers === undefined ? 'Loading…' : `${customers.length} customer${customers.length !== 1 ? 's' : ''} on record`}
          actions={
            <ButtonLink href="/ops/intake" variant="primary" size="sm">
              <Plus className="h-4 w-4" />
              New Customer + Order
            </ButtonLink>
          }
        />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, or email…"
            className="w-full h-11 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] pl-10 pr-4 text-sm text-[var(--text)] placeholder:text-[var(--muted)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Customers</CardTitle>
            <CardDescription>Click a customer to view their profile and order history.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {customers === undefined ? (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-[var(--muted)]">
                <Spinner className="h-5 w-5" /> Loading customers…
              </div>
            ) : customers.length === 0 ? (
              <EmptyState
                icon={Users}
                title={search ? `No customers matching "${search}"` : 'No customers yet.'}
                description={!search ? 'Create one during intake.' : undefined}
                action={!search ? (
                  <ButtonLink href="/ops/intake" variant="primary" size="sm">
                    <Plus className="h-4 w-4" />
                    New Intake
                  </ButtonLink>
                ) : undefined}
              />
            ) : (
              <div>
                {/* Table header */}
                <div className="hidden md:grid md:grid-cols-12 gap-3 px-5 py-2.5 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest border-b border-[var(--border)]">
                  <div className="col-span-4">Customer</div>
                  <div className="col-span-3">Contact</div>
                  <div className="col-span-3">Joined</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {customers.map((c: Customer) => (
                  <Link
                    key={c._id}
                    href={`/ops/customers/${c._id}`}
                    className="flex md:grid md:grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-[var(--surface-2)] transition-all group border-b border-[var(--border)]/60 last:border-0"
                  >
                    <div className="col-span-4 flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 border ${avatarColor(c.name)}`}>
                        {initials(c.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-[var(--text)] group-hover:text-indigo-400 transition-colors truncate">{c.name}</p>
                        {c.address && <p className="text-xs text-[var(--muted)] truncate">{c.address}</p>}
                      </div>
                    </div>

                    <div className="hidden md:flex col-span-3 flex-col gap-1">
                      {c.phone && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-2)]">
                          <Phone className="h-3 w-3" />{c.phone}
                        </span>
                      )}
                      {c.email && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] truncate">
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="truncate">{c.email}</span>
                        </span>
                      )}
                      {!c.phone && !c.email && <span className="text-xs text-[var(--muted)]">—</span>}
                    </div>

                    <div className="hidden md:flex col-span-3 items-center text-xs text-[var(--muted)]">
                      {new Date(c.createdAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>

                    <div className="hidden md:flex col-span-2 justify-end">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400/60 group-hover:text-indigo-400 transition-colors">
                        View profile <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>

                    <ArrowRight className="ml-auto h-4 w-4 text-[var(--muted)] shrink-0 md:hidden" />
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
