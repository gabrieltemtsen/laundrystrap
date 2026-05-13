import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { Badge, ButtonLink, Card, CardContent, CardDescription, CardHeader, CardTitle, Kbd } from '@/components/ui'
import { ArrowRight, Clock, MapPin, QrCode, Sparkles } from 'lucide-react'

type QueueOrder = {
  id: string
  customer: string
  due: string
  status: 'Awaiting Intake' | 'In Wash' | 'Ready for Pickup'
  expectedLocation: string
  items: number
}

const TODAY: QueueOrder[] = [
  {
    id: 'LS-1042',
    customer: 'A. Patel',
    due: 'Today 3:00 PM',
    status: 'Awaiting Intake',
    expectedLocation: 'Front desk — intake shelf',
    items: 9,
  },
  {
    id: 'LS-1041',
    customer: 'C. Johnson',
    due: 'Today 5:30 PM',
    status: 'In Wash',
    expectedLocation: 'Washer #2',
    items: 14,
  },
  {
    id: 'LS-1039',
    customer: 'M. Chen',
    due: 'Tomorrow 10:00 AM',
    status: 'Ready for Pickup',
    expectedLocation: 'Pickup rack A-3',
    items: 6,
  },
]

function statusBadge(status: QueueOrder['status']) {
  if (status === 'Ready for Pickup') return <Badge variant="success">Ready</Badge>
  if (status === 'In Wash') return <Badge variant="warn">In Wash</Badge>
  return <Badge>Intake</Badge>
}

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Today’s queue</h1>
            <p className="mt-1 text-sm text-muted">
              What matters is <span className="text-white">where each tagged item should be</span>—and what to do next.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ButtonLink href="/scan" variant="secondary">
              <QrCode className="h-4 w-4" />
              Scan tag
              <Kbd className="ml-1 hidden md:inline-flex">⌘ K</Kbd>
            </ButtonLink>
            <ButtonLink href="/intake" variant="primary">
              <Sparkles className="h-4 w-4" />
              New intake
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Awaiting intake</CardTitle>
              <CardDescription>Orders started, items not fully tagged yet.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">2</div>
              <div className="mt-2 text-xs text-muted">Goal: 0 before lunch.</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>In progress</CardTitle>
              <CardDescription>Actively washing, drying, or folding.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">5</div>
              <div className="mt-2 text-xs text-muted">Most common issue: missing photos.</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ready</CardTitle>
              <CardDescription>Bagged + verified, waiting for pickup.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">3</div>
              <div className="mt-2 text-xs text-muted">Double-check rack locations.</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Queue</CardTitle>
            <CardDescription>Open an order to see timeline, items, and tag locations.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-md border border-border/60">
              <div className="grid grid-cols-12 gap-2 bg-black/30 px-3 py-2 text-xs text-muted">
                <div className="col-span-4">Order</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Due
                </div>
                <div className="col-span-3 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> Expected location
                </div>
                <div className="col-span-1 text-right">Items</div>
              </div>

              {TODAY.map((o) => (
                <Link
                  key={o.id}
                  href={`/orders/${o.id}`}
                  className="grid grid-cols-12 gap-2 border-t border-border/60 px-3 py-3 text-sm transition hover:bg-white/5"
                >
                  <div className="col-span-4">
                    <div className="font-medium text-white">{o.id}</div>
                    <div className="text-xs text-muted">{o.customer}</div>
                  </div>
                  <div className="col-span-2 flex items-center">{statusBadge(o.status)}</div>
                  <div className="col-span-2 text-white/90">{o.due}</div>
                  <div className="col-span-3 text-white/80">{o.expectedLocation}</div>
                  <div className="col-span-1 text-right font-medium text-white/90">{o.items}</div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
