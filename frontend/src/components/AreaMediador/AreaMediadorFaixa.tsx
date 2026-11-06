import { ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'

const FAIXA =
  'flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-primary ' +
  'bg-primary-soft p-4'

const TITULO = 'm-0 text-rotulo font-bold text-primary'

const TEXTO = 'm-0 text-base text-texto'

export interface IAreaMediadorFaixaProps {
  children: ReactNode
}

export function AreaMediadorFaixa({ children }: IAreaMediadorFaixaProps) {
  return (
    <aside aria-label="Modo mediador ativo" className={FAIXA}>
      <div className="flex items-center gap-3">
        <ShieldCheck size={32} strokeWidth={2.5} aria-hidden="true" className="shrink-0 text-primary" />
        <div className="flex flex-col gap-0.5">
          <p className={TITULO}>Modo mediador ativo</p>
          <p className={TEXTO}>Volte ao modo normal antes de entregar o aparelho.</p>
        </div>
      </div>
      {children}
    </aside>
  )
}
