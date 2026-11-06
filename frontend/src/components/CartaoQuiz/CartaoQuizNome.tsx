import type { ReactNode } from 'react'

const NOME = 'text-2xl font-bold leading-tight break-words text-texto'

export interface ICartaoQuizNomeProps {
  children: ReactNode
}

export function CartaoQuizNome({ children }: ICartaoQuizNomeProps) {
  return <span className={NOME}>{children}</span>
}
