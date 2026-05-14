import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   'var(--primary)',
        'primary-2': 'var(--primary-2)',
        surface:   'var(--surface)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',
        border:    'var(--border)',
        'border-strong': 'var(--border-strong)',
        muted:     'var(--muted)',
        'text-2':  'var(--text-2)',
      },
      fontFamily: {
        sans:  ['var(--font-sans)', 'Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        mono:  ['var(--font-mono)', 'Geist Mono', 'monospace'],
        display: ['var(--font-sans)', 'Montserrat', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        glow: 'var(--shadow-glow)',
        card: 'var(--shadow-card)',
        soft: '0 1px 3px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
export default config
