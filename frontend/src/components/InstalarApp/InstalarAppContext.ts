import { createContext } from 'react'

export type FormaDeInstalar = 'instalado' | 'nativa' | 'apple' | 'menu'

export interface IInstalarAppState {
  forma: FormaDeInstalar
  conviteAberto: boolean
  instalando: boolean
}

export interface IInstalarAppActions {
  instalar: () => Promise<void>
  dispensar: () => void
}

export interface IInstalarAppMeta {
  diasEntreConvites: number
}

export interface IInstalarAppContextValue {
  state: IInstalarAppState
  actions: IInstalarAppActions
  meta: IInstalarAppMeta
}

export const InstalarAppContext = createContext<IInstalarAppContextValue | null>(null)
