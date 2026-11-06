import type { ReactNode } from 'react'

const ACOES = 'flex flex-col gap-3 sm:flex-row sm:flex-wrap'

export interface IAreaMediadorAcoesProps {
  children: ReactNode
}

export function AreaMediadorAcoes({ children }: IAreaMediadorAcoesProps) {
  return <div className={ACOES}>{children}</div>
}
