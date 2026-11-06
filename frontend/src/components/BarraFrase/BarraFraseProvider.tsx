import { useCallback, useMemo, type ReactNode } from 'react'
import { BarraFraseContext } from './BarraFraseContext'
import { useFraseStore } from '../../store/fraseStore'
import { useTTS } from '../../hooks/useTTS'

export interface IBarraFraseProviderProps {
  children: ReactNode
}

export function BarraFraseProvider({ children }: IBarraFraseProviderProps) {
  const pictogramas = useFraseStore((estado) => estado.pictogramasSelecionados)
  const removerUltimoPictograma = useFraseStore((estado) => estado.removerUltimoPictograma)
  const limparFrase = useFraseStore((estado) => estado.limparFrase)

  const { falar: falarTexto, suportado, falando } = useTTS()

  const frase = useMemo(
    () => pictogramas.map((pictograma) => pictograma.texto_pictograma).join(' '),
    [pictogramas]
  )

  const falar = useCallback(() => falarTexto(frase), [falarTexto, frase])

  const valor = useMemo(
    () => ({
      state: {
        pictogramas,
        frase,
        vazia: pictogramas.length === 0,
        falando,
      },
      actions: {
        falar,
        apagarUltimo: removerUltimoPictograma,
        limpar: limparFrase,
      },
      meta: { ttsSuportado: suportado },
    }),
    [pictogramas, frase, falando, falar, removerUltimoPictograma, limparFrase, suportado]
  )

  return <BarraFraseContext value={valor}>{children}</BarraFraseContext>
}
