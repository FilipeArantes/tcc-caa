import { Delete } from 'lucide-react'
import { useEscritaContext } from './useEscritaContext'

const BOTAO =
  'flex h-acao min-w-acao items-center justify-center gap-2 rounded-2xl border-2 border-borda bg-surface px-4 sm:px-6 ' +
  'text-rotulo font-bold text-texto transition-colors hover:bg-fundo active:bg-fundo ' +
  'disabled:cursor-not-allowed disabled:opacity-40'

export function EscritaApagar() {
  const { state, actions } = useEscritaContext()

  return (
    <button
      type="button"
      onClick={actions.apagarUltimo}
      disabled={state.texto.length === 0}
      aria-label="Apagar última letra"
      className={BOTAO}
    >
      <Delete size={28} strokeWidth={2.5} aria-hidden="true" />
      <span className="max-sm:sr-only">Apagar</span>
    </button>
  )
}
