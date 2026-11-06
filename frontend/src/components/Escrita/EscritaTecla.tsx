import type { ButtonHTMLAttributes } from 'react'
import { useEscritaContext } from './useEscritaContext'

const TECLA =
  'flex h-20 items-center justify-center rounded-2xl border-2 border-borda bg-surface ' +
  'text-[32px] font-bold text-texto shadow-sm transition-colors select-none ' +
  'hover:border-primary hover:bg-primary-soft active:bg-primary-soft'

export interface IEscritaTeclaProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  letra: string
}

export function EscritaTecla({ letra, ...props }: IEscritaTeclaProps) {
  const { actions } = useEscritaContext()

  return (
    <button {...props} type="button" className={TECLA} onClick={() => actions.digitar(letra.toLocaleLowerCase('pt-BR'))}>
      {letra.toLocaleUpperCase('pt-BR')}
    </button>
  )
}
