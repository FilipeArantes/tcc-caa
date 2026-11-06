import { Volume2 } from 'lucide-react'
import { useEscritaContext } from './useEscritaContext'

const BOTAO =
  'flex h-acao items-center gap-3 rounded-2xl bg-primary px-8 text-entrada font-bold ' +
  'text-white shadow-sm transition-colors hover:bg-primary-dark active:bg-primary-dark ' +
  'disabled:cursor-not-allowed disabled:bg-borda disabled:text-texto'

export function EscritaFalar() {
  const { state, actions, meta } = useEscritaContext()

  return (
    <button
      type="button"
      onClick={actions.falar}
      disabled={state.vazio || !meta.ttsSuportado}
      aria-label="Falar o texto"
      className={BOTAO}
    >
      <Volume2 size={32} strokeWidth={2.5} aria-hidden="true" />
      <span>{state.falando ? 'Falando...' : 'Falar'}</span>
    </button>
  )
}
