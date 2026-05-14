'use client'

import { AppShell } from '@/components/app-shell'

const STAT_CARDS = [
  { label: 'Collected Today', value: '₦184k', delta: '▲ 22% vs daily avg', deltaUp: true, accent: '#10B981' },
  { label: 'Outstanding',     value: '₦47k',  delta: '7 orders awaiting',  deltaUp: false, accent: '#EF4444' },
  { label: 'Corporate Invoiced', value: '₦892k', delta: '3 due this week', deltaUp: false, accent: '#F59E0B' },
  { label: 'Cash Drawer',     value: '₦68k',  delta: 'Last counted 9 AM',  deltaUp: false, accent: '#A78BFA' },
]

const FILTER_CHIPS = ['All methods', 'Cash', 'Transfer', 'Paystack', 'Unpaid']

const TRANSACTIONS = [
  {
    icon: '₦', iconBg: 'rgba(16,185,129,.15)', iconColor: 'var(--success)',
    name: 'Amara Okafor', sub: '#ORD-0042 · 11:42 AM',
    method: '💵', methodLabel: 'Cash',
    statusLabel: 'PAID', statusCls: 'text-emerald-400 bg-emerald-400/10',
    amount: '₦8,400', action: 'Receipt', actionPrimary: false,
  },
  {
    icon: 'P', iconBg: 'rgba(56,189,248,.15)', iconColor: 'var(--info)',
    name: 'Funke Bello', sub: '#ORD-0039 · 10:18 AM',
    method: '🏦', methodLabel: 'Paystack',
    statusLabel: 'PAID', statusCls: 'text-emerald-400 bg-emerald-400/10',
    amount: '₦6,800', action: 'Receipt', actionPrimary: false,
  },
  {
    icon: '!', iconBg: 'rgba(239,68,68,.15)', iconColor: 'var(--danger)',
    name: 'Chinedu Adeleke', sub: '#ORD-0024 · Ready · pickup blocked',
    method: '—', methodLabel: 'Not paid',
    statusLabel: 'UNPAID', statusCls: 'text-red-400 bg-red-400/10',
    amount: '₦12,500', action: 'Collect', actionPrimary: true,
  },
  {
    icon: '⏳', iconBg: 'rgba(245,158,11,.15)', iconColor: 'var(--warning)',
    name: 'Transcorp Hilton', sub: 'INV-2026-0042 · Net-30',
    method: '📄', methodLabel: 'Invoice',
    statusLabel: 'DUE 14 JUN', statusCls: 'text-amber-400 bg-amber-400/10',
    amount: '₦36,000', action: 'View invoice', actionPrimary: false,
  },
  {
    icon: 'B', iconBg: 'rgba(167,139,250,.15)', iconColor: '#A78BFA',
    name: 'Damilola Adeyemi', sub: '#ORD-0048 · 09:02 AM',
    method: '🏦', methodLabel: 'Bank Transfer',
    statusLabel: 'PAID', statusCls: 'text-emerald-400 bg-emerald-400/10',
    amount: '₦4,000', action: 'Receipt', actionPrimary: false,
  },
]

export default function PaymentsPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-5">

        {/* Page head */}
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-['Montserrat'] text-[30px] font-extrabold tracking-tight text-[var(--text)]">Payments</h1>
            <p className="text-[var(--muted)] text-[13.5px] mt-1">Track every kobo · cash, transfer, Paystack &amp; Flutterwave reconciled in one place</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] border border-[var(--border)] bg-transparent text-[var(--text)] text-[13px] font-semibold hover:border-[var(--border-strong)] transition-all">
              Reconcile Paystack
            </button>
            <button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-white text-[13px] font-semibold transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(135deg,#6366F1,#7C3AED)', boxShadow: '0 4px 14px -4px rgba(99,102,241,.5)' }}>
              + Record Payment
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {STAT_CARDS.map((s) => (
            <div key={s.label} className="relative overflow-hidden bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 flex flex-col gap-1.5">
              <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(80% 50% at 100% 0%, ${s.accent} 0%, transparent 60%)`, opacity: 0.18 }} />
              <div className="text-[10.5px] uppercase tracking-widest text-[var(--muted)] font-semibold">{s.label}</div>
              <div className="font-['Montserrat'] text-[28px] font-extrabold tracking-tight" style={{ color: 'var(--naira)' }}>{s.value}</div>
              <div className={`text-[11.5px] flex items-center gap-1 ${s.deltaUp ? 'text-emerald-400' : 'text-[var(--text-2)]'}`}>{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Transactions card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 font-bold text-[15px] text-[var(--text)]">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              </div>
              Recent Transactions
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {FILTER_CHIPS.map((chip, i) => (
                <button key={chip}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${
                    i === 0
                      ? 'bg-[var(--primary)] text-white border-transparent'
                      : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-2)] hover:border-[var(--border-strong)]'
                  }`}>
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Header */}
          <div className="hidden sm:grid gap-3.5 px-5 py-2.5 text-[10.5px] uppercase tracking-widest text-[var(--muted)] font-semibold border-b border-[var(--border)]"
               style={{ gridTemplateColumns: 'auto 1.4fr 1fr 1fr auto auto' }}>
            <div style={{ width: 30 }} />
            <div>Order / Customer</div>
            <div>Method</div>
            <div>Status</div>
            <div>Amount</div>
            <div />
          </div>

          {/* Transaction rows */}
          {TRANSACTIONS.map((tx, i) => (
            <div key={i}
              className="grid gap-3.5 items-center px-5 py-3.5 border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)] transition-all"
              style={{ gridTemplateColumns: 'auto 1.4fr 1fr 1fr auto auto' }}>
              <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-[13px] font-bold shrink-0"
                   style={{ background: tx.iconBg, color: tx.iconColor }}>
                {tx.icon}
              </div>
              <div>
                <div className="font-semibold text-[13.5px] text-[var(--text)]">{tx.name}</div>
                <div className="text-[11.5px] text-[var(--muted)] mt-0.5">{tx.sub}</div>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-[var(--text-2)]">
                <span className="w-7 h-7 rounded-lg bg-[var(--surface-3)] flex items-center justify-center text-[15px]">{tx.method}</span>
                {tx.methodLabel}
              </div>
              <span className={`inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full w-fit ${tx.statusCls}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />{tx.statusLabel}
              </span>
              <div className="font-mono font-bold text-[var(--text)]">{tx.amount}</div>
              <button className={`inline-flex items-center h-8 px-3 rounded-lg border text-[12px] font-semibold transition-all ${
                tx.actionPrimary
                  ? 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-transparent hover:brightness-110'
                  : 'border-[var(--border)] bg-transparent text-[var(--text)] hover:border-[var(--border-strong)]'
              }`}>
                {tx.action}
              </button>
            </div>
          ))}
        </div>

      </div>
    </AppShell>
  )
}
