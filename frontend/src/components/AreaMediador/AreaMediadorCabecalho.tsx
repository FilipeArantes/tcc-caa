import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useAreaMediadorContext } from './useAreaMediadorContext'

const CABECALHO = 'flex items-start justify-between gap-4'

const TITULO = 'm-0 text-3xl font-bold leading-tight text-texto'

const FECHAR =
  'flex h-alvo w-alvo shrink-0 items-center justify-center rounded-xl text-texto ' +
  'hover:bg-fundo active:bg-fundo'

export interface IAreaMediadorCabecalhoProps {
  children: ReactNode
}

export function AreaMediadorCabecalho({ children }: IAreaMediadorCabecalhoProps) {
  const { actions } = useAreaMediadorContext()

  return (
    <header className={CABECALHO}>
      <h2 className={TITULO}>{children}</h2>
      <button type="button" aria-label="Fechar" className={FECHAR} onClick={actions.fechar}>
        <X size={28} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </header>
  )
}
