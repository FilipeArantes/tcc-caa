import type { HTMLAttributes, ReactNode } from 'react'

const RAIZ = 'm-0 flex list-none flex-wrap gap-3 p-0'

export interface IConquistasRootProps extends HTMLAttributes<HTMLUListElement> {
  rotulo: string
  children: ReactNode
}

export function ConquistasRoot({ rotulo, children, ...props }: IConquistasRootProps) {
  return (
    <ul {...props} aria-label={rotulo} className={RAIZ}>
      {children}
    </ul>
  )
}
