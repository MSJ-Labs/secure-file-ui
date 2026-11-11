import type { ReactNode } from 'react'

export function Card({ children, narrow = false }: { children: ReactNode; narrow?: boolean }) {
  return (
    <section
      className={`mx-4 mb-12 rounded-2xl border border-line bg-surface p-6 sm:mx-auto ${narrow ? 'mt-12 max-w-sm' : 'mt-4 max-w-3xl'}`}
    >
      {children}
    </section>
  )
}
