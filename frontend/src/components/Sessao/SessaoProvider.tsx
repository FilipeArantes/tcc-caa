import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ErroApi } from '../../services/api'
import { iniciarLoginGoogle, revogarToken, trocarCodigo } from '../../services/authService'
import { tokenValido, useSessaoStore } from '../../store/sessaoStore'
import type { ModoSessao } from '../../types/Sessao'
import { SessaoContext } from './SessaoContext'

const MAIOR_ATRASO_TIMER_MS = 2_147_483_647

export interface ISessaoProviderProps {
  children: ReactNode
}

export function SessaoProvider({ children }: ISessaoProviderProps) {
  const usuario = useSessaoStore((estado) => estado.usuario)
  const tokenUsuario = useSessaoStore((estado) => estado.tokenUsuario)
  const tokenMediador = useSessaoStore((estado) => estado.tokenMediador)
  const erroLogin = useSessaoStore((estado) => estado.erroLogin)
  const iniciar = useSessaoStore((estado) => estado.iniciar)
  const encerrarModoMediador = useSessaoStore((estado) => estado.encerrarModoMediador)
  const encerrar = useSessaoStore((estado) => estado.encerrar)
  const registrarErroLogin = useSessaoStore((estado) => estado.registrarErroLogin)
  const limparErroLogin = useSessaoStore((estado) => estado.limparErroLogin)

  const [processando, setProcessando] = useState(false)
  const [entrouAgora, setEntrouAgora] = useState(false)

  useEffect(() => {
    if (tokenMediador === null) {
      return
    }

    const restante = Date.parse(tokenMediador.expira_em) - Date.now()

    if (restante <= 0) {
      encerrarModoMediador()
      return
    }

    const temporizador = window.setTimeout(encerrarModoMediador, Math.min(restante, MAIOR_ATRASO_TIMER_MS))

    return () => window.clearTimeout(temporizador)
  }, [tokenMediador, encerrarModoMediador])

  useEffect(() => {
    if (tokenUsuario !== null && !tokenValido(tokenUsuario)) {
      encerrar()
    }
  }, [tokenUsuario, encerrar])

  const concluirLogin = useCallback(
    async (codigo: string) => {
      const tokenAnterior = useSessaoStore.getState().tokenUsuario

      try {
        iniciar(await trocarCodigo(codigo))
      } catch (erro) {
        registrarErroLogin(erro instanceof ErroApi && erro.status === 0 ? 'rede' : 'codigo')
        return
      }

      setEntrouAgora(true)

      if (tokenAnterior !== null) {
        revogarToken(tokenAnterior.token).catch(() => undefined)
      }
    },
    [iniciar, registrarErroLogin]
  )

  const voltarAoNormal = useCallback(async () => {
    const { tokenMediador: atual } = useSessaoStore.getState()
    setProcessando(true)
    encerrarModoMediador()

    if (atual !== null) {
      await revogarToken(atual.token).catch(() => undefined)
    }

    setProcessando(false)
  }, [encerrarModoMediador])

  const desconectar = useCallback(async () => {
    const { tokenMediador: mediador, tokenUsuario: comum } = useSessaoStore.getState()
    setProcessando(true)
    encerrar()

    await Promise.allSettled(
      [mediador, comum].filter((token) => token !== null).map((token) => revogarToken(token.token))
    )

    setProcessando(false)
  }, [encerrar])

  const modo: ModoSessao = useMemo(() => {
    if (usuario === null || !tokenValido(tokenUsuario)) {
      return 'visitante'
    }

    return tokenValido(tokenMediador) ? 'mediador' : 'usuario'
  }, [usuario, tokenUsuario, tokenMediador])

  const valor = useMemo(
    () => ({
      state: { modo, usuario: modo === 'visitante' ? null : usuario, erroLogin, processando, entrouAgora },
      actions: {
        entrarComGoogle: iniciarLoginGoogle,
        concluirLogin,
        registrarErroLogin,
        limparErroLogin,
        voltarAoNormal,
        desconectar,
      },
      meta: { modoMediadorExpiraEm: modo === 'mediador' ? (tokenMediador?.expira_em ?? null) : null },
    }),
    [
      modo,
      usuario,
      erroLogin,
      processando,
      entrouAgora,
      concluirLogin,
      registrarErroLogin,
      limparErroLogin,
      voltarAoNormal,
      desconectar,
      tokenMediador,
    ]
  )

  return <SessaoContext value={valor}>{children}</SessaoContext>
}
