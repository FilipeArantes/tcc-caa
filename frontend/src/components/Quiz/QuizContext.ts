import { createContext } from 'react'
import type { IdConquista } from '../../services/conquistasService'
import type { Alternativa, NivelQuiz, Pergunta } from '../../types/Quiz'

export interface IQuizState {
  pergunta: Pergunta | null
  indice: number
  total: number
  eliminadas: number[]
  acertou: boolean
  errouAgora: boolean
  terminado: boolean
  novasConquistas: IdConquista[]
}

export interface IQuizActions {
  escolher: (alternativa: Alternativa) => void
  proxima: () => void
  reiniciar: () => void
  ouvir: (texto: string) => void
}

export interface IQuizMeta {
  nomeQuiz: string
  nivel: NivelQuiz
}

export interface IQuizContextValue {
  state: IQuizState
  actions: IQuizActions
  meta: IQuizMeta
}

export const QuizContext = createContext<IQuizContextValue | null>(null)
