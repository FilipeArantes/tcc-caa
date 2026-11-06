import type { ReactNode } from 'react'

const TITULO = 'm-0 text-3xl font-bold text-texto'

export interface IDialogoTituloProps {
  children: ReactNode
}

export function DialogoTitulo({ children }: IDialogoTituloProps) {
  return <h2 className={TITULO}>{children}</h2>
}
