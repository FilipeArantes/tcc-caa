import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { useSessaoContext } from '../Sessao/useSessaoContext'
import { AreaMediadorContext } from './AreaMediadorContext'

const TEMPO_PARA_ABRIR_MS = 2000

export interface IAreaMediadorProviderProps {
  children: ReactNode
}

export function AreaMediadorProvider({ children }: IAreaMediadorProviderProps) {
  const sessao = useSessaoContext()
  const [abertaPeloMediador, setAbertaPeloMediador] = useState(false)

  const { limparErroLogin } = sessao.actions
  const aberta = abertaPeloMediador || sessao.state.erroLogin !== null

  const abrir = useCallback(() => setAbertaPeloMediador(true), [])

  const fechar = useCallback(() => {
    setAbertaPeloMediador(false)
    limparErroLogin()
  }, [limparErroLogin])

  const valor = useMemo(
    () => ({
      state: { aberta },
      actions: { abrir, fechar },
      meta: { tempoParaAbrirMs: TEMPO_PARA_ABRIR_MS },
    }),
    [aberta, abrir, fechar]
  )

  return <AreaMediadorContext value={valor}>{children}</AreaMediadorContext>
}
