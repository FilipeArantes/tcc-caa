import type { HTMLAttributes, ReactNode } from 'react'

const CONTEUDO = 'relative flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-6 [&>*]:shrink-0'

export interface ILayoutConteudoProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
}

export function LayoutConteudo({ children, ...props }: ILayoutConteudoProps) {
  return (
    <main {...props} className={CONTEUDO}>
      {children}
    </main>
  )
}
