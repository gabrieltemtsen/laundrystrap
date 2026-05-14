'use client'

import { AppShell } from '@/components/app-shell'

const DELIVERIES = [
  {
    id: '#DLV-084', customer: 'Damilola Adeyemi', phone: '0813 442 9988',
    items: 1, order: '#ORD-0048', rider: 'Musa Ibrahim', eta: 'ETA 4:15 PM',
    status: 'En Route', statusCls: 'text-sky-400 bg-sky-400/10',
    address: 'Plot 14, Aminu Kano Crescent, Wuse II',
    amount: '₦4,000', paid: true,
  },
  {
    id: '#DLV-083', customer: 'Funke Bello', phone: '0706 112 3344',
    items: 3, order: '#ORD-0039', rider: 'Chukwu Emeka', eta: 'ETA 5:30 PM',
    status: 'Picked up', statusCls: 'text-emerald-400 bg-emerald-400/10',
    address: '22 Gana St, Maitama',
    amount: '₦6,800', paid: true,
  },
  {
    id: '#DLV-082', customer: 'Transcorp Hilton', phone: '+234 9 461 3000',
    items: 24, order: '#ORD-0041', rider: 'Pending assignment', eta: 'Scheduled 6:00 PM',
    status: 'Pending', statusCls: 'text-amber-400 bg-amber-400/10',
    address: '1 Aguiyi Ironsi St, Maitama',
    amount: '₦36,000', paid: false,
  },
]

export default function DeliveryPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-5">

        {/* Page head */}
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-['Montserrat'] text-[30px] font-extrabold tracking-tight text-[var(--text)]">Pickup &amp; Delivery</h1>
            <p className="text-[var(--muted)] text-[13.5px] mt-1">Track riders, schedule pickups, confirm deliveries with OTP</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] border border-[var(--border)] bg-transparent text-[var(--text)] text-[13px] font-semibold hover:border-[var(--border-strong)] transition-all">
              + Schedule Pickup
            </button>
            <button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-white text-[13px] font-semibold transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(135deg,#6366F1,#7C3AED)', boxShadow: '0 4px 14px -4px rgba(99,102,241,.5)' }}>
              + New Delivery Run
            </button>
          </div>
        </div>

        {/* Summary stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Active Runs',    value: '3',   accent: '#6366F1' },
            { label: 'Delivered Today',value: '11',  accent: '#10B981' },
            { label: 'Pending Pickup', value: '6',   accent: '#F59E0B' },
            { label: 'Riders Online',  value: '2',   accent: '#22D3EE' },
          ].map((s) => (
            <div key={s.label} className="relative overflow-hidden bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 flex flex-col gap-1.5">
              <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(80% 50% at 100% 0%, ${s.accent} 0%, transparent 60%)`, opacity: 0.18 }} />
              <div className="text-[10.5px] uppercase tracking-widest text-[var(--muted)] font-semibold">{s.label}</div>
              <div className="font-['Montserrat'] text-[28px] font-extrabold tracking-tight text-[var(--text)]">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Active deliveries */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-2 font-bold text-[15px] text-[var(--text)]">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
            Active Runs
          </div>
          <div className="flex flex-col gap-0">
            {DELIVERIES.map((d, i) => (
              <div key={d.id} className={`px-5 py-4 flex items-center gap-4 hover:bg-[var(--surface-2)] transition-all cursor-pointer ${i < DELIVERIES.length - 1 ? 'border-b border-[var(--border)]/60' : ''}`}>
                <div>
                  <div className="font-semibold text-[13.5px] text-[var(--text)]">{d.customer}</div>
                  <div className="text-[11.5px] text-[var(--muted)] font-mono mt-0.5">{d.order} · {d.items} item{d.items !== 1 ? 's' : ''}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-[var(--text-2)] truncate">{d.address}</div>
                  <div className="text-[11px] text-[var(--muted)] mt-0.5">Rider: {d.rider}</div>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full shrink-0 ${d.statusCls}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />{d.status}
                </span>
                <div className="text-[12px] text-[var(--muted)] shrink-0">{d.eta}</div>
                <div className="font-mono font-bold shrink-0" style={{ color: 'var(--naira)' }}>{d.amount}</div>
                <button className="inline-flex items-center h-8 px-3 rounded-lg border border-[var(--border)] bg-transparent text-[var(--text)] text-[12px] font-semibold hover:border-[var(--border-strong)] transition-all shrink-0">
                  Track →
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  )
}
