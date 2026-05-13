import { AppShell } from '@/components/app-shell'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Textarea } from '@/components/ui'
import { Camera, Plus, QrCode, ShieldCheck } from 'lucide-react'

export default function IntakePage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">New intake</h1>
          <p className="mt-1 text-sm text-muted">Create customer + order. Tag first, details second.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Card>
              <CardHeader>
                <CardTitle>Customer</CardTitle>
                <CardDescription>We’ll attach orders to this profile.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Input label="Full name" placeholder="e.g. Maria Chen" />
                <Input label="Phone" placeholder="e.g. (555) 123-4567" />
                <Input label="Email (optional)" placeholder="e.g. maria@example.com" />
                <Input label="Preferred pickup" placeholder="Front desk" hint="Used as default location suggestion." />
                <div className="md:col-span-2">
                  <Textarea label="Notes" placeholder="Allergies, detergent preference, special handling…" />
                </div>
              </CardContent>
            </Card>

            <div className="h-4" />

            <Card>
              <CardHeader>
                <CardTitle>Order</CardTitle>
                <CardDescription>Minimal fields to start. You can enrich later.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Input label="Due date" placeholder="Today 5:00 PM" />
                <Input label="Service" placeholder="Wash & Fold" />
                <Input label="Bag / bin" placeholder="BIN-12" hint="Physical container holding items." />
                <Input label="Drop-off source" placeholder="Walk-in" />
                <div className="md:col-span-2">
                  <Textarea label="Special instructions" placeholder="Stain on left cuff, hang dry…" />
                </div>

                <div className="md:col-span-2 flex flex-wrap gap-2 pt-2">
                  <Button variant="primary">
                    <Plus className="h-4 w-4" />
                    Create order
                  </Button>
                  <Button>
                    <QrCode className="h-4 w-4" />
                    Print tags
                  </Button>
                  <Button>
                    <Camera className="h-4 w-4" />
                    Capture bag photos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5">
            <Card>
              <CardHeader>
                <CardTitle>Checklist</CardTitle>
                <CardDescription>Prevent misplacement before it happens.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 rounded-md border border-border/60 bg-black/20 p-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-300" />
                  <div>
                    <div className="text-sm font-medium">Tag every item</div>
                    <div className="text-xs text-muted">No tag = no chain of custody.</div>
                  </div>
                  <Badge className="ml-auto" variant="warn">
                    Required
                  </Badge>
                </div>

                <div className="flex items-start gap-3 rounded-md border border-border/60 bg-black/20 p-3">
                  <Camera className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Photos (placeholder)</div>
                    <div className="text-xs text-muted">Capture bag + notable items for verification.</div>
                  </div>
                  <Badge className="ml-auto">Soon</Badge>
                </div>

                <div className="rounded-md border border-dashed border-border/70 bg-white/5 p-4">
                  <div className="text-sm font-medium">Pro tip</div>
                  <p className="mt-1 text-xs text-muted">
                    If you’re slammed: create order → tag items → set expected location. You can fill customer notes later.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
