import { Puzzle } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

const RAIZ =
  'flex min-h-44 flex-col items-start gap-3 rounded-2xl border-4 border-primary-soft bg-surface p-5 ' +
  'text-left shadow-sm transition-transform hover:-translate-y-0.5 hover:border-primary ' +
  'active:translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0'

export interface ICartaoQuizRootProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function CartaoQuizRoot({ children, ...props }: ICartaoQuizRootProps) {
  return (
    <button {...props} type="button" className={RAIZ}>
      <Puzzle size={40} strokeWidth={2.25} aria-hidden="true" className="text-primary" />
      {children}
    </button>
  )
}
