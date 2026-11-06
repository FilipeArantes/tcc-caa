import type { ReactNode } from 'react'

const ACOES = 'flex flex-wrap justify-end gap-4'

export interface IDialogoAcoesProps {
  children: ReactNode
}

export function DialogoAcoes({ children }: IDialogoAcoesProps) {
  return <div className={ACOES}>{children}</div>
}
