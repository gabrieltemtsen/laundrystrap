import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        accent:  'var(--color-accent)',
        muted:   'var(--color-muted)',
        border:  'var(--color-border)',
        surface: 'var(--color-surface)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      boxShadow: {
        soft: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        glow: '0 0 0 1px rgba(99,102,241,0.1), 0 8px 40px rgba(99,102,241,0.12), 0 4px 16px rgba(0,0,0,0.08)',
        card: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
}
export default config
