import { Space } from 'lucide-react'
import { useEscritaContext } from './useEscritaContext'

const TECLA =
  'col-span-3 flex h-20 items-center justify-center gap-3 rounded-2xl border-2 border-borda ' +
  'bg-surface text-rotulo font-bold text-texto shadow-sm transition-colors select-none ' +
  'hover:border-primary hover:bg-primary-soft active:bg-primary-soft'

export function EscritaEspaco() {
  const { actions } = useEscritaContext()

  return (
    <button type="button" className={TECLA} onClick={() => actions.digitar(' ')}>
      <Space size={32} strokeWidth={2.5} aria-hidden="true" />
      <span>Espaço</span>
    </button>
  )
}
