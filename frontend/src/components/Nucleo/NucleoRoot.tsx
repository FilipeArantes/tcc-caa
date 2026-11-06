import type { HTMLAttributes, ReactNode } from 'react'

const RAIZ =
  'grid grid-cols-4 gap-1.5 rounded-2xl border border-borda bg-surface p-2 sm:gap-3 sm:p-3 lg:grid-cols-8'

export interface INucleoRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function NucleoRoot({ children, ...props }: INucleoRootProps) {
  return (
    <div {...props} aria-label="Palavras mais usadas" className={RAIZ}>
      {children}
    </div>
  )
}
