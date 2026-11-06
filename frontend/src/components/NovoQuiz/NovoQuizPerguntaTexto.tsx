import { useId } from 'react'
import { ENTRADA, ROTULO } from './estilos'
import { useNovoQuizContext, usePerguntaContext } from './useNovoQuizContext'

export function NovoQuizPerguntaTexto() {
  const { actions } = useNovoQuizContext()
  const pergunta = usePerguntaContext()
  const id = useId()

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={ROTULO}>
        Texto da pergunta <span className="font-normal text-discreto">(opcional se tiver imagem ou áudio)</span>
      </label>
      <input
        id={id}
        type="text"
        value={pergunta.texto}
        maxLength={255}
        placeholder="Ex.: Que animal é esse?"
        autoComplete="off"
        className={ENTRADA}
        onChange={(evento) => actions.alterarTexto(pergunta.id, evento.target.value)}
      />
    </div>
  )
}
