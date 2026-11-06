import { createContext } from 'react'
import type { ErroLogin, ModoSessao } from '../../types/Sessao'
import type { Usuario } from '../../types/Usuario'

export interface ISessaoState {
  modo: ModoSessao
  usuario: Usuario | null
  erroLogin: ErroLogin | null
  processando: boolean
  entrouAgora: boolean
}

export interface ISessaoActions {
  entrarComGoogle: () => void
  concluirLogin: (codigo: string) => Promise<void>
  registrarErroLogin: (erro: ErroLogin) => void
  limparErroLogin: () => void
  voltarAoNormal: () => Promise<void>
  desconectar: () => Promise<void>
}

export interface ISessaoMeta {
  modoMediadorExpiraEm: string | null
}

export interface ISessaoContextValue {
  state: ISessaoState
  actions: ISessaoActions
  meta: ISessaoMeta
}

export const SessaoContext = createContext<ISessaoContextValue | null>(null)
