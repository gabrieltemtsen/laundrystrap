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
        'rounded-lg border border-border/80 bg-white/5 shadow-soft backdrop-blur supports-[backdrop-filter]:bg-white/5',
        props.className,
      )}
    />
  )
}

export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('border-b border-border/60 p-4', props.className)} />
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('p-4', props.className)} />
}

export function CardTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 {...props} className={cn('text-base font-semibold tracking-tight', props.className)} />
}

export function CardDescription(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={cn('mt-1 text-sm text-muted', props.className)} />
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ className, variant = 'secondary', size = 'md', ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none'
  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-white/10 text-white hover:bg-white/15 border border-border/60',
    ghost: 'bg-transparent text-white hover:bg-white/10',
    danger: 'bg-red-500/90 text-white hover:bg-red-500',
  }
  const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'h-9 px-3 text-sm',
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
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-white/10 text-white hover:bg-white/15 border border-border/60',
    ghost: 'bg-transparent text-white hover:bg-white/10',
    danger: 'bg-red-500/90 text-white hover:bg-red-500',
  }
  const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-base',
  }

  return <Link className={cn(base, variants[variant], sizes[size], className)} {...props} />
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string }

export function Input({ className, label, hint, ...props }: InputProps) {
  return (
    <label className="block">
      {label ? <div className="mb-1 text-sm font-medium text-white/90">{label}</div> : null}
      <input
        className={cn(
          'h-10 w-full rounded-md border border-border/60 bg-black/20 px-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20',
          className,
        )}
        {...props}
      />
      {hint ? <div className="mt-1 text-xs text-muted">{hint}</div> : null}
    </label>
  )
}

export function Textarea({ className, label, hint, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; hint?: string }) {
  return (
    <label className="block">
      {label ? <div className="mb-1 text-sm font-medium text-white/90">{label}</div> : null}
      <textarea
        className={cn(
          'min-h-[96px] w-full rounded-md border border-border/60 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20',
          className,
        )}
        {...props}
      />
      {hint ? <div className="mt-1 text-xs text-muted">{hint}</div> : null}
    </label>
  )
}

export function Badge({ className, variant = 'default', ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'success' | 'warn' | 'danger' }) {
  const variants: Record<string, string> = {
    default: 'bg-white/10 text-white border-border/60',
    success: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30',
    warn: 'bg-amber-500/15 text-amber-200 border-amber-500/30',
    danger: 'bg-red-500/15 text-red-200 border-red-500/30',
  }
  return (
    <span
      {...props}
      className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', variants[variant], className)}
    />
  )
}

export function Kbd(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      {...props}
      className={cn(
        'inline-flex items-center rounded-md border border-border/60 bg-black/30 px-2 py-1 font-mono text-[11px] text-white/80',
        props.className,
      )}
    />
  )
}
