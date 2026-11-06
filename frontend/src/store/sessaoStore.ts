import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ErroLogin, RespostaLogin, TokenSessao } from '../types/Sessao'
import type { Usuario } from '../types/Usuario'

interface EstadoSessao {
  usuario: Usuario | null
  tokenUsuario: TokenSessao | null
  tokenMediador: TokenSessao | null
  erroLogin: ErroLogin | null
  iniciar: (login: RespostaLogin) => void
  encerrarModoMediador: () => void
  encerrar: () => void
  registrarErroLogin: (erro: ErroLogin) => void
  limparErroLogin: () => void
}

export function tokenValido(token: TokenSessao | null): token is TokenSessao {
  return token !== null && Date.parse(token.expira_em) > Date.now()
}

export const useSessaoStore = create<EstadoSessao>()(
  persist(
    (set) => ({
      usuario: null,
      tokenUsuario: null,
      tokenMediador: null,
      erroLogin: null,
      iniciar: (login) =>
        set({
          usuario: login.usuario,
          tokenUsuario: login.tokens.usuario,
          tokenMediador: login.tokens.mediador,
          erroLogin: null,
        }),
      encerrarModoMediador: () => set({ tokenMediador: null }),
      encerrar: () => set({ usuario: null, tokenUsuario: null, tokenMediador: null }),
      registrarErroLogin: (erro) => set({ erroLogin: erro }),
      limparErroLogin: () => set({ erroLogin: null }),
    }),
    {
      name: 'caa-sessao',
      partialize: (estado) => ({
        usuario: estado.usuario,
        tokenUsuario: estado.tokenUsuario,
        tokenMediador: estado.tokenMediador,
      }),
    }
  )
)
