import type { ReactNode } from 'react'
import { useInstalarAppContext } from './useInstalarAppContext'

export interface IInstalarAppAppleProps {
  children: ReactNode
}

export function InstalarAppApple({ children }: IInstalarAppAppleProps) {
  const { state } = useInstalarAppContext()

  return state.forma === 'apple' ? children : null
}
