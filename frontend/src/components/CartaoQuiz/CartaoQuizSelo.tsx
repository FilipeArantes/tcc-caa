import type { ReactNode } from 'react'

const SELO = 'mt-auto rounded-full bg-primary-soft px-3 py-1 text-base font-bold text-primary'

export interface ICartaoQuizSeloProps {
  children: ReactNode
}

export function CartaoQuizSelo({ children }: ICartaoQuizSeloProps) {
  return <span className={SELO}>{children}</span>
}
