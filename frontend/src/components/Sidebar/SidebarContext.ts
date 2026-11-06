import { createContext } from 'react'

export interface ISidebarState {
  aberta: boolean
}

export interface ISidebarActions {
  alternar: () => void
}

export interface ISidebarMeta {
  larguraAberta: number
  larguraFechada: number
}

export interface ISidebarContextValue {
  state: ISidebarState
  actions: ISidebarActions
  meta: ISidebarMeta
}

export const SidebarContext = createContext<ISidebarContextValue | null>(null)
