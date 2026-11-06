import { Volume2 } from 'lucide-react'
import { useBarraFraseContext } from './useBarraFraseContext'

const BOTAO =
  'flex h-acao items-center gap-3 rounded-2xl bg-primary px-8 text-entrada font-bold ' +
  'text-white shadow-sm transition-colors hover:bg-primary-dark active:bg-primary-dark ' +
  'disabled:cursor-not-allowed disabled:bg-borda disabled:text-texto'

const FALANDO = 'animate-pulse motion-reduce:animate-none'

export function BarraFraseFalar() {
  const { state, actions, meta } = useBarraFraseContext()

  const desabilitado = state.vazia || !meta.ttsSuportado

  return (
    <button
      type="button"
      onClick={actions.falar}
      disabled={desabilitado}
      aria-label="Falar a frase"
      className={[BOTAO, state.falando ? FALANDO : ''].join(' ')}
    >
      <Volume2 size={32} strokeWidth={2.5} aria-hidden="true" />
      <span>{state.falando ? 'Falando...' : 'Falar'}</span>
    </button>
  )
}
