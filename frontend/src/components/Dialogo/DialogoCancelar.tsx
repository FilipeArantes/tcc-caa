import type { ButtonHTMLAttributes, ReactNode } from 'react'

const BOTAO =
  'flex h-acao items-center gap-2 rounded-2xl border-2 border-borda bg-surface px-8 ' +
  'text-rotulo font-bold text-texto transition-colors hover:bg-fundo active:bg-fundo'

export interface IDialogoCancelarProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function DialogoCancelar({ children, ...props }: IDialogoCancelarProps) {
  return (
    <button {...props} type="button" className={BOTAO}>
      {children}
    </button>
  )
}
