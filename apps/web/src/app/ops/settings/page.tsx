'use client'

import { AppShell } from '@/components/app-shell'
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Input, PageHeader, Divider } from '@/components/ui'
import { Settings, Save, Building2, Bell, Palette, Shield, Wifi, Clock } from 'lucide-react'

const SECTIONS = [
  {
    id: 'branch',
    icon: Building2,
    title: 'Branch Settings',
    description: 'Configure your branch details and operating information.',
    fields: [
      { label: 'Branch Name', placeholder: 'e.g. Wuse II Branch', defaultValue: 'Wuse II Branch' },
      { label: 'Address', placeholder: 'Full address', defaultValue: '14 Aminu Kano Crescent, Wuse II, Abuja' },
      { label: 'Phone Number', placeholder: '+234…', defaultValue: '+234 801 234 5678' },
      { label: 'Email', placeholder: 'branch@laundrystrap.com', defaultValue: 'wuse2@laundrystrap.com' },
    ],
  },
  {
    id: 'hours',
    icon: Clock,
    title: 'Operating Hours',
    description: 'Set your opening and closing times for each day.',
    fields: [
      { label: 'Weekdays Open', placeholder: '08:00', defaultValue: '07:00 AM' },
      { label: 'Weekdays Close', placeholder: '20:00', defaultValue: '08:00 PM' },
      { label: 'Weekend Open', placeholder: '09:00', defaultValue: '08:00 AM' },
      { label: 'Weekend Close', placeholder: '18:00', defaultValue: '06:00 PM' },
    ],
  },
  {
    id: 'notifications',
    icon: Bell,
    title: 'Notifications',
    description: 'Configure automated customer notifications.',
    fields: [
      { label: 'SMS Sender Name', placeholder: 'LaundryStrap', defaultValue: 'LaundryStrap' },
      { label: 'WhatsApp Number', placeholder: '+234…', defaultValue: '+234 801 234 5678' },
    ],
  },
]

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Settings"
          description="Manage branch configuration and system preferences."
          actions={
            <Button variant="primary" size="sm">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          }
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Settings nav */}
          <div>
            <Card>
              <CardContent className="p-2">
                {SECTIONS.map((s) => {
                  const Icon = s.icon
                  return (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-2)] transition-all"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {s.title}
                    </a>
                  )
                })}
                <Divider className="my-2" />
                <a href="#security" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-2)] transition-all">
                  <Shield className="h-4 w-4 shrink-0" />
                  Security
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Settings forms */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {SECTIONS.map((s) => {
              const Icon = s.icon
              return (
                <Card key={s.id} id={s.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-indigo-400" />
                      </div>
                      <div>
                        <CardTitle>{s.title}</CardTitle>
                        <CardDescription>{s.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {s.fields.map((f) => (
                        <Input
                          key={f.label}
                          label={f.label}
                          placeholder={f.placeholder}
                          defaultValue={f.defaultValue}
                        />
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="primary" size="sm">
                        <Save className="h-3.5 w-3.5" />
                        Save {s.title}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {/* Danger zone */}
            <Card id="security">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                    <Shield className="h-4 w-4 text-red-400" />
                  </div>
                  <div>
                    <CardTitle className="text-red-400">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions — proceed with caution.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">Reset All Data</p>
                    <p className="text-xs text-[var(--muted)] mt-0.5">Permanently delete all orders, customers and items. This cannot be undone.</p>
                  </div>
                  <Button variant="danger" size="sm">Reset Data</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
