import type { ReactNode } from 'react'
import { useInstalarAppContext } from './useInstalarAppContext'

export interface IInstalarAppNaoInstaladoProps {
  children: ReactNode
}

export function InstalarAppNaoInstalado({ children }: IInstalarAppNaoInstaladoProps) {
  const { state } = useInstalarAppContext()

  return state.forma === 'instalado' ? null : children
}
