import { NovoQuizPergunta } from './NovoQuizPergunta'
import { NovoQuizPerguntaAlternativas } from './NovoQuizPerguntaAlternativas'
import { NovoQuizPerguntaAudio } from './NovoQuizPerguntaAudio'
import { NovoQuizPerguntaImagem } from './NovoQuizPerguntaImagem'
import { NovoQuizPerguntaTexto } from './NovoQuizPerguntaTexto'
import { useNovoQuizContext } from './useNovoQuizContext'

export function NovoQuizPerguntas() {
  const { state } = useNovoQuizContext()

  return (
    <ol className="m-0 flex list-none flex-col gap-6 p-0">
      {state.perguntas.map((pergunta, indice) => (
        <NovoQuizPergunta key={pergunta.id} pergunta={pergunta} numero={indice + 1}>
          <NovoQuizPerguntaTexto />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <NovoQuizPerguntaImagem />
            <NovoQuizPerguntaAudio />
          </div>
          <NovoQuizPerguntaAlternativas />
        </NovoQuizPergunta>
      ))}
    </ol>
  )
}
