import { Conquistas } from '../Conquistas'
import { useQuizContext } from './useQuizContext'

export function QuizAchievements() {
  const { state } = useQuizContext()

  if (state.novasConquistas.length === 0) {
    return null
  }

  return (
    <section aria-labelledby="novas-conquistas" className="flex flex-col items-center gap-3">
      <h3 id="novas-conquistas" className="m-0 text-2xl font-bold text-texto">
        Conquistas novas
      </h3>
      <Conquistas.Root rotulo="Conquistas ganhas agora">
        {state.novasConquistas.map((id) => (
          <Conquistas.Medalha key={id} id={id} />
        ))}
      </Conquistas.Root>
    </section>
  )
}
