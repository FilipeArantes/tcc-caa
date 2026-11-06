import type { ReactNode } from 'react'
import { useQuizContext } from './useQuizContext'

export interface IQuizEmptyProps {
  children: ReactNode
}

export function QuizEmpty({ children }: IQuizEmptyProps) {
  const { state } = useQuizContext()

  return state.total === 0 ? children : null
}
