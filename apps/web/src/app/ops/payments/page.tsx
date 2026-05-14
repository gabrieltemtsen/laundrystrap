'use client'

import { AppShell } from '@/components/app-shell'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, CardDescription, PageHeader, StatCard } from '@/components/ui'
import { CreditCard, TrendingUp, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

const MOCK_PAYMENTS = [
  { id: 'PAY-001', order: 'LS-0042', customer: 'Amaka Obi',    amount: 4500,  method: 'Transfer', status: 'paid',    date: 'Today 09:14' },
  { id: 'PAY-002', order: 'LS-0041', customer: 'Emeka Nwosu',  amount: 6200,  method: 'Cash',     status: 'paid',    date: 'Today 08:52' },
  { id: 'PAY-003', order: 'LS-0040', customer: 'Ngozi Adeyemi',amount: 3800,  method: 'Transfer', status: 'pending', date: 'Yesterday'   },
  { id: 'PAY-004', order: 'LS-0039', customer: 'Chidi Eze',    amount: 8100,  method: 'Card',     status: 'pending', date: 'Yesterday'   },
  { id: 'PAY-005', order: 'LS-0038', customer: 'Fatima Bello', amount: 2900,  method: 'Transfer', status: 'overdue', date: '2 days ago'  },
  { id: 'PAY-006', order: 'LS-0037', customer: 'Bola Adewale', amount: 5500,  method: 'Cash',     status: 'paid',    date: '2 days ago'  },
  { id: 'PAY-007', order: 'LS-0036', customer: 'Kemi Okafor',  amount: 7200,  method: 'Transfer', status: 'overdue', date: '3 days ago'  },
]

function StatusBadge({ status }: { status: string }) {
  if (status === 'paid')    return <Badge variant="success" dot>Paid</Badge>
  if (status === 'pending') return <Badge variant="warn" dot>Pending</Badge>
  if (status === 'overdue') return <Badge variant="danger" dot>Overdue</Badge>
  return <Badge>{status}</Badge>
}

export default function PaymentsPage() {
  const totalPaid    = MOCK_PAYMENTS.filter(p => p.status === 'paid').reduce((a, p) => a + p.amount, 0)
  const totalPending = MOCK_PAYMENTS.filter(p => p.status === 'pending').reduce((a, p) => a + p.amount, 0)
  const totalOverdue = MOCK_PAYMENTS.filter(p => p.status === 'overdue').reduce((a, p) => a + p.amount, 0)

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Payments"
          description="Track collections, outstanding balances, and revenue."
          actions={
            <Button variant="primary" size="sm">
              <DollarSign className="h-4 w-4" />
              Record Payment
            </Button>
          }
        />

        {/* Stats */}
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          <StatCard label="Revenue Today"   value={`₦${(totalPaid / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}    icon={TrendingUp}   accent="emerald" />
          <StatCard label="Pending"         value={`₦${(totalPending / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`} icon={Clock}        accent="amber"   />
          <StatCard label="Overdue"         value={totalOverdue > 0 ? `₦${(totalOverdue / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : '₦0'} icon={AlertCircle}  accent="rose"    />
          <StatCard label="Transactions"    value={MOCK_PAYMENTS.length}                                                           icon={CreditCard}   accent="indigo"  />
        </div>

        {/* Payments table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>All payment records for this period.</CardDescription>
              </div>
              <Badge variant="warn" dot>{MOCK_PAYMENTS.filter(p => p.status === 'pending' || p.status === 'overdue').length} outstanding</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="grid grid-cols-12 gap-2 border-b border-[var(--border)] px-5 py-2.5 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">
                <div className="col-span-3">Customer</div>
                <div className="col-span-2">Order</div>
                <div className="col-span-2">Method</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2 text-right">Amount</div>
                <div className="col-span-1 text-right">Date</div>
              </div>
              {MOCK_PAYMENTS.map((p) => (
                <div key={p.id} className="grid grid-cols-12 gap-2 border-b border-[var(--border)]/60 px-5 py-4 text-sm hover:bg-[var(--surface-2)] transition-all last:border-0">
                  <div className="col-span-3 font-semibold text-[var(--text)]">{p.customer}</div>
                  <div className="col-span-2 font-mono text-xs text-[var(--muted)] flex items-center">{p.order}</div>
                  <div className="col-span-2 text-[var(--muted)] text-xs flex items-center">{p.method}</div>
                  <div className="col-span-2 flex items-center"><StatusBadge status={p.status} /></div>
                  <div className="col-span-2 text-right font-black text-[var(--text)] font-mono flex items-center justify-end" style={{ color: 'var(--naira)' }}>
                    ₦{p.amount.toLocaleString()}
                  </div>
                  <div className="col-span-1 text-right text-xs text-[var(--muted)] flex items-center justify-end">{p.date}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
