import { ListChecks } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Navegacao } from '../components/Navegacao'
import { Quiz } from '../components/Quiz'
import { buscarQuizPorId } from '../services/quizService'
import type { Quiz as TipoQuiz } from '../types/Quiz'

const MENSAGEM = 'm-0 text-entrada text-discreto'

const OUTRO_QUIZ =
  'flex h-acao items-center gap-3 rounded-2xl border-2 border-borda bg-surface px-8 text-entrada font-bold ' +
  'text-texto no-underline hover:bg-fundo active:bg-fundo'

export function JogarQuizPage() {
  const { idQuiz } = useParams()
  const navegar = useNavigate()
  const [quiz, setQuiz] = useState<TipoQuiz | null>(null)
  const [situacao, setSituacao] = useState<'carregando' | 'pronto' | 'erro'>('carregando')

  useEffect(() => {
    let ativo = true

    buscarQuizPorId(Number(idQuiz))
      .then((encontrado) => {
        if (ativo) {
          setQuiz(encontrado)
          setSituacao('pronto')
        }
      })
      .catch(() => {
        if (ativo) {
          setSituacao('erro')
        }
      })

    return () => {
      ativo = false
    }
  }, [idQuiz])

  return (
    <div className="flex flex-col gap-6">
      <Navegacao.Root>
        <Navegacao.Voltar onClick={() => navegar('/quiz')} />
        <Navegacao.Trilha caminho={['Quiz', quiz?.nome_quiz ?? '…']} />
      </Navegacao.Root>

      {situacao === 'carregando' ? (
        <p role="status" className={MENSAGEM}>
          Carregando quiz…
        </p>
      ) : null}

      {situacao === 'erro' ? (
        <p role="alert" className={MENSAGEM}>
          Não foi possível abrir este quiz.
        </p>
      ) : null}

      {quiz !== null ? (
        <Quiz.Provider quiz={quiz}>
          <Quiz.Root aria-label={quiz.nome_quiz}>
            <Quiz.Empty>
              <p className={MENSAGEM}>Este quiz ainda não tem perguntas.</p>
            </Quiz.Empty>

            <Quiz.Playing>
              <Quiz.Progress />
              <Quiz.Question>
                <Quiz.Image />
                <Quiz.Audio />
                <Quiz.Text />
              </Quiz.Question>
              <Quiz.Options />
              <Quiz.Feedback />
              <Quiz.Actions />
            </Quiz.Playing>

            <Quiz.Finished>
              <Quiz.Result>
                <Link to="/quiz" className={OUTRO_QUIZ}>
                  <ListChecks size={28} strokeWidth={2.5} aria-hidden="true" />
                  <span>Escolher outro quiz</span>
                </Link>
              </Quiz.Result>
              <Quiz.Achievements />
            </Quiz.Finished>
          </Quiz.Root>
        </Quiz.Provider>
      ) : null}
    </div>
  )
}
