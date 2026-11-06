import { use } from 'react'
import { SessaoContext, type ISessaoContextValue } from './SessaoContext'

export function useSessaoContext(): ISessaoContextValue {
  const contexto = use(SessaoContext)

  if (contexto === null) {
    throw new Error('As partes da Sessao precisam estar dentro de Sessao.Provider.')
  }

  return contexto
}
