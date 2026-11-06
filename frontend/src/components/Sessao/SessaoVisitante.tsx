import type { ReactNode } from 'react'
import { useSessaoContext } from './useSessaoContext'

export interface ISessaoVisitanteProps {
  children: ReactNode
}

export function SessaoVisitante({ children }: ISessaoVisitanteProps) {
  const { state } = useSessaoContext()

  return state.modo === 'visitante' ? children : null
}
