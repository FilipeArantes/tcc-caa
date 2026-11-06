import type { ReactNode } from 'react'
import { useSessaoContext } from './useSessaoContext'

export interface ISessaoModoMediadorProps {
  children: ReactNode
}

export function SessaoModoMediador({ children }: ISessaoModoMediadorProps) {
  const { state } = useSessaoContext()

  return state.modo === 'mediador' ? children : null
}
