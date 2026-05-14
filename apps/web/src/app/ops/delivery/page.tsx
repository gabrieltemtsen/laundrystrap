'use client'

import { AppShell } from '@/components/app-shell'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, CardDescription, PageHeader, StatCard, EmptyState } from '@/components/ui'
import { Truck, MapPin, Clock, CheckCircle2, Plus, Phone } from 'lucide-react'

const DELIVERIES = [
  { id: 'DEL-001', order: 'LS-0042', customer: 'Amaka Obi',    address: '14 Wuse II, Abuja',      eta: 'Today 2:00 PM',  status: 'en-route', rider: 'Tunde A.' },
  { id: 'DEL-002', order: 'LS-0039', customer: 'Chidi Eze',    address: '7 Maitama, Abuja',        eta: 'Today 4:30 PM',  status: 'scheduled', rider: 'Emeka O.' },
  { id: 'DEL-003', order: 'LS-0035', customer: 'Ngozi Adeyemi',address: '22 Garki II, Abuja',      eta: 'Tomorrow 10 AM', status: 'scheduled', rider: 'Unassigned' },
]

function StatusBadge({ status }: { status: string }) {
  if (status === 'delivered')  return <Badge variant="success" dot>Delivered</Badge>
  if (status === 'en-route')   return <Badge variant="cyan" dot>En Route</Badge>
  if (status === 'scheduled')  return <Badge variant="indigo" dot>Scheduled</Badge>
  return <Badge dot>{status}</Badge>
}

export default function DeliveryPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Pickup & Delivery"
          description="Schedule and track customer pickups and deliveries."
          actions={
            <Button variant="primary" size="sm">
              <Plus className="h-4 w-4" />
              Schedule Delivery
            </Button>
          }
        />

        {/* Stats */}
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
          <StatCard label="En Route Now"  value={DELIVERIES.filter(d => d.status === 'en-route').length}  icon={Truck}        accent="cyan"    />
          <StatCard label="Scheduled"     value={DELIVERIES.filter(d => d.status === 'scheduled').length} icon={Clock}        accent="indigo"  />
          <StatCard label="Delivered Today" value={0}                                                       icon={CheckCircle2} accent="emerald" />
        </div>

        {/* Delivery list */}
        <Card>
          <CardHeader>
            <CardTitle>Active Deliveries</CardTitle>
            <CardDescription>Current and upcoming delivery schedule.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {DELIVERIES.length === 0 ? (
              <EmptyState
                icon={Truck}
                title="No deliveries scheduled"
                description="Schedule a pickup or delivery for a customer order."
                action={<Button variant="primary" size="sm"><Plus className="h-4 w-4" />Schedule Delivery</Button>}
              />
            ) : (
              <div>
                {DELIVERIES.map((d) => (
                  <div key={d.id} className="flex items-start gap-4 border-b border-[var(--border)]/60 px-5 py-4 hover:bg-[var(--surface-2)] transition-all last:border-0">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Truck className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[var(--text)] text-sm">{d.customer}</span>
                        <span className="font-mono text-xs text-[var(--muted)]">{d.order}</span>
                        <StatusBadge status={d.status} />
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-[var(--muted)]">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{d.address}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-[var(--muted)]">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {d.eta}</span>
                        <span>Rider: <span className="text-[var(--text-2)] font-medium">{d.rider}</span></span>
                      </div>
                    </div>
                    <button className="h-8 w-8 flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-3)] transition-all shrink-0">
                      <Phone className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
