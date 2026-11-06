import type { HTMLAttributes, ReactNode } from 'react'

const RAIZ = 'flex flex-col gap-6'

export interface IEscritaRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function EscritaRoot({ children, ...props }: IEscritaRootProps) {
  return (
    <div {...props} className={RAIZ}>
      {children}
    </div>
  )
}
