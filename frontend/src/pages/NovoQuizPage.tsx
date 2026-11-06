import { useNavigate } from 'react-router-dom'
import { NovoQuiz } from '../components/NovoQuiz'
import { Sessao } from '../components/Sessao'

export function NovoQuizPage() {
  const navegar = useNavigate()

  return (
    <>
      <Sessao.ModoMediador>
        <NovoQuiz.Provider aoCriar={() => navegar('/quiz')}>
          <NovoQuiz.Root aria-label="Novo quiz">
            <NovoQuiz.Cabecalho>Novo quiz</NovoQuiz.Cabecalho>
            <NovoQuiz.CampoNome />
            <NovoQuiz.CampoNivel />
            <NovoQuiz.Perguntas />
            <NovoQuiz.AdicionarPergunta />
            <NovoQuiz.Erro />
            <NovoQuiz.Acoes />
          </NovoQuiz.Root>
        </NovoQuiz.Provider>
      </Sessao.ModoMediador>

      <Sessao.ModoNormal>
        <p className="m-0 text-entrada text-discreto">Entre no modo mediador para criar quizzes.</p>
      </Sessao.ModoNormal>
    </>
  )
}
