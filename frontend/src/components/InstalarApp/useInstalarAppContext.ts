import { use } from 'react'
import { InstalarAppContext, type IInstalarAppContextValue } from './InstalarAppContext'

export function useInstalarAppContext(): IInstalarAppContextValue {
  const contexto = use(InstalarAppContext)

  if (contexto === null) {
    throw new Error('As partes do InstalarApp precisam estar dentro de InstalarApp.Provider.')
  }

  return contexto
}
