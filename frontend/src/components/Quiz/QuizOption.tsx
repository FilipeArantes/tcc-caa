import { Check, X } from 'lucide-react'
import type { Alternativa } from '../../types/Quiz'
import { useQuizContext } from './useQuizContext'

const BASE =
  'flex min-h-alternativa items-center justify-center gap-3 rounded-3xl border-4 px-6 py-4 ' +
  'text-[28px] font-bold transition-colors disabled:cursor-not-allowed'

const NORMAL = `${BASE} border-primary-soft bg-surface text-texto hover:border-primary active:bg-primary-soft`

const ELIMINADA = `${BASE} border-borda bg-fundo text-discreto opacity-60`

const CERTA = `${BASE} border-acerto bg-acerto-soft text-acerto`

const ESPERANDO = `${BASE} border-borda bg-surface text-discreto`

export interface IQuizOptionProps {
  alternativa: Alternativa
}

export function QuizOption({ alternativa }: IQuizOptionProps) {
  const { state, actions } = useQuizContext()
  const eliminada = state.eliminadas.includes(alternativa.id)
  const certa = state.acertou && alternativa.correta

  const classe = certa ? CERTA : eliminada ? ELIMINADA : state.acertou ? ESPERANDO : NORMAL

  return (
    <button
      type="button"
      className={classe}
      disabled={eliminada || state.acertou}
      aria-pressed={certa}
      onClick={() => actions.escolher(alternativa)}
    >
      {certa ? <Check size={36} strokeWidth={3} aria-hidden="true" /> : null}
      {eliminada ? <X size={32} strokeWidth={3} aria-hidden="true" /> : null}
      <span>{alternativa.texto_alternativa}</span>
    </button>
  )
}
