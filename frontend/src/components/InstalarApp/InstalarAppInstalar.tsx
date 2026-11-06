import { Download } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useInstalarAppContext } from './useInstalarAppContext'

const BOTAO =
  'flex h-acao items-center justify-center gap-3 rounded-2xl bg-primary px-8 text-rotulo font-bold ' +
  'text-white transition-colors hover:bg-primary-dark active:bg-primary-dark ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

export interface IInstalarAppInstalarProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function InstalarAppInstalar({ children, ...props }: IInstalarAppInstalarProps) {
  const { state, actions } = useInstalarAppContext()

  return (
    <button {...props} type="button" className={BOTAO} disabled={state.instalando} onClick={actions.instalar}>
      <Download size={26} strokeWidth={2.5} aria-hidden="true" />
      <span>{children}</span>
    </button>
  )
}
