'use client'

import { AppShell } from '@/components/app-shell'
import Link from 'next/link'

type ItemCard = { tag: string; type: string; meta: string; urgent?: boolean; ready?: boolean }
type StationData = {
  id: string; label: string; color: string; count: number; items: ItemCard[]
}

const STATIONS: StationData[] = [
  {
    id: 'sorting', label: 'Sorting', color: 'var(--st-sort)', count: 5,
    items: [
      { tag: 'ABJ-260514-0042-03', type: 'Native Attire', meta: 'M. Okafor · 2h overdue', urgent: true },
      { tag: 'ABJ-260514-0048-01', type: 'Suit (2pc)', meta: 'D. Adeyemi' },
      { tag: 'ABJ-260514-0049-02', type: 'Duvet', meta: 'Hilton' },
      { tag: 'ABJ-260514-0050-01', type: 'Shirt', meta: 'A. Okafor' },
      { tag: 'ABJ-260514-0050-02', type: 'Suit', meta: 'A. Okafor' },
    ],
  },
  {
    id: 'washing', label: 'Washing', color: 'var(--st-wash)', count: 12,
    items: [
      { tag: 'ABJ-260514-0040-01', type: 'Shirts × 4', meta: 'B. Adamu · Drum 2' },
      { tag: 'ABJ-260514-0041-02', type: 'Bed Sheets × 3', meta: 'Sheraton · Drum 1' },
      { tag: 'ABJ-260514-0043-04', type: 'Towels Bundle', meta: 'F. Bello · Drum 3' },
      { tag: 'ABJ-260514-0044-01', type: 'Trousers × 3', meta: 'Y. Lawal' },
      { tag: 'ABJ-260514-0045-02', type: 'Linens', meta: 'Sheraton' },
    ],
  },
  {
    id: 'drying', label: 'Drying', color: 'var(--st-dry)', count: 8,
    items: [
      { tag: 'ABJ-260514-0038-01', type: 'Shirts × 6', meta: 'A. Okafor · 22 min' },
      { tag: 'ABJ-260514-0039-02', type: 'Trousers × 3', meta: 'Y. Lawal · Hang dry' },
      { tag: 'ABJ-260514-0036-01', type: 'Towels', meta: 'Hilton · 15 min' },
      { tag: 'ABJ-260514-0046-01', type: 'Bedding', meta: 'F. Bello' },
    ],
  },
  {
    id: 'ironing', label: 'Ironing', color: 'var(--st-iron)', count: 9,
    items: [
      { tag: 'ABJ-260513-0029-01', type: 'Suit Pressed', meta: 'G. Nnamdi · 6h late ⚠', urgent: true },
      { tag: 'ABJ-260514-0035-02', type: 'Iro & Buba', meta: 'K. Bello' },
      { tag: 'ABJ-260514-0037-01', type: 'Shirts × 4', meta: 'P. Okonkwo' },
      { tag: 'ABJ-260514-0047-03', type: 'Agbada', meta: 'M. Yusuf' },
    ],
  },
  {
    id: 'folding', label: 'Folding', color: 'var(--st-fold)', count: 6,
    items: [
      { tag: 'ABJ-260514-0033-01', type: 'Wash & Fold Bundle', meta: 'M. Yusuf · Bag 12' },
      { tag: 'ABJ-260514-0036-03', type: 'Towels & Linens', meta: 'Transcorp Hilton' },
      { tag: 'ABJ-260514-0032-01', type: 'Family Pack', meta: 'B. Adamu' },
    ],
  },
  {
    id: 'ready', label: 'Ready', color: 'var(--st-ready)', count: 17,
    items: [
      { tag: 'ABJ-260513-0026-01', type: '8 items', meta: 'A. Okafor · WA sent ✓', ready: true },
      { tag: 'ABJ-260513-0024-01', type: 'Dry Clean', meta: 'C. Adeleke · Unpaid', ready: true },
      { tag: 'ABJ-260513-0022-01', type: 'Native × 2', meta: 'L. Eze · SMS sent ✓', ready: true },
      { tag: 'ABJ-260513-0021-01', type: 'Mixed', meta: 'J. Hassan', ready: true },
    ],
  },
]

const FILTER_CHIPS = [
  { label: 'All items',         num: 42  },
  { label: 'Express',           num: 5   },
  { label: 'Overdue',           num: 3   },
  { label: 'Corporate',         num: 8   },
  { label: 'Walk-in',           num: 31  },
  { label: 'Pickup/Delivery',   num: 11  },
]

export default function StationsPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-5">

        {/* Page head */}
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-['Montserrat'] text-[30px] font-extrabold tracking-tight text-[var(--text)]">Workflow Stations</h1>
            <p className="text-[var(--muted)] text-[13.5px] mt-1">Items flow through 6 stations · scan a tag to advance an item to the next stage</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] border border-[var(--border)] bg-transparent text-[var(--text)] text-[13px] font-semibold hover:border-[var(--border-strong)] transition-all">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Station Settings
            </button>
            <button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-white text-[13px] font-semibold transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(135deg,#6366F1,#7C3AED)', boxShadow: '0 4px 14px -4px rgba(99,102,241,.5)' }}>
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Scan to Advance
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 flex-wrap">
          {FILTER_CHIPS.map((chip, i) => (
            <button key={chip.label}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${
                i === 0
                  ? 'bg-[var(--primary)] text-white border-transparent'
                  : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-2)] hover:border-[var(--border-strong)]'
              }`}>
              {chip.label}
              <span className="ml-1.5 font-mono text-[10.5px] bg-black/25 px-1.5 py-0.5 rounded-full">{chip.num}</span>
            </button>
          ))}
        </div>

        {/* Kanban board */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(6, minmax(0,1fr))', minHeight: 540 }}>
            {STATIONS.map((st) => (
              <div key={st.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3 flex flex-col min-h-[540px]">
                {/* Station header */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2 font-bold text-[12.5px] text-[var(--text)]">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: st.color }} />
                    {st.label}
                  </div>
                  <span className="font-mono text-[11px] bg-[var(--surface-2)] border border-[var(--border)] px-1.5 py-0.5 rounded-full">
                    {st.count}
                  </span>
                </div>

                {/* Item cards */}
                <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
                  {st.items.map((item) => (
                    <div key={item.tag}
                      className={`rounded-[10px] p-2.5 cursor-pointer transition-all hover:-translate-y-px ${
                        item.urgent
                          ? 'bg-[var(--surface-2)] border border-red-500/40 shadow-[0_0_0_1px_rgba(239,68,68,.15)_inset]'
                          : item.ready
                          ? 'bg-[var(--surface-2)] border border-emerald-500/25'
                          : 'bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--border-strong)]'
                      }`}>
                      <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded inline-block ${
                        item.urgent ? 'bg-red-500/15 text-red-300' : 'bg-indigo-500/10 text-[var(--text-2)]'
                      }`}>
                        {item.tag}
                      </span>
                      <div className="font-semibold text-[12.5px] text-[var(--text)] mt-1.5">{item.type}</div>
                      <div className="text-[10.5px] text-[var(--muted)] mt-0.5">{item.meta}</div>
                    </div>
                  ))}
                  {st.count > st.items.length && (
                    <div className="text-[10.5px] text-[var(--muted)] text-center py-2">
                      +{st.count - st.items.length} more items…
                    </div>
                  )}
                </div>

                {/* Assign button */}
                <button className="mt-3 w-full py-2 rounded-lg border border-dashed border-[var(--border-strong)] text-[11px] font-semibold text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary-2)] transition-all">
                  Assign staff →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Back to dashboard link */}
        <div className="flex justify-center">
          <Link href="/ops" className="text-[13px] text-[var(--muted)] hover:text-[var(--text)] transition-colors">
            ← Back to Dashboard
          </Link>
        </div>

      </div>
    </AppShell>
  )
}
