'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'

type SettingsTab = 'branch' | 'hours' | 'notifications' | 'danger'

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'branch',        label: 'Branch Settings'   },
  { id: 'hours',         label: 'Operating Hours'   },
  { id: 'notifications', label: 'Notifications'     },
  { id: 'danger',        label: 'Danger Zone'       },
]

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label className="text-[10.5px] uppercase tracking-widest text-[var(--muted)] font-semibold">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-[var(--muted)]">{hint}</p>}
    </div>
  )
}

function InputField({ value, placeholder, onChange }: { value: string; placeholder?: string; onChange?: (v: string) => void }) {
  return (
    <input value={value} placeholder={placeholder} onChange={(e) => onChange?.(e.target.value)}
      className="h-11 w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface-2)] px-3 text-[14px] text-[var(--text)] placeholder:text-[var(--muted)] outline-none focus:border-indigo-500 focus:shadow-[0_0_0_3px_var(--primary-glow)] transition-all" />
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full transition-all ${checked ? 'bg-indigo-600' : 'bg-[var(--surface-3)]'}`}>
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${checked ? 'left-5' : 'left-1'}`} />
    </button>
  )
}

export default function SettingsPage() {
  const [tab, setTab]           = useState<SettingsTab>('branch')
  const [branchName, setBranchName] = useState('Wuse II Branch')
  const [address, setAddress]   = useState('Plot 18, IBB Way, Wuse II, Abuja')
  const [phone, setPhone]       = useState('+234 901 234 5678')
  const [whatsapp, setWhatsapp] = useState(true)
  const [sms, setSms]           = useState(true)
  const [email, setEmail]       = useState(false)

  const HOURS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <AppShell>
      <div className="flex flex-col gap-5">

        {/* Page head */}
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-['Montserrat'] text-[30px] font-extrabold tracking-tight text-[var(--text)]">Settings</h1>
            <p className="text-[var(--muted)] text-[13.5px] mt-1">Configure your branch, hours, notifications, and integrations</p>
          </div>
          <button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-white text-[13px] font-semibold transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg,#6366F1,#7C3AED)', boxShadow: '0 4px 14px -4px rgba(99,102,241,.5)' }}>
            Save Changes
          </button>
        </div>

        <div className="flex gap-5 flex-col md:flex-row">
          {/* Sidebar nav */}
          <div className="md:w-48 shrink-0">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] p-2" style={{ boxShadow: 'var(--shadow-card)' }}>
              {TABS.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all ${
                    tab === t.id
                      ? 'bg-gradient-to-br from-indigo-500/18 to-indigo-500/6 text-white border border-indigo-500/35'
                      : 'text-[var(--text-2)] hover:bg-[rgba(255,255,255,.03)] hover:text-[var(--text)]'
                  } ${t.id === 'danger' ? 'mt-2 text-red-400/70 hover:text-red-400' : ''}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] p-[18px]" style={{ boxShadow: 'var(--shadow-card)' }}>

              {tab === 'branch' && (
                <>
                  <div className="font-bold text-[15px] text-[var(--text)] mb-4">Branch Settings</div>
                  <Field label="Branch Name"><InputField value={branchName} onChange={setBranchName} /></Field>
                  <Field label="Address"><InputField value={address} onChange={setAddress} /></Field>
                  <Field label="Phone Number"><InputField value={phone} onChange={setPhone} /></Field>
                  <Field label="WhatsApp Business Number"><InputField value="+234 901 234 5679" /></Field>
                  <Field label="Currency">
                    <select className="h-11 w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface-2)] px-3 text-[14px] text-[var(--text)] outline-none focus:border-indigo-500 transition-all">
                      <option>₦ Nigerian Naira (NGN)</option>
                    </select>
                  </Field>
                </>
              )}

              {tab === 'hours' && (
                <>
                  <div className="font-bold text-[15px] text-[var(--text)] mb-4">Operating Hours</div>
                  {HOURS.map((day) => (
                    <div key={day} className="flex items-center gap-4 py-3 border-b border-[var(--border)] last:border-0">
                      <div className="w-10 text-[13px] font-semibold text-[var(--text)]">{day}</div>
                      <Toggle checked={day !== 'Sun'} onChange={() => {}} />
                      <select className="h-9 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2 text-[13px] text-[var(--text)] outline-none">
                        <option>8:00 AM</option><option>9:00 AM</option>
                      </select>
                      <span className="text-[var(--muted)] text-[13px]">to</span>
                      <select className="h-9 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2 text-[13px] text-[var(--text)] outline-none">
                        <option>8:00 PM</option><option>6:00 PM</option>
                      </select>
                    </div>
                  ))}
                </>
              )}

              {tab === 'notifications' && (
                <>
                  <div className="font-bold text-[15px] text-[var(--text)] mb-4">Notification Channels</div>
                  {[
                    { label: 'WhatsApp Messages', sub: 'Send automated status updates via WhatsApp', val: whatsapp, set: setWhatsapp },
                    { label: 'SMS Fallback',      sub: 'Send SMS when WhatsApp delivery fails',      val: sms,      set: setSms      },
                    { label: 'Email Receipts',    sub: 'Send receipts and invoices via email',        val: email,    set: setEmail    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-4 border-b border-[var(--border)] last:border-0">
                      <div>
                        <div className="font-semibold text-[13.5px] text-[var(--text)]">{item.label}</div>
                        <div className="text-[11.5px] text-[var(--muted)] mt-0.5">{item.sub}</div>
                      </div>
                      <Toggle checked={item.val} onChange={item.set} />
                    </div>
                  ))}
                </>
              )}

              {tab === 'danger' && (
                <>
                  <div className="font-bold text-[15px] text-red-400 mb-4">Danger Zone</div>
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 mb-3">
                    <div className="font-semibold text-[var(--text)] mb-1">Reset All Data</div>
                    <div className="text-[12px] text-[var(--muted)] mb-3">Permanently delete all orders, customers, and items. This cannot be undone.</div>
                    <button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border border-red-500/30 bg-red-500/8 text-red-400 text-[13px] font-semibold hover:bg-red-500/15 transition-all">
                      Reset Branch Data
                    </button>
                  </div>
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                    <div className="font-semibold text-[var(--text)] mb-1">Delete Branch</div>
                    <div className="text-[12px] text-[var(--muted)] mb-3">Permanently delete this branch and all associated data from LaundryStrap.</div>
                    <button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border border-red-500/30 bg-red-500/8 text-red-400 text-[13px] font-semibold hover:bg-red-500/15 transition-all">
                      Delete Branch
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>

      </div>
    </AppShell>
  )
}
