'use client'

import { AppShell } from '@/components/app-shell'

const BAR_DATA = [
  { day: 'Mon', orders: 38, revenue: 142 },
  { day: 'Tue', orders: 45, revenue: 168 },
  { day: 'Wed', orders: 41, revenue: 155 },
  { day: 'Thu', orders: 52, revenue: 184 },
  { day: 'Fri', orders: 60, revenue: 221 },
  { day: 'Sat', orders: 67, revenue: 248 },
  { day: 'Sun', orders: 29, revenue: 104 },
]
const maxRevenue = Math.max(...BAR_DATA.map(d => d.revenue))

const TABLE_DATA = [
  { day: 'Monday',    orders: 38, revenue: '₦142,000', avg: '₦3,737', topService: 'Wash & Iron' },
  { day: 'Tuesday',   orders: 45, revenue: '₦168,500', avg: '₦3,744', topService: 'Dry Clean'  },
  { day: 'Wednesday', orders: 41, revenue: '₦155,200', avg: '₦3,785', topService: 'Wash & Iron' },
  { day: 'Thursday',  orders: 52, revenue: '₦184,000', avg: '₦3,538', topService: 'Wash & Fold' },
  { day: 'Friday',    orders: 60, revenue: '₦221,400', avg: '₦3,690', topService: 'Mixed'       },
  { day: 'Saturday',  orders: 67, revenue: '₦248,300', avg: '₦3,706', topService: 'Dry Clean'  },
  { day: 'Sunday',    orders: 29, revenue: '₦104,100', avg: '₦3,590', topService: 'Wash & Iron' },
]

export default function ReportsPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-5">

        {/* Page head */}
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-['Montserrat'] text-[30px] font-extrabold tracking-tight text-[var(--text)]">Reports</h1>
            <p className="text-[var(--muted)] text-[13.5px] mt-1">Weekly snapshot · revenue, volume, and service breakdown</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] border border-[var(--border)] bg-transparent text-[var(--text)] text-[13px] font-semibold hover:border-[var(--border-strong)] transition-all">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export CSV
            </button>
            <button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] border border-[var(--border)] bg-transparent text-[var(--text)] text-[13px] font-semibold hover:border-[var(--border-strong)] transition-all">
              This Week ▾
            </button>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Orders',   value: '332',     delta: '▲ 12% vs last week', up: true,  accent: '#6366F1' },
            { label: 'Gross Revenue',  value: '₦1.22M',  delta: '▲ 18% vs last week', up: true,  accent: '#22D3EE' },
            { label: 'Avg Order Value',value: '₦3,681',  delta: '▲ 5% vs last week',  up: true,  accent: '#10B981' },
            { label: 'New Customers',  value: '24',      delta: '6 repeat this week',  up: false, accent: '#A78BFA' },
          ].map((s) => (
            <div key={s.label} className="relative overflow-hidden bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 flex flex-col gap-1.5">
              <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(80% 50% at 100% 0%, ${s.accent} 0%, transparent 60%)`, opacity: 0.18 }} />
              <div className="text-[10.5px] uppercase tracking-widest text-[var(--muted)] font-semibold">{s.label}</div>
              <div className="font-['Montserrat'] text-[28px] font-extrabold tracking-tight" style={{ color: s.accent === '#22D3EE' || s.accent === '#10B981' ? 'var(--naira)' : 'var(--text)' }}>{s.value}</div>
              <div className={`text-[11.5px] ${s.up ? 'text-emerald-400' : 'text-[var(--text-2)]'}`}>{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Bar chart card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] p-[18px]" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="flex items-center gap-2 font-bold text-[15px] text-[var(--text)] mb-4">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
            </div>
            Revenue This Week
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-2 h-[200px] px-2 pb-0">
            {BAR_DATA.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-md hover:brightness-125 transition-all cursor-pointer"
                     style={{
                       height: `${(d.revenue / maxRevenue) * 180}px`,
                       background: 'linear-gradient(180deg,#6366F1,rgba(99,102,241,.2))',
                     }}
                     title={`₦${d.revenue}k`}
                />
                <div className="text-[10px] text-[var(--muted)] font-mono">{d.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily breakdown table */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-2 font-bold text-[15px] text-[var(--text)]">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </div>
            Daily Breakdown
          </div>
          {/* Header */}
          <div className="grid gap-4 px-5 py-2.5 text-[10.5px] uppercase tracking-widest text-[var(--muted)] font-semibold border-b border-[var(--border)]"
               style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr' }}>
            <div>Day</div><div>Orders</div><div>Revenue</div><div>Avg Value</div><div>Top Service</div>
          </div>
          {TABLE_DATA.map((row, i) => (
            <div key={row.day}
              className={`grid gap-4 px-5 py-3.5 items-center text-[13px] hover:bg-[var(--surface-2)] transition-all ${i < TABLE_DATA.length - 1 ? 'border-b border-[var(--border)]/60' : ''}`}
              style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr' }}>
              <div className="font-semibold text-[var(--text)]">{row.day}</div>
              <div className="font-mono text-[var(--text-2)]">{row.orders}</div>
              <div className="font-mono font-bold" style={{ color: 'var(--naira)' }}>{row.revenue}</div>
              <div className="font-mono text-[var(--text-2)]">{row.avg}</div>
              <div className="text-[var(--muted)]">{row.topService}</div>
            </div>
          ))}
        </div>

      </div>
    </AppShell>
  )
}
