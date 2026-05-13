'use client'

import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { ArrowRight, ShieldCheck, Search, Package, CheckCircle2, Loader2, Shirt, Droplets, Clock } from 'lucide-react'

function statusConfig(status: string) {
  const map: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode; step: number }> = {
    'Awaiting Intake': {
      label: 'Awaiting Intake',
      color: 'text-amber-700',
      bg: 'bg-amber-50 border-amber-200',
      icon: <Package className="w-5 h-5 text-amber-600" />,
      step: 1,
    },
    'In Wash': {
      label: 'In Wash',
      color: 'text-blue-700',
      bg: 'bg-blue-50 border-blue-200',
      icon: <Droplets className="w-5 h-5 text-blue-600" />,
      step: 2,
    },
    'Ready for Pickup': {
      label: 'Ready for Pickup',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50 border-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      step: 3,
    },
    'Completed': {
      label: 'Completed',
      color: 'text-gray-600',
      bg: 'bg-gray-50 border-gray-200',
      icon: <CheckCircle2 className="w-5 h-5 text-gray-500" />,
      step: 4,
    },
  }
  return map[status] ?? map['Awaiting Intake']
}

const STEPS = ['Awaiting Intake', 'In Wash', 'Ready for Pickup', 'Completed']

function TrackingWidget() {
  const [code, setCode] = useState('')
  const [query, setQuery] = useState<string | null>(null)

  const result = useQuery(api.orders.getByCode, query ? { code: query.toUpperCase() } : 'skip')

  const handleTrack = () => {
    const trimmed = code.trim()
    if (trimmed) setQuery(trimmed)
  }

  const cfg = result && result !== null ? statusConfig(result.status) : null
  const currentStep = cfg ? STEPS.indexOf(result!.status) : -1

  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 p-6 md:p-8 w-full max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#0B7A75]/10 flex items-center justify-center">
          <Search className="w-5 h-5 text-[#0B7A75]" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-base">Track Your Order</h3>
          <p className="text-xs text-gray-500">Enter the reference code from your receipt</p>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
          placeholder="e.g. LS-4821-X7KQ"
          className="flex-1 h-12 rounded-xl border border-gray-200 px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#0B7A75] focus:ring-2 focus:ring-[#0B7A75]/10 transition-all"
        />
        <button
          onClick={handleTrack}
          className="h-12 px-5 bg-[#0B7A75] hover:bg-[#096b66] text-white font-semibold rounded-xl transition-colors flex items-center gap-2 text-sm"
        >
          Track
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Result */}
      {query && result === undefined && (
        <div className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-500 py-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          Looking up your order…
        </div>
      )}

      {query && result === null && (
        <div className="mt-5 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">
          No order found for <strong>{query.toUpperCase()}</strong>. Please check the reference code on your receipt.
        </div>
      )}

      {result && result !== null && cfg && (
        <div className="mt-5 space-y-4">
          {/* Status card */}
          <div className={`rounded-xl border p-4 ${cfg.bg}`}>
            <div className="flex items-center gap-3">
              {cfg.icon}
              <div>
                <p className={`font-bold text-sm ${cfg.color}`}>{cfg.label}</p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Order <strong>{result.code}</strong> — {result.customerName}
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              {STEPS.slice(0, 3).map((step, i) => (
                <div key={step} className="flex-1 flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    i <= currentStep
                      ? 'bg-[#0B7A75] border-[#0B7A75] text-white'
                      : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  <p className={`mt-1.5 text-[10px] font-medium text-center leading-tight max-w-[60px] ${
                    i <= currentStep ? 'text-[#0B7A75]' : 'text-gray-400'
                  }`}>{step.replace('Awaiting ', '')}</p>
                  {i < 2 && (
                    <div className={`absolute h-0.5 w-full top-3.5 left-1/2 ${i < currentStep ? 'bg-[#0B7A75]' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Items summary */}
          {result.items && result.items.length > 0 && (
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
              <p className="text-xs font-semibold text-gray-500 mb-2">
                {result.items.length} item{result.items.length !== 1 ? 's' : ''} in this order
              </p>
              <div className="space-y-1.5">
                {result.items.slice(0, 4).map((item: { tagId: string; name: string; status: string }) => (
                  <div key={item.tagId} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-gray-700">
                      <Shirt className="w-3 h-3 text-gray-400" />
                      {item.name}
                    </span>
                    <span className="text-gray-500 font-mono">{item.status}</span>
                  </div>
                ))}
                {result.items.length > 4 && (
                  <p className="text-xs text-gray-400">+{result.items.length - 4} more items</p>
                )}
              </div>
            </div>
          )}

          {result.dueAt && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              Expected ready: {new Date(result.dueAt).toLocaleDateString('en-NG', {
                weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[#0c1f3d] via-[#0F3460] to-[#0a2a50] text-white overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#0B7A75]/20 blur-3xl" />
        <div className="absolute top-20 right-0 w-80 h-80 rounded-full bg-[#0B7A75]/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-xs font-semibold text-white/90 mb-7 backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4ECDC4]" />
              Photo-verified · Tag-tracked · 100% accountable
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
              Your laundry,{' '}
              <span className="bg-gradient-to-r from-[#4ECDC4] to-[#0B7A75] bg-clip-text text-transparent">
                always safe.
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-white/70 leading-relaxed max-w-md">
              Every item you drop off is <span className="text-white font-medium">photographed, tagged, and tracked</span> through every wash cycle — so you always know exactly where your clothes are.
            </p>

            <div className="mt-8 flex flex-wrap gap-5 pt-8 border-t border-white/10">
              {[
                { label: 'Items tracked', value: '50,000+' },
                { label: 'Items lost', value: '0' },
                { label: 'Happy customers', value: '4.9 ★' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                  <p className="text-xs text-white/50 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: tracking widget */}
          <div className="flex justify-center lg:justify-end">
            <TrackingWidget />
          </div>
        </div>
      </div>
    </section>
  )
}
