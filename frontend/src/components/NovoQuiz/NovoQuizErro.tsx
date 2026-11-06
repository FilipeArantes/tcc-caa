import { CircleAlert } from 'lucide-react'
import { useNovoQuizContext } from './useNovoQuizContext'

const AVISO = 'flex items-start gap-3 rounded-2xl border-2 border-erro bg-erro-soft p-4 text-rotulo text-texto'

export function NovoQuizErro() {
  const { state } = useNovoQuizContext()

  if (state.erro === null) {
    return null
  }

  return (
    <div role="alert" className={AVISO}>
      <CircleAlert size={28} strokeWidth={2.5} aria-hidden="true" className="shrink-0 text-erro" />
      <p className="m-0">{state.erro}</p>
    </div>
  )
}
