import { useCallback, useMemo, type ReactNode } from 'react'
import { useTTS } from '../../hooks/useTTS'
import { useEscritaStore } from '../../store/escritaStore'
import { EscritaContext } from './EscritaContext'

export interface IEscritaProviderProps {
  children: ReactNode
}

export function EscritaProvider({ children }: IEscritaProviderProps) {
  const texto = useEscritaStore((estado) => estado.texto)
  const digitar = useEscritaStore((estado) => estado.digitar)
  const apagarUltimo = useEscritaStore((estado) => estado.apagarUltimo)
  const limpar = useEscritaStore((estado) => estado.limpar)

  const { falar: falarTexto, suportado, falando } = useTTS()

  const falar = useCallback(() => falarTexto(texto), [falarTexto, texto])

  const valor = useMemo(
    () => ({
      state: { texto, vazio: texto.trim().length === 0, falando },
      actions: { digitar, apagarUltimo, limpar, falar },
      meta: { ttsSuportado: suportado },
    }),
    [texto, falando, digitar, apagarUltimo, limpar, falar, suportado]
  )

  return <EscritaContext value={valor}>{children}</EscritaContext>
}
