import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/cn'

export function Container(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('mx-auto w-full max-w-6xl px-4 md:px-6', props.className)} />
}

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        'rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden',
        props.className,
      )}
    />
  )
}

export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('border-b border-zinc-800 px-5 py-4', props.className)} />
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('p-5', props.className)} />
}

export function CardTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 {...props} className={cn('text-base font-bold text-white tracking-tight', props.className)} />
}

export function CardDescription(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={cn('mt-1 text-sm text-zinc-500', props.className)} />
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ className, variant = 'secondary', size = 'md', ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:opacity-40 disabled:pointer-events-none'
  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:   'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 hover:-translate-y-px',
    secondary: 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700',
    ghost:     'bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200',
    danger:    'bg-red-600 text-white hover:bg-red-700',
  }
  const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-base',
  }

  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
}

type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
  className?: string
}

export function ButtonLink({ className, variant = 'secondary', size = 'md', ...props }: ButtonLinkProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50'
  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:   'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 hover:-translate-y-px',
    secondary: 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700',
    ghost:     'bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200',
    danger:    'bg-red-600 text-white hover:bg-red-700',
  }
  const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-base',
  }

  return <Link className={cn(base, variants[variant], sizes[size], className)} {...props} />
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string }

export function Input({ className, label, hint, ...props }: InputProps) {
  return (
    <label className="block">
      {label && (
        <div className="mb-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wide">{label}</div>
      )}
      <input
        className={cn(
          'h-10 w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all',
          className,
        )}
        {...props}
      />
      {hint && <div className="mt-1 text-xs text-zinc-500">{hint}</div>}
    </label>
  )
}

export function Textarea({
  className, label, hint, ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; hint?: string }) {
  return (
    <label className="block">
      {label && (
        <div className="mb-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wide">{label}</div>
      )}
      <textarea
        className={cn(
          'min-h-[96px] w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all',
          className,
        )}
        {...props}
      />
      {hint && <div className="mt-1 text-xs text-zinc-500">{hint}</div>}
    </label>
  )
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'success' | 'warn' | 'danger' | 'indigo'
}) {
  const variants: Record<string, string> = {
    default: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    indigo:  'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    warn:    'bg-amber-500/15 text-amber-300 border-amber-500/30',
    danger:  'bg-red-500/15 text-red-300 border-red-500/30',
  }
  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold',
        variants[variant],
        className,
      )}
    />
  )
}

export function Kbd(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      {...props}
      className={cn(
        'inline-flex items-center rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 font-mono text-[11px] text-zinc-400',
        props.className,
      )}
    />
  )
}
