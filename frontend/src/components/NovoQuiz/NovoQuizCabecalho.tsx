import type { ReactNode } from 'react'

export interface INovoQuizCabecalhoProps {
  children: ReactNode
}

export function NovoQuizCabecalho({ children }: INovoQuizCabecalhoProps) {
  return <h1 className="m-0 text-3xl font-bold leading-tight text-texto">{children}</h1>
}
