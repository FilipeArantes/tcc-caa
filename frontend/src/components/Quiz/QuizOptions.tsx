import { useQuizContext } from './useQuizContext'
import { QuizOption } from './QuizOption'

const OPCOES = 'grid grid-cols-1 gap-4 sm:grid-cols-2'

export function QuizOptions() {
  const { state } = useQuizContext()

  if (state.pergunta === null) {
    return null
  }

  return (
    <div role="group" aria-label="Alternativas" className={OPCOES}>
      {state.pergunta.alternativas.map((alternativa) => (
        <QuizOption key={alternativa.id} alternativa={alternativa} />
      ))}
    </div>
  )
}
