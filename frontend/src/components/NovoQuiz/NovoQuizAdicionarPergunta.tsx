import { Plus } from 'lucide-react'
import { BOTAO_TRACEJADO } from './estilos'
import { useNovoQuizContext } from './useNovoQuizContext'

export function NovoQuizAdicionarPergunta() {
  const { state, actions, meta } = useNovoQuizContext()
  const limite = state.perguntas.length >= meta.maximoPerguntas

  return (
    <button type="button" disabled={limite || state.salvando} className={BOTAO_TRACEJADO} onClick={actions.adicionarPergunta}>
      <Plus size={26} strokeWidth={2.5} aria-hidden="true" />
      <span>{limite ? `Limite de ${meta.maximoPerguntas} perguntas` : 'Adicionar pergunta'}</span>
    </button>
  )
}
