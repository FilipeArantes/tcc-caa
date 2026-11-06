import { use } from 'react'
import { AreaMediadorContext, type IAreaMediadorContextValue } from './AreaMediadorContext'

export function useAreaMediadorContext(): IAreaMediadorContextValue {
  const contexto = use(AreaMediadorContext)

  if (contexto === null) {
    throw new Error('As partes da AreaMediador precisam estar dentro de AreaMediador.Provider.')
  }

  return contexto
}
