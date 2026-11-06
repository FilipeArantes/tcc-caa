import type { ReactNode } from 'react'

const DETALHE = 'text-rotulo text-discreto'

export interface ICartaoQuizDetalheProps {
  children: ReactNode
}

export function CartaoQuizDetalhe({ children }: ICartaoQuizDetalheProps) {
  return <span className={DETALHE}>{children}</span>
}
