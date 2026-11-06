import { use } from 'react'
import { QuizContext, type IQuizContextValue } from './QuizContext'

export function useQuizContext(): IQuizContextValue {
  const contexto = use(QuizContext)

  if (contexto === null) {
    throw new Error('As partes do Quiz precisam estar dentro de Quiz.Provider.')
  }

  return contexto
}
