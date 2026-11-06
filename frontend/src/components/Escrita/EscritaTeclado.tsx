import type { HTMLAttributes, ReactNode } from 'react'

const TECLADO = 'grid grid-cols-[repeat(auto-fill,minmax(5rem,1fr))] gap-3'

export interface IEscritaTecladoProps extends HTMLAttributes<HTMLDivElement> {
  rotulo: string
  children: ReactNode
}

export function EscritaTeclado({ rotulo, children, ...props }: IEscritaTecladoProps) {
  return (
    <div {...props} role="group" aria-label={rotulo} className={TECLADO}>
      {children}
    </div>
  )
}
