import { Undo2 } from 'lucide-react'
import { useSessaoContext } from '../Sessao/useSessaoContext'
import { BOTAO_CONTORNO } from './estilos'
import { useAreaMediadorContext } from './useAreaMediadorContext'

export function AreaMediadorVoltarAoNormal() {
  const sessao = useSessaoContext()
  const area = useAreaMediadorContext()

  async function voltar() {
    await sessao.actions.voltarAoNormal()
    area.actions.fechar()
  }

  return (
    <button type="button" className={BOTAO_CONTORNO} disabled={sessao.state.processando} onClick={voltar}>
      <Undo2 size={26} strokeWidth={2.5} aria-hidden="true" />
      <span>Voltar ao modo normal</span>
    </button>
  )
}
