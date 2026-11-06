import type { ReactNode } from 'react'
import { useSessaoContext } from './useSessaoContext'

export interface ISessaoModoUsuarioProps {
  children: ReactNode
}

export function SessaoModoUsuario({ children }: ISessaoModoUsuarioProps) {
  const { state } = useSessaoContext()

  return state.modo === 'usuario' ? children : null
}
