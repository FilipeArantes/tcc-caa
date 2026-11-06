import type { ButtonHTMLAttributes, ReactNode } from 'react'

const BOTAO =
  'flex h-acao items-center gap-2 rounded-2xl bg-primary px-8 text-rotulo font-bold ' +
  'text-white transition-colors hover:bg-primary-dark active:bg-primary-dark'

export interface IDialogoConfirmarProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function DialogoConfirmar({ children, ...props }: IDialogoConfirmarProps) {
  return (
    <button {...props} type="button" className={BOTAO}>
      {children}
    </button>
  )
}
