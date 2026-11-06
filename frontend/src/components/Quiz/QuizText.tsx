import { Volume2 } from 'lucide-react'
import { useQuizContext } from './useQuizContext'

const TEXTO = 'm-0 text-[32px] font-bold leading-tight text-texto'

const OUVIR =
  'flex h-alvo w-alvo shrink-0 items-center justify-center rounded-xl text-primary ' +
  'hover:bg-primary-soft active:bg-primary-soft'

export function QuizText() {
  const { state, actions } = useQuizContext()
  const texto = state.pergunta?.texto_pergunta

  if (texto == null) {
    return null
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <p className={TEXTO}>{texto}</p>
      <button type="button" aria-label="Ouvir a pergunta" className={OUVIR} onClick={() => actions.ouvir(texto)}>
        <Volume2 size={32} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </div>
  )
}
