import { ScrollText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BOTAO_SECUNDARIO } from './estilos'
import { useAreaMediadorContext } from './useAreaMediadorContext'

export function AreaMediadorCreditos() {
  const { actions } = useAreaMediadorContext()

  return (
    <Link to="/creditos" className={`${BOTAO_SECUNDARIO} no-underline`} onClick={actions.fechar}>
      <ScrollText size={24} strokeWidth={2.5} aria-hidden="true" />
      <span>Créditos e licenças</span>
    </Link>
  )
}
