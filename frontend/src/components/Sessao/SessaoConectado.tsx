import type { ReactNode } from 'react'
import { useSessaoContext } from './useSessaoContext'

export interface ISessaoConectadoProps {
  children: ReactNode
}

export function SessaoConectado({ children }: ISessaoConectadoProps) {
  const { state } = useSessaoContext()

  return state.modo !== 'visitante' ? children : null
}
