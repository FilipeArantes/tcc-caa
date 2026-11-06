import type { Usuario } from './Usuario'

export type ModoSessao = 'visitante' | 'usuario' | 'mediador'

export type ErroLogin = 'menor_de_idade' | 'cancelado' | 'oauth' | 'google_indisponivel' | 'codigo' | 'rede'

export interface TokenSessao {
  token: string
  expira_em: string
}

export interface RespostaLogin {
  usuario: Usuario
  tokens: {
    mediador: TokenSessao
    usuario: TokenSessao
  }
}
