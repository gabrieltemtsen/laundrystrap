'use client'

import { AppShell } from '@/components/app-shell'
import { Badge, ButtonLink, Card, CardContent, CardHeader, CardTitle, CardDescription, PageHeader } from '@/components/ui'
import { Layers, ClipboardList, Plus } from 'lucide-react'

const STATIONS = [
  { key: 'intake', label: 'Intake',    color: 'text-slate-400',  bg: 'bg-slate-400/10',   border: 'border-slate-500/20', dot: 'bg-slate-400',    count: 0, staff: 'Unassigned' },
  { key: 'sort',   label: 'Sorting',   color: 'text-sky-400',    bg: 'bg-sky-400/10',     border: 'border-sky-500/20',   dot: 'bg-sky-400',      count: 0, staff: 'Unassigned' },
  { key: 'wash',   label: 'Washing',   color: 'text-cyan-400',   bg: 'bg-cyan-400/10',    border: 'border-cyan-500/20',  dot: 'bg-cyan-400',     count: 0, staff: 'Unassigned' },
  { key: 'dry',    label: 'Drying',    color: 'text-amber-400',  bg: 'bg-amber-400/10',   border: 'border-amber-500/20', dot: 'bg-amber-400',    count: 0, staff: 'Unassigned' },
  { key: 'iron',   label: 'Ironing',   color: 'text-orange-400', bg: 'bg-orange-400/10',  border: 'border-orange-500/20',dot: 'bg-orange-400',   count: 0, staff: 'Unassigned' },
  { key: 'fold',   label: 'Folding',   color: 'text-violet-400', bg: 'bg-violet-400/10',  border: 'border-violet-500/20',dot: 'bg-violet-400',   count: 0, staff: 'Unassigned' },
  { key: 'ready',  label: 'Ready',     color: 'text-emerald-400',bg: 'bg-emerald-400/10', border: 'border-emerald-500/20',dot:'bg-emerald-400',  count: 0, staff: 'Unassigned' },
]

export default function StationsPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Stations"
          description="Monitor and manage each laundry processing station."
          actions={
            <ButtonLink href="/ops/intake" variant="primary" size="sm">
              <ClipboardList className="h-4 w-4" />
              New Intake
            </ButtonLink>
          }
        />

        {/* Station grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {STATIONS.map((s) => (
            <Card key={s.key} className="hover:-translate-y-0.5 transition-all cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${s.dot} shadow-[0_0_8px_currentColor]`} />
                    <CardTitle className={s.color}>{s.label}</CardTitle>
                  </div>
                  <Badge variant="default">{s.count} items</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`rounded-xl ${s.bg} border ${s.border} p-4 flex flex-col items-center justify-center min-h-[80px] gap-2`}>
                  <Layers className={`h-6 w-6 ${s.color} opacity-60`} />
                  <span className="text-xs text-[var(--muted)]">No items here</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-[var(--muted)]">
                  <span>Staff: {s.staff}</span>
                  <button className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                    Assign →
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add station placeholder */}
          <div className="rounded-2xl border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center gap-3 p-8 cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group min-h-[180px]">
            <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all">
              <Plus className="h-5 w-5 text-[var(--muted)] group-hover:text-indigo-400" />
            </div>
            <span className="text-xs font-semibold text-[var(--muted)] group-hover:text-indigo-400 transition-colors">Add Station</span>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
