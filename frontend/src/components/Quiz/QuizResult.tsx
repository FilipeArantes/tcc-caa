import { PartyPopper, RotateCcw } from 'lucide-react'
import type { ReactNode } from 'react'
import { useQuizContext } from './useQuizContext'

const CARTAO = 'flex flex-col items-center gap-5 rounded-3xl border border-borda bg-surface p-8 text-center shadow-sm'

const DE_NOVO =
  'flex h-acao items-center gap-3 rounded-2xl bg-primary px-8 text-entrada font-bold text-white ' +
  'hover:bg-primary-dark active:bg-primary-dark'

export interface IQuizResultProps {
  children?: ReactNode
}

export function QuizResult({ children }: IQuizResultProps) {
  const { state, actions, meta } = useQuizContext()

  return (
    <div className={CARTAO}>
      <PartyPopper size={64} strokeWidth={2} aria-hidden="true" className="text-acerto" />
      <h2 className="m-0 text-3xl font-bold text-texto">Você terminou!</h2>
      <p className="m-0 text-entrada text-texto">
        {meta.nomeQuiz}: {state.total} {state.total === 1 ? 'pergunta respondida' : 'perguntas respondidas'}
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <button type="button" className={DE_NOVO} onClick={actions.reiniciar}>
          <RotateCcw size={28} strokeWidth={2.5} aria-hidden="true" />
          <span>Jogar de novo</span>
        </button>
        {children}
      </div>
    </div>
  )
}
