import { PartyPopper, RotateCcw } from 'lucide-react'
import { useQuizContext } from './useQuizContext'

const BASE = 'flex min-h-16 items-center justify-center gap-3 rounded-2xl px-6 py-3 text-entrada font-bold'

export function QuizFeedback() {
  const { state } = useQuizContext()

  return (
    <div aria-live="polite" className="min-h-16">
      {state.acertou ? (
        <p className={`${BASE} m-0 bg-acerto-soft text-acerto`}>
          <PartyPopper size={32} strokeWidth={2.5} aria-hidden="true" />
          Muito bem!
        </p>
      ) : null}
      {!state.acertou && state.errouAgora ? (
        <p className={`${BASE} m-0 bg-aviso-soft text-aviso`}>
          <RotateCcw size={32} strokeWidth={2.5} aria-hidden="true" />
          Tente de novo
        </p>
      ) : null}
    </div>
  )
}
