import type { ReactNode } from 'react'

const TEXTO = 'm-0 text-rotulo leading-relaxed text-texto'

export interface IAreaMediadorTextoProps {
  children: ReactNode
}

export function AreaMediadorTexto({ children }: IAreaMediadorTextoProps) {
  return <p className={TEXTO}>{children}</p>
}
