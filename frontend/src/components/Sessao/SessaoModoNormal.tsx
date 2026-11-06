import type { ReactNode } from 'react'
import { useSessaoContext } from './useSessaoContext'

export interface ISessaoModoNormalProps {
  children: ReactNode
}

export function SessaoModoNormal({ children }: ISessaoModoNormalProps) {
  const { state } = useSessaoContext()

  return state.modo !== 'mediador' ? children : null
}
