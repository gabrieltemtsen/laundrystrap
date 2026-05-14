import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/cn'

/* ─────────────────────────────────────────────
   Layout
───────────────────────────────────────────── */
export function Container(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('mx-auto w-full max-w-6xl px-4 md:px-6', props.className)} />
}

/* ─────────────────────────────────────────────
   Card
───────────────────────────────────────────── */
export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        'rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-card',
        props.className,
      )}
    />
  )
}

export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('border-b border-[var(--border)] px-5 py-4', props.className)} />
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('p-5', props.className)} />
}

export function CardTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 {...props} className={cn('text-base font-bold text-[var(--text)] tracking-tight', props.className)} />
}

export function CardDescription(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={cn('mt-1 text-sm text-[var(--muted)]', props.className)} />
}

/* ─────────────────────────────────────────────
   Stat Card — glow accent
───────────────────────────────────────────── */
export function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  trend,
  loading,
}: {
  label: string
  value?: number | string
  icon: React.ElementType
  accent: 'indigo' | 'cyan' | 'amber' | 'emerald' | 'purple' | 'rose'
  trend?: string
  loading?: boolean
}) {
  const accentMap: Record<string, { bg: string; text: string; glow: string; border: string }> = {
    indigo:  { bg: 'bg-indigo-500/10',  text: 'text-indigo-400',  glow: 'shadow-[0_0_20px_rgba(99,102,241,.2)]',  border: 'border-indigo-500/20'  },
    cyan:    { bg: 'bg-cyan-500/10',    text: 'text-cyan-400',    glow: 'shadow-[0_0_20px_rgba(6,182,212,.2)]',   border: 'border-cyan-500/20'    },
    amber:   { bg: 'bg-amber-500/10',   text: 'text-amber-400',   glow: 'shadow-[0_0_20px_rgba(245,158,11,.2)]',  border: 'border-amber-500/20'   },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', glow: 'shadow-[0_0_20px_rgba(16,185,129,.2)]',  border: 'border-emerald-500/20' },
    purple:  { bg: 'bg-purple-500/10',  text: 'text-purple-400',  glow: 'shadow-[0_0_20px_rgba(168,139,250,.2)]', border: 'border-purple-500/20'  },
    rose:    { bg: 'bg-rose-500/10',    text: 'text-rose-400',    glow: 'shadow-[0_0_20px_rgba(244,63,94,.2)]',   border: 'border-rose-500/20'    },
  }
  const a = accentMap[accent]

  return (
    <div className={cn('rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all hover:-translate-y-0.5', a.glow)}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', a.bg, 'border', a.border)}>
          <Icon className={cn('h-5 w-5', a.text)} />
        </div>
        {trend && <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg">{trend}</span>}
      </div>
      <div className="text-[var(--muted)] text-xs font-semibold uppercase tracking-widest mb-1">{label}</div>
      <div className={cn('text-3xl font-black text-[var(--text)]', loading && 'opacity-40')}>
        {loading ? '—' : (value ?? '—')}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Button
───────────────────────────────────────────── */
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

const btnBase =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:opacity-40 disabled:pointer-events-none select-none'

const btnVariants: Record<ButtonVariant, string> = {
  primary:   'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_4px_14px_rgba(99,102,241,.35)] hover:-translate-y-px active:translate-y-0',
  secondary: 'bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--surface-3)] border border-[var(--border)]',
  ghost:     'bg-transparent text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]',
  danger:    'bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/30',
}

const btnSizes: Record<ButtonSize, string> = {
  xs: 'h-7 px-2.5 text-xs',
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-sm',
}

export function Button({ className, variant = 'secondary', size = 'md', ...props }: ButtonProps) {
  return <button className={cn(btnBase, btnVariants[variant], btnSizes[size], className)} {...props} />
}

type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function ButtonLink({ className, variant = 'secondary', size = 'md', ...props }: ButtonLinkProps) {
  return <Link className={cn(btnBase, btnVariants[variant], btnSizes[size], className)} {...props} />
}

/* ─────────────────────────────────────────────
   Input / Textarea / Select
───────────────────────────────────────────── */
const inputBase =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm text-[var(--text)] placeholder:text-[var(--muted)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string }

export function Input({ className, label, hint, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-[var(--text-2)] uppercase tracking-wide">
          {label}
        </label>
      )}
      <input id={inputId} className={cn(inputBase, 'h-10', className)} {...props} />
      {hint && <div className="text-xs text-[var(--muted)]">{hint}</div>}
    </div>
  )
}

export function Textarea({
  className, label, hint, id, ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; hint?: string }) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-[var(--text-2)] uppercase tracking-wide">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(inputBase, 'min-h-[96px] py-2.5', className)}
        {...props}
      />
      {hint && <div className="text-xs text-[var(--muted)]">{hint}</div>}
    </div>
  )
}

export function Select({
  className, label, hint, id, children, ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; hint?: string }) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-[var(--text-2)] uppercase tracking-wide">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={cn(inputBase, 'h-10 cursor-pointer', className)}
        {...props}
      >
        {children}
      </select>
      {hint && <div className="text-xs text-[var(--muted)]">{hint}</div>}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Badge / Pill
───────────────────────────────────────────── */
type BadgeVariant = 'default' | 'success' | 'warn' | 'danger' | 'indigo' | 'cyan' | 'purple' | 'new'

export function Badge({
  className,
  variant = 'default',
  dot,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant; dot?: boolean }) {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-[var(--surface-3)] text-[var(--text-2)] border-[var(--border)]',
    indigo:  'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
    cyan:    'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
    success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    warn:    'bg-amber-500/15 text-amber-300 border-amber-500/25',
    danger:  'bg-red-500/15 text-red-300 border-red-500/25',
    purple:  'bg-purple-500/15 text-purple-300 border-purple-500/25',
    new:     'bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-cyan-300 border-cyan-500/30',
  }
  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[11px] font-bold tracking-wide',
        variants[variant],
        className,
      )}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 shrink-0" />}
      {props.children}
    </span>
  )
}

/* ─────────────────────────────────────────────
   Section header (used inside table/list)
───────────────────────────────────────────── */
export function SectionLabel(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn('px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]', props.className)}
    />
  )
}

/* ─────────────────────────────────────────────
   Divider
───────────────────────────────────────────── */
export function Divider({ className }: { className?: string }) {
  return <hr className={cn('border-[var(--border)]', className)} />
}

/* ─────────────────────────────────────────────
   Kbd
───────────────────────────────────────────── */
export function Kbd(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      {...props}
      className={cn(
        'inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted)]',
        props.className,
      )}
    />
  )
}

/* ─────────────────────────────────────────────
   Empty state
───────────────────────────────────────────── */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
        <Icon className="h-6 w-6 text-indigo-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
        {description && <p className="text-xs text-[var(--muted)] mt-1">{description}</p>}
      </div>
      {action}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Spinner
───────────────────────────────────────────── */
export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin text-indigo-400', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

/* ─────────────────────────────────────────────
   Page shell header (for inner pages)
───────────────────────────────────────────── */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[var(--text)]">{title}</h1>
        {description && <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
