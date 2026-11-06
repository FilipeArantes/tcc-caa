import { ArrowLeft } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

const BOTAO =
  'flex h-acao items-center gap-2 rounded-2xl border-2 border-primary bg-surface px-6 ' +
  'text-rotulo font-bold text-primary transition-colors hover:bg-primary-soft active:bg-primary-soft'

export type INavegacaoVoltarProps = ButtonHTMLAttributes<HTMLButtonElement>

export function NavegacaoVoltar({ ...props }: INavegacaoVoltarProps) {
  return (
    <button {...props} type="button" className={BOTAO}>
      <ArrowLeft size={28} strokeWidth={2.5} aria-hidden="true" />
      <span>Voltar</span>
    </button>
  )
}
