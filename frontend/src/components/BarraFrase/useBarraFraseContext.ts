import { use } from 'react'
import { BarraFraseContext, type IBarraFraseContextValue } from './BarraFraseContext'

export function useBarraFraseContext(): IBarraFraseContextValue {
  const contexto = use(BarraFraseContext)

  if (contexto === null) {
    throw new Error('As partes da BarraFrase precisam estar dentro de BarraFrase.Provider.')
  }

  return contexto
}
