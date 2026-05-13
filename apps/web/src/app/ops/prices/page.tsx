'use client'

import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { AppShell } from '@/components/app-shell'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Input } from '@/components/ui'
import { Plus, Save, Trash2, Tag, Edit2, X, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'

const DEFAULT_ITEMS = [
  { itemType: 'Shirt', unit: 'per piece' },
  { itemType: 'Trouser / Pants', unit: 'per piece' },
  { itemType: 'Dress', unit: 'per piece' },
  { itemType: 'Suit (2 piece)', unit: 'per suit' },
  { itemType: 'Native Attire', unit: 'per piece' },
  { itemType: 'Bed Sheet', unit: 'per piece' },
  { itemType: 'Duvet / Blanket', unit: 'per piece' },
  { itemType: 'Jeans', unit: 'per piece' },
  { itemType: 'Hoodie / Sweatshirt', unit: 'per piece' },
  { itemType: 'Socks (pair)', unit: 'per pair' },
  { itemType: 'Underwear', unit: 'per piece' },
  { itemType: 'Jacket / Coat', unit: 'per piece' },
]

type PriceRow = {
  _id?: string
  itemType: string
  priceNgn: number
  unit: string
  editing?: boolean
}

function PriceItem({
  row,
  onSave,
  onRemove,
}: {
  row: PriceRow
  onSave: (itemType: string, priceNgn: number, unit: string) => Promise<void>
  onRemove?: (id: string) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [price, setPrice] = useState(String(row.priceNgn))
  const [unit, setUnit] = useState(row.unit)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    const p = parseFloat(price)
    if (isNaN(p) || p < 0) return
    setSaving(true)
    try {
      await onSave(row.itemType, p, unit)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.04] last:border-0 transition-all ${editing ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]'}`}>
      {/* Item name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{row.itemType}</p>
        {!editing && (
          <p className="text-xs text-white/30 mt-0.5">{row.unit}</p>
        )}
      </div>

      {editing ? (
        <>
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/50">₦</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-9 w-32 rounded-lg border border-white/10 bg-white/5 pl-7 pr-3 text-sm text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                placeholder="0"
                min="0"
              />
            </div>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="h-9 w-28 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              placeholder="per piece"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="text-right">
            {row.priceNgn > 0 ? (
              <p className="text-base font-bold text-white">₦{row.priceNgn.toLocaleString()}</p>
            ) : (
              <p className="text-sm text-white/25 italic">Not set</p>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setPrice(String(row.priceNgn))
                setUnit(row.unit)
                setEditing(true)
              }}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            {onRemove && row._id && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(row._id!)}
                className="text-red-400/60 hover:text-red-400 hover:bg-red-400/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default function PricesPage() {
  const prices = useQuery(api.prices.list, {})
  const upsert = useMutation(api.prices.upsert)
  const remove = useMutation(api.prices.remove)

  const [showAdd, setShowAdd] = useState(false)
  const [newItem, setNewItem] = useState({ itemType: '', priceNgn: '', unit: 'per piece' })
  const [addSaving, setAddSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const priceMap = new Map(prices?.map((p) => [p.itemType, p]) ?? [])

  async function handleSave(itemType: string, priceNgn: number, unit: string) {
    await upsert({ itemType, priceNgn, unit })
    setSuccessMsg(`${itemType} updated`)
    setTimeout(() => setSuccessMsg(''), 2000)
  }

  async function handleRemove(id: string) {
    await remove({ priceId: id as any })
  }

  async function handleAddCustom() {
    if (!newItem.itemType.trim()) return
    const p = parseFloat(newItem.priceNgn)
    if (isNaN(p) || p < 0) return
    setAddSaving(true)
    try {
      await upsert({ itemType: newItem.itemType.trim(), priceNgn: p, unit: newItem.unit || 'per piece' })
      setNewItem({ itemType: '', priceNgn: '', unit: 'per piece' })
      setShowAdd(false)
    } finally {
      setAddSaving(false)
    }
  }

  // Merge defaults with saved prices
  const allItems: PriceRow[] = DEFAULT_ITEMS.map((d) => {
    const saved = priceMap.get(d.itemType)
    return saved
      ? { _id: saved._id, itemType: saved.itemType, priceNgn: saved.priceNgn, unit: saved.unit }
      : { itemType: d.itemType, priceNgn: 0, unit: d.unit }
  })

  // Custom items (not in defaults)
  const customItems: PriceRow[] = (prices ?? [])
    .filter((p) => !DEFAULT_ITEMS.find((d) => d.itemType === p.itemType))
    .map((p) => ({ _id: p._id, itemType: p.itemType, priceNgn: p.priceNgn, unit: p.unit }))

  const setPricesCount = (prices ?? []).filter((p) => p.priceNgn > 0).length

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Price Settings</h1>
            <p className="mt-1 text-sm text-white/40">
              {prices === undefined ? 'Loading…' : `${setPricesCount} item type${setPricesCount !== 1 ? 's' : ''} with prices set`}
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setShowAdd(!showAdd)}>
            <Plus className="h-4 w-4" />
            Add Custom Item
          </Button>
        </div>

        {/* Success message */}
        {successMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {successMsg} — price saved
          </div>
        )}

        {/* Add custom item form */}
        {showAdd && (
          <Card>
            <CardHeader>
              <CardTitle>Add Custom Item Type</CardTitle>
              <CardDescription>Define a new service or item not in the standard list.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1">
                  <Input
                    label="Item name"
                    value={newItem.itemType}
                    onChange={(e) => setNewItem((f) => ({ ...f, itemType: e.target.value }))}
                    placeholder="e.g. Wedding Gown, Kaftan"
                  />
                </div>
                <div className="w-32">
                  <Input
                    label="Price (₦)"
                    type="number"
                    value={newItem.priceNgn}
                    onChange={(e) => setNewItem((f) => ({ ...f, priceNgn: e.target.value }))}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="w-32">
                  <Input
                    label="Unit"
                    value={newItem.unit}
                    onChange={(e) => setNewItem((f) => ({ ...f, unit: e.target.value }))}
                    placeholder="per piece"
                  />
                </div>
                <Button variant="primary" size="sm" onClick={handleAddCustom} disabled={addSaving}>
                  {addSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info banner */}
        <div className="flex items-start gap-3 rounded-xl bg-blue-500/8 border border-blue-500/15 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-300/80 leading-relaxed">
            Prices are used when adding items to orders during intake. Click <strong>Edit</strong> on any row to set or update the price. Changes take effect immediately for new orders.
          </p>
        </div>

        {/* Standard prices */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Tag className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Standard Items</CardTitle>
                <CardDescription>Click edit on any row to set the price per unit.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {prices === undefined ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-white/30">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading prices…
              </div>
            ) : (
              allItems.map((row) => (
                <PriceItem key={row.itemType} row={row} onSave={handleSave} />
              ))
            )}
          </CardContent>
        </Card>

        {/* Custom prices */}
        {customItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Custom Items</CardTitle>
              <CardDescription>Item types you added manually.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {customItems.map((row) => (
                <PriceItem key={row.itemType} row={row} onSave={handleSave} onRemove={handleRemove} />
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  )
}
