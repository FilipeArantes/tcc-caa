import { api, ORIGEM_BACKEND } from './api'
import type { RespostaDados } from '../types/Api'
import type { RespostaLogin } from '../types/Sessao'

const CHAVE_RETORNO = 'caa-retorno-login'

export function iniciarLoginGoogle(): void {
  window.sessionStorage.setItem(CHAVE_RETORNO, window.location.pathname)
  window.location.assign(`${ORIGEM_BACKEND}/auth/google/redirect`)
}

export function consumirRotaDeRetorno(): string {
  const rota = window.sessionStorage.getItem(CHAVE_RETORNO)
  window.sessionStorage.removeItem(CHAVE_RETORNO)

  return rota !== null && rota.startsWith('/') && !rota.startsWith('/mediador/callback') ? rota : '/'
}

export async function trocarCodigo(codigo: string): Promise<RespostaLogin> {
  const resposta = await api.enviar<RespostaDados<RespostaLogin>>('/auth/token', { codigo })

  return resposta.data
}

export function revogarToken(token: string): Promise<void> {
  return api.enviar<void>('/auth/logout', {}, { token })
}
