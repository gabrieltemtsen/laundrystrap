'use client'

import { AppShell } from '@/components/app-shell'

const CHANNEL_CARDS = [
  {
    label: 'WhatsApp',
    value: '412', valueCls: 'text-[#22C55E]',
    delta: 'Messages sent this week · 94% delivered',
    sub: 'Primary channel for Nigerian customers · supports tracking link + auto-reply',
    iconBg: 'rgba(37,211,102,.15)', iconColor: '#22C55E',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24z"/>
      </svg>
    ),
  },
  {
    label: 'SMS Fallback',
    value: '187', valueCls: 'text-[var(--info)]',
    delta: 'Sent · ₦4.20 avg cost',
    sub: 'Auto-triggers when WhatsApp delivery fails after 5 min',
    iconBg: 'rgba(56,189,248,.15)', iconColor: 'var(--info)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    label: 'Email Receipts',
    value: '94', valueCls: 'text-[#A78BFA]',
    delta: 'Receipts + invoices delivered',
    sub: 'Corporate customers · auto-attach PDF receipts',
    iconBg: 'rgba(167,139,250,.15)', iconColor: '#A78BFA',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
]

type CommsEvent = { channel: 'wa' | 'sms' | 'email'; name: string; message: string; meta: string }
const EVENTS: CommsEvent[] = [
  { channel: 'wa',    name: 'Amara Okafor',     message: '"Your order #ORD-0042 is ready for pickup at Wuse II. Track: lndry.st/a42"',  meta: 'WhatsApp · Delivered 11:24 AM · Read 11:26 AM' },
  { channel: 'wa',    name: 'Damilola Adeyemi', message: '"Hi Damilola, your laundry is on its way! Driver: Musa · ETA 4:15 PM"',         meta: 'WhatsApp · Delivered 3:48 PM' },
  { channel: 'sms',   name: 'Bola Adamu',       message: '"OTP for pickup: 4827. Valid 30 min. — LaundryStrap"',                          meta: 'SMS · Delivered 2:01 PM · Fallback (WhatsApp not registered)' },
  { channel: 'email', name: 'Transcorp Hilton', message: '"Invoice INV-2026-0041 — ₦36,000 due 14 Jun 2026. View & pay online."',         meta: 'Email · Opened 9:14 AM · accounts@transcorp.com.ng' },
]

function CommsIcon({ channel }: { channel: 'wa' | 'sms' | 'email' }) {
  if (channel === 'wa') return (
    <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(37,211,102,.15)', color: '#22C55E' }}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24z"/></svg>
    </div>
  )
  if (channel === 'sms') return (
    <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(56,189,248,.15)', color: 'var(--info)' }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    </div>
  )
  return (
    <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(167,139,250,.15)', color: '#A78BFA' }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
    </div>
  )
}

export default function CommsPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-5">

        {/* Page head */}
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-['Montserrat'] text-[30px] font-extrabold tracking-tight text-[var(--text)]">Customer Communications</h1>
            <p className="text-[var(--muted)] text-[13.5px] mt-1">WhatsApp · SMS · Email — automated on every status change</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] border border-[var(--border)] bg-transparent text-[var(--text)] text-[13px] font-semibold hover:border-[var(--border-strong)] transition-all">
              Templates
            </button>
            <button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-white text-[13px] font-semibold transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(135deg,#6366F1,#7C3AED)', boxShadow: '0 4px 14px -4px rgba(99,102,241,.5)' }}>
              + Send broadcast
            </button>
          </div>
        </div>

        {/* Channel stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px]">
          {CHANNEL_CARDS.map((ch) => (
            <div key={ch.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] p-[18px]" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="flex items-center gap-2 font-bold text-[15px] text-[var(--text)] mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: ch.iconBg, color: ch.iconColor }}>
                  {ch.icon}
                </div>
                {ch.label}
              </div>
              <div className={`font-['Montserrat'] text-[28px] font-extrabold tracking-tight mb-1 ${ch.valueCls}`}>{ch.value}</div>
              <div className="text-[11.5px] text-[var(--text-2)] mb-2">{ch.delta}</div>
              <div className="text-[11.5px] text-[var(--muted)]">{ch.sub}</div>
            </div>
          ))}
        </div>

        {/* Recent activity */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] p-[18px]" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2 font-bold text-[15px] text-[var(--text)]">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              Recent Activity
            </div>
            <div className="flex gap-1.5">
              {['All', 'Failed', 'Pending'].map((chip, i) => (
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

          <div className="flex flex-col gap-2">
            {EVENTS.map((ev, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-[10px] bg-[var(--surface-2)] border border-[var(--border)] text-[12.5px]">
                <CommsIcon channel={ev.channel} />
                <div className="flex-1 min-w-0">
                  <div className="text-[var(--text)]"><strong>{ev.name}</strong> — {ev.message}</div>
                  <div className="text-[10.5px] text-[var(--muted)] mt-0.5">{ev.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  )
}
