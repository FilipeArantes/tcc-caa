import { Save } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BOTAO_SECUNDARIO } from './estilos'
import { useNovoQuizContext } from './useNovoQuizContext'

const SALVAR =
  'flex h-acao items-center justify-center gap-2 rounded-2xl bg-primary px-8 text-rotulo font-bold text-white ' +
  'transition-colors hover:bg-primary-dark active:bg-primary-dark disabled:cursor-wait disabled:opacity-60'

export function NovoQuizAcoes() {
  const { state } = useNovoQuizContext()

  return (
    <div className="sticky bottom-0 flex flex-col-reverse gap-3 rounded-2xl border border-borda bg-surface p-4 shadow-sm sm:flex-row sm:justify-end">
      <Link to="/quiz" className={`${BOTAO_SECUNDARIO} no-underline`}>
        {state.quizJaCriado ? 'Voltar' : 'Cancelar'}
      </Link>
      <button type="submit" disabled={state.salvando || state.preparandoMidia} className={SALVAR}>
        <Save size={26} strokeWidth={2.5} aria-hidden="true" />
        <span>{state.salvando ? 'Salvando…' : 'Salvar quiz'}</span>
      </button>
    </div>
  )
}
