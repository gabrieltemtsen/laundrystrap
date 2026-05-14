'use client'

import { AppShell } from '@/components/app-shell'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, CardDescription, PageHeader, StatCard } from '@/components/ui'
import { MessageSquare, Send, CheckCheck, Clock, Users, Bell } from 'lucide-react'

const MESSAGES = [
  { id: 1, customer: 'Amaka Obi',     message: 'Your order LS-0042 is ready for pickup!', time: '10:32 AM', type: 'sms', status: 'delivered' },
  { id: 2, customer: 'Emeka Nwosu',   message: 'Your clothes are in the wash. Est. ready: 3 PM', time: '09:45 AM', type: 'sms', status: 'delivered' },
  { id: 3, customer: 'Ngozi Adeyemi', message: 'Reminder: Your order is due for pickup today.', time: '08:00 AM', type: 'sms', status: 'delivered' },
  { id: 4, customer: 'Chidi Eze',     message: 'Order LS-0039 received. Thank you!', time: 'Yesterday', type: 'whatsapp', status: 'read' },
  { id: 5, customer: 'Fatima Bello',  message: 'Your order LS-0038 is overdue. Please pick up.', time: 'Yesterday', type: 'sms', status: 'pending' },
]

const TEMPLATES = [
  { id: 1, name: 'Order Ready',    preview: 'Your order {code} is ready for pickup!',           used: 42 },
  { id: 2, name: 'Order Received', preview: 'We received your clothes. Order ID: {code}.',       used: 38 },
  { id: 3, name: 'In Progress',    preview: 'Your order {code} is being processed. Est: {time}', used: 28 },
  { id: 4, name: 'Overdue Pickup', preview: 'Reminder: Please pick up order {code} today.',      used: 12 },
]

function StatusBadge({ status }: { status: string }) {
  if (status === 'delivered') return <Badge variant="success" dot>Delivered</Badge>
  if (status === 'read')      return <Badge variant="indigo" dot>Read</Badge>
  if (status === 'pending')   return <Badge variant="warn" dot>Pending</Badge>
  return <Badge>{status}</Badge>
}

export default function CommsPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Communications"
          description="Send SMS and WhatsApp updates to customers."
          actions={
            <Button variant="primary" size="sm">
              <Send className="h-4 w-4" />
              Bulk Message
            </Button>
          }
        />

        {/* Stats */}
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          <StatCard label="Sent Today"    value={MESSAGES.filter(m => m.time.includes('AM') || m.time.includes('PM')).length} icon={Send}    accent="indigo" />
          <StatCard label="Delivered"     value={MESSAGES.filter(m => m.status === 'delivered').length}                       icon={CheckCheck} accent="emerald" />
          <StatCard label="Pending"       value={MESSAGES.filter(m => m.status === 'pending').length}                          icon={Clock}   accent="amber"  />
          <StatCard label="Subscribers"   value={84}                                                                            icon={Users}   accent="purple" />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Message log */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Message Log</CardTitle>
                <CardDescription>Recent notifications sent to customers.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {MESSAGES.map((m) => (
                  <div key={m.id} className="flex items-start gap-3 border-b border-[var(--border)]/60 px-5 py-4 hover:bg-[var(--surface-2)] transition-all last:border-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${m.type === 'whatsapp' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-indigo-500/10 border border-indigo-500/20'}`}>
                      <MessageSquare className={`h-3.5 w-3.5 ${m.type === 'whatsapp' ? 'text-emerald-400' : 'text-indigo-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-[var(--text)]">{m.customer}</span>
                        <span className="text-[10px] text-[var(--muted)]">{m.time}</span>
                      </div>
                      <p className="text-xs text-[var(--muted)] mt-0.5 truncate">{m.message}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <StatusBadge status={m.status} />
                        <span className="text-[10px] text-[var(--muted)] uppercase">{m.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Templates */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Templates</CardTitle>
                  <button className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">+ New</button>
                </div>
                <CardDescription>Quick-send message templates.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {TEMPLATES.map((t) => (
                  <div key={t.id} className="border-b border-[var(--border)]/60 px-4 py-3 hover:bg-[var(--surface-2)] transition-all last:border-0 cursor-pointer group">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-semibold text-[var(--text)]">{t.name}</span>
                      <Badge variant="default">{t.used}×</Badge>
                    </div>
                    <p className="text-xs text-[var(--muted)] truncate">{t.preview}</p>
                    <button className="mt-2 text-[10px] font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <Send className="h-3 w-3" /> Use Template
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
