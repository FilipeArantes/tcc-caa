import { Delete } from 'lucide-react'
import { useBarraFraseContext } from './useBarraFraseContext'

const BOTAO =
  'flex h-acao min-w-acao items-center justify-center gap-2 rounded-2xl border-2 border-borda bg-surface px-4 sm:px-6 ' +
  'text-rotulo font-bold text-texto transition-colors hover:bg-fundo active:bg-fundo ' +
  'disabled:cursor-not-allowed disabled:opacity-40'

export function BarraFraseApagar() {
  const { state, actions } = useBarraFraseContext()

  return (
    <button
      type="button"
      onClick={actions.apagarUltimo}
      disabled={state.vazia}
      aria-label="Apagar último pictograma"
      className={BOTAO}
    >
      <Delete size={28} strokeWidth={2.5} aria-hidden="true" />
      <span className="max-sm:sr-only">Apagar</span>
    </button>
  )
}
