import { use } from 'react'
import { PictogramaContext, type IPictogramaContextValue } from './PictogramaContext'

export function usePictogramaContext(): IPictogramaContextValue {
  const contexto = use(PictogramaContext)

  if (contexto === null) {
    throw new Error('As partes do Pictograma precisam estar dentro de Pictograma.Root.')
  }

  return contexto
}
