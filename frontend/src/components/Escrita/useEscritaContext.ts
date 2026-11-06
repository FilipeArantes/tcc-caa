import { use } from 'react'
import { EscritaContext, type IEscritaContextValue } from './EscritaContext'

export function useEscritaContext(): IEscritaContextValue {
  const contexto = use(EscritaContext)

  if (contexto === null) {
    throw new Error('As partes da Escrita precisam estar dentro de Escrita.Provider.')
  }

  return contexto
}
