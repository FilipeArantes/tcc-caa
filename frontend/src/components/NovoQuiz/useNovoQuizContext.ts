import { use } from 'react'
import { NovoQuizContext, PerguntaContext, type INovoQuizContextValue, type IRascunhoPergunta } from './NovoQuizContext'

export function useNovoQuizContext(): INovoQuizContextValue {
  const contexto = use(NovoQuizContext)

  if (contexto === null) {
    throw new Error('As partes do NovoQuiz precisam estar dentro de NovoQuiz.Provider.')
  }

  return contexto
}

export function usePerguntaContext(): IRascunhoPergunta {
  const pergunta = use(PerguntaContext)

  if (pergunta === null) {
    throw new Error('As partes da pergunta precisam estar dentro de NovoQuiz.Pergunta.')
  }

  return pergunta
}
