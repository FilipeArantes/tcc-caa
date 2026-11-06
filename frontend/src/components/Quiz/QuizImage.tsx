import { useQuizContext } from './useQuizContext'

const IMAGEM = 'max-h-[40vh] w-auto max-w-full rounded-2xl bg-fundo object-contain'

export function QuizImage() {
  const { state } = useQuizContext()

  if (state.pergunta?.imagem_url == null) {
    return null
  }

  return (
    <img
      key={state.pergunta.id}
      src={state.pergunta.imagem_url}
      alt={state.pergunta.texto_pergunta ?? 'Imagem da pergunta'}
      className={IMAGEM}
    />
  )
}
