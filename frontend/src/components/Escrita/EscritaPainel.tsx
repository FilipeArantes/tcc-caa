import type { HTMLAttributes, ReactNode } from 'react'

const PAINEL =
  'sticky top-0 z-10 flex flex-wrap items-center gap-4 rounded-2xl border ' +
  'border-borda bg-surface p-4 shadow-sm'

export interface IEscritaPainelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function EscritaPainel({ children, ...props }: IEscritaPainelProps) {
  return (
    <div {...props} className={PAINEL}>
      {children}
    </div>
  )
}
