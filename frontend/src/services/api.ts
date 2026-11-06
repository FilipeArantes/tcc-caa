import { tokenValido, useSessaoStore } from '../store/sessaoStore'

export const URL_BASE_API = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/api'

export const ORIGEM_BACKEND = new URL(URL_BASE_API).origin

export class ErroApi extends Error {
  readonly status: number

  constructor(status: number, mensagem: string) {
    super(mensagem)
    this.name = 'ErroApi'
    this.status = status
  }
}

interface OpcoesRequisicao extends RequestInit {
  token?: string
}

function tokenAtivo(): string | null {
  const { tokenMediador, tokenUsuario } = useSessaoStore.getState()

  if (tokenValido(tokenMediador)) {
    return tokenMediador.token
  }

  if (tokenValido(tokenUsuario)) {
    return tokenUsuario.token
  }

  return null
}

function descartarTokenRecusado(token: string): void {
  const sessao = useSessaoStore.getState()

  if (sessao.tokenMediador?.token === token) {
    sessao.encerrarModoMediador()
    return
  }

  if (sessao.tokenUsuario?.token === token) {
    sessao.encerrar()
  }
}

async function mensagemDeErro(resposta: Response): Promise<string> {
  try {
    const corpo = (await resposta.json()) as { message?: string }
    return corpo.message ?? 'Não foi possível concluir. Tente de novo.'
  } catch {
    return 'Não foi possível concluir. Tente de novo.'
  }
}

async function requisitar<T>(caminho: string, opcoes: OpcoesRequisicao = {}): Promise<T> {
  const { token: tokenInformado, headers, ...props } = opcoes
  const token = tokenInformado ?? tokenAtivo()

  let resposta: Response

  try {
    resposta = await fetch(`${URL_BASE_API}${caminho}`, {
      ...props,
      headers: {
        ...(props.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    })
  } catch {
    throw new ErroApi(0, 'Sem conexão com o servidor. Verifique a internet e tente de novo.')
  }

  if (resposta.status === 401 && token !== null && tokenInformado === undefined) {
    descartarTokenRecusado(token)
  }

  if (!resposta.ok) {
    throw new ErroApi(resposta.status, await mensagemDeErro(resposta))
  }

  if (resposta.status === 204) {
    return undefined as T
  }

  return resposta.json() as Promise<T>
}

export const api = {
  buscar: <T>(caminho: string, opcoes?: OpcoesRequisicao) => {
    return requisitar<T>(caminho, opcoes)
  },

  enviar: <T>(caminho: string, corpo: unknown, opcoes?: OpcoesRequisicao) => {
    return requisitar<T>(caminho, {
      ...opcoes,
      method: 'POST',
      body: JSON.stringify(corpo),
    })
  },

  atualizar: <T>(caminho: string, corpo: unknown, opcoes?: OpcoesRequisicao) => {
    return requisitar<T>(caminho, {
      ...opcoes,
      method: 'PUT',
      body: JSON.stringify(corpo),
    })
  },

  enviarFormulario: <T>(caminho: string, formulario: FormData, opcoes?: OpcoesRequisicao) => {
    return requisitar<T>(caminho, {
      ...opcoes,
      method: 'POST',
      body: formulario,
    })
  },

  remover: <T>(caminho: string, opcoes?: OpcoesRequisicao) => {
    return requisitar<T>(caminho, {
      ...opcoes,
      method: 'DELETE',
    })
  },
}
