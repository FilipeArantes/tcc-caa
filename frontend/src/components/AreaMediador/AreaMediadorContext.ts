import { createContext } from 'react'

export interface IAreaMediadorState {
  aberta: boolean
}

export interface IAreaMediadorActions {
  abrir: () => void
  fechar: () => void
}

export interface IAreaMediadorMeta {
  tempoParaAbrirMs: number
}

export interface IAreaMediadorContextValue {
  state: IAreaMediadorState
  actions: IAreaMediadorActions
  meta: IAreaMediadorMeta
}

export const AreaMediadorContext = createContext<IAreaMediadorContextValue | null>(null)
