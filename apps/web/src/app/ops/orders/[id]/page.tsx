import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@/components/ui'
import { ArrowLeft, Camera, CheckCircle2, CircleDot, Clock, MapPin, QrCode, Shirt } from 'lucide-react'

type TimelineStep = {
  label: string
  at: string
  status: 'done' | 'current' | 'todo'
  note?: string
}

type ItemRow = {
  tagId: string
  name: string
  expectedLocation: string
  status: 'At intake' | 'In wash' | 'Drying' | 'Folded' | 'Bagged'
}

const timeline: TimelineStep[] = [
  { label: 'Created', at: '10:12 AM', status: 'done', note: 'Walk-in drop off' },
  { label: 'Tagged items', at: '10:16 AM', status: 'done' },
  { label: 'Washing', at: '10:41 AM', status: 'current', note: 'Washer #2' },
  { label: 'Drying', at: '—', status: 'todo' },
  { label: 'Folding', at: '—', status: 'todo' },
  { label: 'Ready for pickup', at: '—', status: 'todo' },
]

const items: ItemRow[] = [
  { tagId: 'TAG-7F2A', name: 'Button-down shirt', expectedLocation: 'Washer #2', status: 'In wash' },
  { tagId: 'TAG-7F2B', name: 'Jeans', expectedLocation: 'Washer #2', status: 'In wash' },
  { tagId: 'TAG-7F2C', name: 'Hoodie', expectedLocation: 'Washer #2', status: 'In wash' },
  { tagId: 'TAG-7F2D', name: 'Socks (x6)', expectedLocation: 'Washer #2', status: 'In wash' },
]

function StepIcon({ status }: { status: TimelineStep['status'] }) {
  if (status === 'done') return <CheckCircle2 className="h-4 w-4 text-emerald-300" />
  if (status === 'current') return <CircleDot className="h-4 w-4 text-primary" />
  return <div className="h-4 w-4 rounded-full border border-border/70" />
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <Link href="/ops" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">Order {id}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="warn">In Wash</Badge>
              <span className="text-sm text-muted">Customer: C. Johnson</span>
              <span className="text-sm text-muted">•</span>
              <span className="inline-flex items-center gap-1 text-sm text-muted">
                <Clock className="h-4 w-4" /> Due Today 5:30 PM
              </span>
              <span className="text-sm text-muted">•</span>
              <span className="inline-flex items-center gap-1 text-sm text-muted">
                <MapPin className="h-4 w-4" /> Expected: Washer #2
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button>
              <QrCode className="h-4 w-4" />
              Print tags
            </Button>
            <Button>
              <Camera className="h-4 w-4" />
              Capture photos
            </Button>
            <Button variant="primary">Mark step complete</Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <Card className="lg:col-span-5">
            <CardHeader>
              <CardTitle>Status timeline</CardTitle>
              <CardDescription>One source of truth for handoffs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {timeline.map((s) => (
                <div key={s.label} className="flex gap-3 rounded-md border border-border/60 bg-black/20 p-3">
                  <div className="mt-0.5">
                    <StepIcon status={s.status} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="truncate text-sm font-medium">{s.label}</div>
                      <div className="shrink-0 text-xs text-muted">{s.at}</div>
                    </div>
                    {s.note ? <div className="mt-1 text-xs text-muted">{s.note}</div> : null}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="lg:col-span-7">
            <CardHeader>
              <CardTitle>Items</CardTitle>
              <CardDescription>Tag IDs are the backbone of chain-of-custody.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <Input label="Add tag" placeholder="Scan / type TAG-…" />
                  <Input label="Item name" placeholder="e.g. Hoodie" />
                  <div className="flex items-end">
                    <Button className="w-full" variant="primary">
                      <Shirt className="h-4 w-4" />
                      Add item
                    </Button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-md border border-border/60">
                  <div className="grid grid-cols-12 gap-2 bg-black/30 px-3 py-2 text-xs text-muted">
                    <div className="col-span-3">Tag</div>
                    <div className="col-span-4">Item</div>
                    <div className="col-span-3">Expected location</div>
                    <div className="col-span-2">Status</div>
                  </div>
                  {items.map((it) => (
                    <div key={it.tagId} className="grid grid-cols-12 gap-2 border-t border-border/60 px-3 py-3 text-sm">
                      <div className="col-span-3 font-mono text-white/90">{it.tagId}</div>
                      <div className="col-span-4 text-white/90">{it.name}</div>
                      <div className="col-span-3 text-white/80">{it.expectedLocation}</div>
                      <div className="col-span-2">
                        <Badge>{it.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-dashed border-border/70 bg-white/5 p-4">
                    <div className="text-sm font-semibold">Photos (placeholder)</div>
                    <p className="mt-1 text-xs text-muted">Capture the bag + any high-risk items (delicates, stains, etc.).</p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm">
                        <Camera className="h-4 w-4" /> Add photo
                      </Button>
                      <Button size="sm" variant="ghost">
                        View gallery
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-lg border border-dashed border-border/70 bg-white/5 p-4">
                    <div className="text-sm font-semibold">Handoff notes</div>
                    <p className="mt-1 text-xs text-muted">Write what the next operator needs to know.</p>
                    <div className="mt-3">
                      <Input placeholder="e.g. Blue hoodie has pen stain — treat before dry" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
