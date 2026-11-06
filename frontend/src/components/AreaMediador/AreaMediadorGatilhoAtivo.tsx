import { ShieldCheck } from 'lucide-react'
import { GATILHO_BASE } from './estilos'
import { useAreaMediadorContext } from './useAreaMediadorContext'

const GATILHO = `${GATILHO_BASE} bg-primary-soft text-primary hover:bg-primary hover:text-white`

export function AreaMediadorGatilhoAtivo() {
  const { actions } = useAreaMediadorContext()

  return (
    <button
      type="button"
      aria-label="Área do mediador, modo mediador ativo"
      title="Área do mediador"
      className={GATILHO}
      onClick={actions.abrir}
    >
      <ShieldCheck size={24} strokeWidth={2.5} aria-hidden="true" />
    </button>
  )
}
