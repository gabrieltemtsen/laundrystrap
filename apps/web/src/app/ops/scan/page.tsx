'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { Badge, Button, ButtonLink, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@/components/ui'
import { ArrowRight, MapPin, QrCode, Search, Shirt, TriangleAlert } from 'lucide-react'

type ScanResult = {
  tagId: string
  orderId: string
  itemName: string
  expectedLocation: string
  lastSeen: string
  status: 'OK' | 'Mismatch' | 'Unknown'
}

function mockLookup(tagId: string): ScanResult | null {
  const normalized = tagId.trim().toUpperCase()
  if (!normalized) return null
  if (normalized === 'TAG-7F2A') {
    return {
      tagId: normalized,
      orderId: 'LS-1041',
      itemName: 'Button-down shirt',
      expectedLocation: 'Washer #2',
      lastSeen: '10:43 AM — Intake shelf',
      status: 'Mismatch',
    }
  }
  return {
    tagId: normalized,
    orderId: 'LS-1042',
    itemName: 'Unknown item (placeholder)',
    expectedLocation: 'Front desk — intake shelf',
    lastSeen: 'Just now',
    status: 'OK',
  }
}

export default function ScanPage() {
  const [tag, setTag] = React.useState('')
  const [result, setResult] = React.useState<ScanResult | null>(null)

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Scan</h1>
          <p className="mt-1 text-sm text-muted">Enter / scan a tag ID to verify expected location and order status.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tag lookup</CardTitle>
            <CardDescription>Works with barcode scanners (keyboard wedge). Try: TAG-7F2A</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="flex-1">
              <Input
                label="Tag ID"
                value={tag}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTag(e.target.value)}
                placeholder="Scan / type e.g. TAG-7F2A"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  setResult(mockLookup(tag))
                }}
              >
                <Search className="h-4 w-4" />
                Lookup
              </Button>
              <Button
                onClick={() => {
                  setTag('TAG-7F2A')
                  setResult(mockLookup('TAG-7F2A'))
                }}
              >
                <QrCode className="h-4 w-4" />
                Demo
              </Button>
            </div>
          </CardContent>
        </Card>

        {result ? (
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
              <CardDescription>What we expect vs what we saw.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border/60 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-mono text-sm text-white/90">{result.tagId}</div>
                  {result.status === 'OK' ? <Badge variant="success">OK</Badge> : null}
                  {result.status === 'Mismatch' ? <Badge variant="danger">Mismatch</Badge> : null}
                  {result.status === 'Unknown' ? <Badge variant="warn">Unknown</Badge> : null}
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Shirt className="h-4 w-4 text-primary" />
                  <span className="font-medium">{result.itemName}</span>
                </div>
                <div className="mt-2 text-xs text-muted">Last seen: {result.lastSeen}</div>
              </div>

              <div className="rounded-lg border border-border/60 bg-black/20 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <MapPin className="h-4 w-4 text-primary" /> Expected location
                </div>
                <div className="mt-2 text-sm text-white/90">{result.expectedLocation}</div>

                {result.status === 'Mismatch' ? (
                  <div className="mt-3 rounded-md border border-red-500/30 bg-red-500/10 p-3">
                    <div className="flex items-start gap-2">
                      <TriangleAlert className="mt-0.5 h-4 w-4 text-red-200" />
                      <div>
                        <div className="text-sm font-medium">Location mismatch</div>
                        <div className="mt-1 text-xs text-red-100/80">
                          Move item back to the expected station or update status if workflow advanced.
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm">
                    Mark as seen
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <ButtonLink href={`/orders/${result.orderId}`} variant="ghost" size="sm">
                    Open order
                  </ButtonLink>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </AppShell>
  )
}
