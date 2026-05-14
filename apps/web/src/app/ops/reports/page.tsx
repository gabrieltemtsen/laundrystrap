'use client'

import { AppShell } from '@/components/app-shell'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, CardDescription, PageHeader, StatCard } from '@/components/ui'
import { BarChart3, TrendingUp, Users, ShoppingBag, Download, Calendar } from 'lucide-react'

const WEEKLY = [
  { day: 'Mon', orders: 8,  revenue: 36200 },
  { day: 'Tue', orders: 12, revenue: 54800 },
  { day: 'Wed', orders: 7,  revenue: 31500 },
  { day: 'Thu', orders: 15, revenue: 67400 },
  { day: 'Fri', orders: 18, revenue: 81200 },
  { day: 'Sat', orders: 22, revenue: 99000 },
  { day: 'Sun', orders: 6,  revenue: 27000 },
]

const MAX_REVENUE = Math.max(...WEEKLY.map(d => d.revenue))

export default function ReportsPage() {
  const totalRevenue = WEEKLY.reduce((a, d) => a + d.revenue, 0)
  const totalOrders  = WEEKLY.reduce((a, d) => a + d.orders, 0)

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Reports"
          description="Weekly performance overview and business analytics."
          actions={
            <>
              <button className="h-8 px-3 text-xs inline-flex items-center gap-2 rounded-xl font-semibold transition-all bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--surface-3)] border border-[var(--border)]">
                <Calendar className="h-3.5 w-3.5" />
                This Week
              </button>
              <Button variant="secondary" size="sm">
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </Button>
            </>
          }
        />

        {/* Stats */}
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          <StatCard label="Weekly Revenue"  value={`₦${totalRevenue.toLocaleString()}`}          icon={TrendingUp}  accent="emerald" trend="+18%" />
          <StatCard label="Total Orders"    value={totalOrders}                                    icon={ShoppingBag} accent="indigo"  trend="+12%" />
          <StatCard label="Avg. Order Value" value={`₦${Math.round(totalRevenue / totalOrders).toLocaleString()}`} icon={BarChart3}  accent="cyan" />
          <StatCard label="Repeat Customers" value="64%"                                            icon={Users}       accent="purple"  trend="+5%" />
        </div>

        {/* Revenue chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Revenue</CardTitle>
            <CardDescription>Revenue breakdown for the current week.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-40">
              {WEEKLY.map((d) => {
                const h = (d.revenue / MAX_REVENUE) * 100
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full flex items-end justify-center" style={{ height: '120px' }}>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400 opacity-80 group-hover:opacity-100 transition-all cursor-pointer"
                        style={{ height: `${h}%`, minHeight: 4 }}
                        title={`₦${d.revenue.toLocaleString()}`}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[var(--muted)]">{d.day}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Orders per day */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Day</CardTitle>
            <CardDescription>Number of orders processed each day this week.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="grid grid-cols-7 border-b border-[var(--border)] px-5 py-2.5 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">
                {WEEKLY.map(d => <div key={d.day} className="text-center">{d.day}</div>)}
              </div>
              <div className="grid grid-cols-7 px-5 py-5">
                {WEEKLY.map(d => (
                  <div key={d.day} className="flex flex-col items-center gap-1">
                    <span className="text-xl font-black text-[var(--text)]">{d.orders}</span>
                    <span className="text-[10px] text-[var(--muted)]">₦{(d.revenue / 1000).toFixed(0)}k</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
