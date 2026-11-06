import type { ReactNode } from 'react'
import { useInstalarAppContext } from './useInstalarAppContext'

export interface IInstalarAppMenuProps {
  children: ReactNode
}

export function InstalarAppMenu({ children }: IInstalarAppMenuProps) {
  const { state } = useInstalarAppContext()

  return state.forma === 'menu' ? children : null
}
