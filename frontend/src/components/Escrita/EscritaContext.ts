import { createContext } from 'react'

export interface IEscritaState {
  texto: string
  vazio: boolean
  falando: boolean
}

export interface IEscritaActions {
  digitar: (caractere: string) => void
  apagarUltimo: () => void
  limpar: () => void
  falar: () => void
}

export interface IEscritaMeta {
  ttsSuportado: boolean
}

export interface IEscritaContextValue {
  state: IEscritaState
  actions: IEscritaActions
  meta: IEscritaMeta
}

export const EscritaContext = createContext<IEscritaContextValue | null>(null)
