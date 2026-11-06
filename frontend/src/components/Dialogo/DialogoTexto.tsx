import type { ReactNode } from 'react'

const TEXTO = 'm-0 text-entrada leading-snug text-texto'

export interface IDialogoTextoProps {
  children: ReactNode
}

export function DialogoTexto({ children }: IDialogoTextoProps) {
  return <p className={TEXTO}>{children}</p>
}
