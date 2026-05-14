'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import type { Customer } from '@/lib/types'
import { AppShell } from '@/components/app-shell'
import { Spinner } from '@/components/ui'
import { Search, Download } from 'lucide-react'

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#FBBF24,#F59E0B)',
  'linear-gradient(135deg,#F59E0B,#EF4444)',
  'linear-gradient(135deg,#10B981,#22D3EE)',
  'linear-gradient(135deg,#A78BFA,#EC4899)',
  'linear-gradient(135deg,#22D3EE,#6366F1)',
  'linear-gradient(135deg,#EC4899,#F59E0B)',
  'linear-gradient(135deg,#6366F1,#22D3EE)',
]

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

function TierLabel({ tier }: { tier?: string }) {
  if (!tier) return null
  const colors: Record<string, string> = {
    Bronze: '#D97706', Silver: '#94A3B8', Gold: '#FBBF24', Platinum: '#A78BFA',
  }
  return <span style={{ color: colors[tier] ?? '#94A3B8' }}>{tier.toUpperCase()}</span>
}

type FilterTab = 'All' | 'Gold+' | 'Corporate' | 'Inactive'

export default function CustomersPage() {
  const [search, setSearch]       = useState('')
  const [tab, setTab]             = useState<FilterTab>('All')
  const customersRaw = useQuery(api.customers.list, { limit: 200, search: search || undefined })
  const customers    = customersRaw as Customer[] | undefined

  return (
    <AppShell>
      <div className="flex flex-col gap-5">

        {/* Page head */}
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-['Montserrat'] text-[30px] font-extrabold tracking-tight text-[var(--text)]">Customers</h1>
            <p className="text-[var(--muted)] text-[13.5px] mt-1">
              {customers === undefined
                ? 'Loading…'
                : `${customers.length} customers · ₦24.6M lifetime revenue · ${Math.round(customers.length * 0.37)} repeat customers`}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] border border-[var(--border)] bg-transparent text-[var(--text)] text-[13px] font-semibold hover:border-[var(--border-strong)] transition-all">
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
            <Link href="/ops/intake"
              className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-white text-[13px] font-semibold transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(135deg,#6366F1,#7C3AED)', boxShadow: '0 4px 14px -4px rgba(99,102,241,.5)' }}>
              + New Customer + Order
            </Link>
          </div>
        </div>

        {/* Card with search + table */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>

          {/* Search + filter row */}
          <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-[var(--border)] flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by phone, name, or email..."
                className="w-full h-9 rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-[13px] text-[var(--text)] placeholder:text-[var(--muted)] outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>
            {(['All', 'Gold+', 'Corporate', 'Inactive'] as FilterTab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${
                  tab === t
                    ? 'bg-[var(--primary)] text-white border-transparent'
                    : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-2)] hover:border-[var(--border-strong)]'
                }`}>
                {t}
              </button>
            ))}
          </div>

          {/* Column headers */}
          <div className="hidden sm:grid gap-3.5 px-4 py-2.5 text-[10.5px] uppercase tracking-widest text-[var(--muted)] font-semibold border-b border-[var(--border)]"
               style={{ gridTemplateColumns: 'auto 1.3fr 1fr 1fr 1fr auto' }}>
            <div style={{ width: 34 }} />
            <div>Customer</div>
            <div>Phone</div>
            <div>Last Order</div>
            <div>Lifetime</div>
            <div>Actions</div>
          </div>

          {/* Rows */}
          {customers === undefined ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-[var(--muted)]">
              <Spinner className="h-5 w-5" /> Loading customers…
            </div>
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <p className="text-sm font-semibold text-[var(--text)]">No customers yet</p>
              <Link href="/ops/intake" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                Create your first intake →
              </Link>
            </div>
          ) : (
            customers.map((c: Customer, idx: number) => {
              const grad = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]
              return (
                <Link key={c._id} href={`/ops/customers/${c._id}`}
                  className="grid gap-3.5 items-center px-4 py-3.5 border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)] group transition-all cursor-pointer"
                  style={{ gridTemplateColumns: 'auto 1.3fr 1fr 1fr 1fr auto' }}>
                  <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-white font-bold text-[13px] shrink-0"
                       style={{ background: grad, boxShadow: '0 4px 12px -4px rgba(99,102,241,.4)' }}>
                    {getInitials(c.name)}
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--text)] group-hover:text-indigo-300 transition-colors">{c.name}</div>
                    <div className="text-[11px] text-[var(--muted)] mt-0.5">{c.email ?? 'No email'}</div>
                  </div>
                  <div className="font-mono text-[12px] text-[var(--text-2)]">{c.phone ? `+234 ${c.phone.replace(/^0/, '')}` : '—'}</div>
                  <div className="text-[12px] text-[var(--text-2)]">
                    {c.updatedAt ? new Date(c.updatedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }) : '—'}
                  </div>
                  <div>
                    <div className="font-mono font-semibold text-[var(--text)]">—</div>
                    <div className="text-[10.5px] text-[var(--muted)] mt-0.5">
                      — orders · <TierLabel tier="Bronze" />
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.preventDefault(); window.location.href = '/ops/intake' }}
                    className="inline-flex items-center h-8 px-3 rounded-lg border border-[var(--border)] bg-transparent text-[var(--text)] text-[12px] font-semibold hover:border-[var(--border-strong)] transition-all whitespace-nowrap">
                    + Order
                  </button>
                </Link>
              )
            })
          )}
        </div>

      </div>
    </AppShell>
  )
}
