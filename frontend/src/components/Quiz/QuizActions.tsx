import { ArrowRight, Flag } from 'lucide-react'
import { useQuizContext } from './useQuizContext'

const BOTAO =
  'flex h-acao items-center gap-3 self-center rounded-2xl bg-primary px-10 text-entrada font-bold text-white ' +
  'shadow-sm transition-colors hover:bg-primary-dark active:bg-primary-dark'

export function QuizActions() {
  const { state, actions } = useQuizContext()

  if (!state.acertou) {
    return null
  }

  const ultima = state.indice + 1 >= state.total

  return (
    <button type="button" className={BOTAO} onClick={actions.proxima}>
      {ultima ? (
        <Flag size={32} strokeWidth={2.5} aria-hidden="true" />
      ) : (
        <ArrowRight size={32} strokeWidth={2.5} aria-hidden="true" />
      )}
      <span>{ultima ? 'Terminar' : 'Próxima'}</span>
    </button>
  )
}
