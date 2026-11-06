import type { ReactNode } from 'react'
import { useQuizContext } from './useQuizContext'

export interface IQuizPlayingProps {
  children: ReactNode
}

export function QuizPlaying({ children }: IQuizPlayingProps) {
  const { state } = useQuizContext()

  return !state.terminado && state.pergunta !== null ? children : null
}
