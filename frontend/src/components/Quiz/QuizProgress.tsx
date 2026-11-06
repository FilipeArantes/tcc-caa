import { useQuizContext } from './useQuizContext'

const TRILHO = 'h-4 w-full overflow-hidden rounded-full bg-primary-soft'

const BARRA = 'h-full rounded-full bg-primary transition-[width] duration-300 motion-reduce:transition-none'

export function QuizProgress() {
  const { state } = useQuizContext()
  const respondidas = state.indice + (state.acertou ? 1 : 0)
  const porcentagem = state.total === 0 ? 0 : Math.round((respondidas / state.total) * 100)

  return (
    <div className="flex flex-col gap-2">
      <p className="m-0 text-rotulo font-bold text-discreto">
        Pergunta {state.indice + 1} de {state.total}
      </p>
      <div
        role="progressbar"
        aria-label="Progresso do quiz"
        aria-valuemin={0}
        aria-valuemax={state.total}
        aria-valuenow={respondidas}
        className={TRILHO}
      >
        <div className={BARRA} style={{ width: `${porcentagem}%` }} />
      </div>
    </div>
  )
}
