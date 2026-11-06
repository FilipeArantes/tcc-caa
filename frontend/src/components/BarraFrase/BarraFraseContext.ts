import { createContext } from 'react'
import type { Pictograma } from '../../types/Pictograma'

export interface IBarraFraseState {
  pictogramas: Pictograma[]
  frase: string
  vazia: boolean
  falando: boolean
}

export interface IBarraFraseActions {
  falar: () => void
  apagarUltimo: () => void
  limpar: () => void
}

export interface IBarraFraseMeta {
  ttsSuportado: boolean
}

export interface IBarraFraseContextValue {
  state: IBarraFraseState
  actions: IBarraFraseActions
  meta: IBarraFraseMeta
}

export const BarraFraseContext = createContext<IBarraFraseContextValue | null>(null)
