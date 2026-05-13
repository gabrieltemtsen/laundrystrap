import type { ReactNode } from 'react'

export default function OpsLayout({ children }: { children: ReactNode }) {
  return <div className="ops-root">{children}</div>
}
