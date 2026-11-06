import type { HTMLAttributes, ReactNode } from 'react'

const RAIZ = 'flex flex-wrap items-center gap-4'

export interface INavegacaoRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function NavegacaoRoot({ children, ...props }: INavegacaoRootProps) {
  return (
    <div {...props} className={RAIZ}>
      {children}
    </div>
  )
}
