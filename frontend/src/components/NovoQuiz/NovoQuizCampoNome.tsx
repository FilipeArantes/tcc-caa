import { useId } from 'react'
import { ENTRADA, ROTULO } from './estilos'
import { useNovoQuizContext } from './useNovoQuizContext'

export function NovoQuizCampoNome() {
  const { state, actions } = useNovoQuizContext()
  const id = useId()

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={ROTULO}>
        Nome do quiz
      </label>
      <input
        id={id}
        type="text"
        value={state.nome}
        maxLength={255}
        placeholder="Ex.: Animais da fazenda"
        autoComplete="off"
        disabled={state.quizJaCriado || state.salvando}
        className={`${ENTRADA} text-entrada`}
        onChange={(evento) => actions.alterarNome(evento.target.value)}
      />
    </div>
  )
}
