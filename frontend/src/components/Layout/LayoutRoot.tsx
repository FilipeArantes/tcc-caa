import type { HTMLAttributes, ReactNode } from 'react'

const RAIZ = 'flex h-dvh w-full overflow-hidden bg-fundo text-texto'

export interface ILayoutRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function LayoutRoot({ children, ...props }: ILayoutRootProps) {
  return (
    <div {...props} className={RAIZ}>
      {children}
    </div>
  )
}
