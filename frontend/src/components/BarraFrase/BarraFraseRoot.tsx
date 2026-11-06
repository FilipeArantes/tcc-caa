import type { HTMLAttributes, ReactNode } from 'react'

const RAIZ =
  'sticky top-0 z-10 flex flex-wrap items-center gap-4 rounded-2xl border ' +
  'border-borda bg-surface p-4 shadow-sm'

export interface IBarraFraseRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function BarraFraseRoot({ children, ...props }: IBarraFraseRootProps) {
  return (
    <div {...props} aria-label="Frase em construção" className={RAIZ}>
      {children}
    </div>
  )
}
