import type { ReactNode } from 'react'
import { useQuizContext } from './useQuizContext'

export interface IQuizFinishedProps {
  children: ReactNode
}

export function QuizFinished({ children }: IQuizFinishedProps) {
  const { state } = useQuizContext()

  return state.terminado ? children : null
}
