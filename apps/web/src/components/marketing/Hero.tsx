'use client'

import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { OrderWithItems } from '@/lib/types'
import {
  ArrowRight, Search, Package, CheckCircle2,
  Loader2, Shirt, Droplets, Clock, Sparkles,
} from 'lucide-react'

function statusConfig(status: string) {
  const map: Record<string, { label: string; color: string; bg: string; dot: string; step: number }> = {
    'Awaiting Intake':  { label: 'Awaiting Intake',  color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',   dot: 'bg-amber-400',   step: 0 },
    'In Wash':          { label: 'In Wash',           color: 'text-indigo-700',  bg: 'bg-indigo-50 border-indigo-200', dot: 'bg-indigo-500',  step: 1 },
    'Ready for Pickup': { label: 'Ready for Pickup',  color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', step: 2 },
    'Completed':        { label: 'Completed',         color: 'text-zinc-600',    bg: 'bg-zinc-50 border-zinc-200',     dot: 'bg-zinc-400',    step: 3 },
  }
  return map[status] ?? map['Awaiting Intake']
}

const STEPS = ['Awaiting Intake', 'In Wash', 'Ready for Pickup', 'Completed']

function TrackingWidget() {
  const [code, setCode]   = useState('')
  const [query, setQuery] = useState<string | null>(null)

  const resultRaw = useQuery(api.orders.getByCode, query ? { code: query.toUpperCase() } : 'skip')
  const result    = resultRaw as OrderWithItems | null | undefined

  const handleTrack = () => {
    const trimmed = code.trim()
    if (trimmed) setQuery(trimmed)
  }

  const cfg         = result && result !== null ? statusConfig(result.status) : null
  const currentStep = cfg ? STEPS.indexOf(result!.status) : -1

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl overflow-hidden border border-zinc-100"
      style={{ boxShadow: '0 4px 32px rgba(99,102,241,0.10), 0 1px 4px rgba(0,0,0,0.06)' }}>
      {/* Gradient header */}
      <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Search className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Track Your Order</p>
            <p className="text-white/70 text-xs mt-0.5">Enter the code from your receipt</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Input row */}
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            placeholder="e.g. LS-4821-X7KQ"
            className="flex-1 h-11 rounded-xl border border-zinc-200 px-4 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all bg-zinc-50"
          />
          <button
            onClick={handleTrack}
            className="h-11 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2 text-sm"
            style={{ boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}
          >
            Track <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Loading */}
        {query && result === undefined && (
          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-zinc-400 py-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            Looking up your order…
          </div>
        )}

        {/* Not found */}
        {query && result === null && (
          <div className="mt-4 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">
            No order found for <strong>{query.toUpperCase()}</strong>. Check the code on your receipt.
          </div>
        )}

        {/* Found */}
        {result && result !== null && cfg && (
          <div className="mt-5 space-y-4">
            <div className={`rounded-xl border p-4 ${cfg.bg}`}>
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`} />
                <div className="flex-1">
                  <p className={`font-bold text-sm ${cfg.color}`}>{cfg.label}</p>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Order <strong>{result.code}</strong> — {result.customerName}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress steps */}
            <div className="flex items-start gap-0 relative">
              {STEPS.slice(0, 3).map((step, i) => (
                <div key={step} className="flex-1 flex flex-col items-center relative">
                  {i < 2 && (
                    <div
                      className="absolute top-3.5 left-1/2 w-full h-0.5 z-0"
                      style={{ background: i < currentStep ? '#6366F1' : '#e4e4e7' }}
                    />
                  )}
                  <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    i <= currentStep
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white border-zinc-200 text-zinc-400'
                  }`}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  <p className={`mt-1.5 text-[10px] font-medium text-center leading-tight max-w-[64px] ${
                    i <= currentStep ? 'text-indigo-600' : 'text-zinc-400'
                  }`}>
                    {step.replace('Awaiting ', '')}
                  </p>
                </div>
              ))}
            </div>

            {/* Items list */}
            {result.items && result.items.length > 0 && (
              <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-3">
                <p className="text-xs font-semibold text-zinc-500 mb-2">
                  {result.items.length} item{result.items.length !== 1 ? 's' : ''} in this order
                </p>
                <div className="space-y-1.5">
                  {result.items.slice(0, 4).map((item: { tagId: string; name: string; status: string }) => (
                    <div key={item.tagId} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-zinc-700">
                        <Shirt className="w-3 h-3 text-zinc-400" />
                        {item.name}
                      </span>
                      <span className="text-zinc-400 font-mono">{item.status}</span>
                    </div>
                  ))}
                  {result.items.length > 4 && (
                    <p className="text-xs text-zinc-400">+{result.items.length - 4} more items</p>
                  )}
                </div>
              </div>
            )}

            {result.dueAt && (
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Expected ready: {new Date(result.dueAt).toLocaleDateString('en-NG', {
                  weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </div>
            )}
          </div>
        )}

        {!query && (
          <p className="mt-4 text-center text-xs text-zinc-400">
            Your code looks like{' '}
            <span className="font-mono font-semibold text-zinc-600">LS-XXXX-XXXX</span> — check your receipt.
          </p>
        )}
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-indigo-50/80 blur-3xl" />
        <div className="absolute bottom-0 -left-24 w-[450px] h-[450px] rounded-full bg-cyan-50/70 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: 'radial-gradient(circle, #6366F1 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full px-4 py-1.5 text-xs font-semibold mb-7">
              <Sparkles className="w-3.5 h-3.5" />
              Photo-verified · Tag-tracked · 100% accountable
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-[64px] font-black tracking-tight leading-[0.95]">
              Your laundry,{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                always safe.
              </span>
            </h1>

            <p className="mt-6 text-lg text-zinc-500 leading-relaxed max-w-md">
              Every item you drop off is{' '}
              <span className="text-zinc-800 font-semibold">photographed, tagged, and tracked</span>{' '}
              through every wash cycle — so you always know exactly where your clothes are.
            </p>

            <div className="mt-10 flex flex-wrap gap-8 pt-8 border-t border-zinc-100">
              {[
                { value: '50,000+', label: 'Items tracked' },
                { value: '0',       label: 'Items lost' },
                { value: '4.9 ★',   label: 'Customer rating' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-black text-zinc-900">{s.value}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: widget */}
          <div className="flex justify-center lg:justify-end">
            <TrackingWidget />
          </div>

        </div>
      </div>
    </section>
  )
}
