import type { ReactNode } from 'react'
import { useInstalarAppContext } from './useInstalarAppContext'

export interface IInstalarAppNativaProps {
  children: ReactNode
}

export function InstalarAppNativa({ children }: IInstalarAppNativaProps) {
  const { state } = useInstalarAppContext()

  return state.forma === 'nativa' ? children : null
}
