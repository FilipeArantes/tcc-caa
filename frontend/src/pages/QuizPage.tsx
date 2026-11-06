import { RotateCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CartaoQuiz } from '../components/CartaoQuiz'
import { Conquistas } from '../components/Conquistas'
import { NovoQuiz } from '../components/NovoQuiz'
import { Sessao } from '../components/Sessao'
import { useQuizzes } from '../hooks/useQuizzes'
import { lerHistorico } from '../services/conquistasService'
import { NOMES_DOS_NIVEIS, type Quiz } from '../types/Quiz'

const CABECALHO = 'flex flex-wrap items-center justify-between gap-4'

const TITULO = 'm-0 text-3xl font-bold text-texto'

const GRADE = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

const MENSAGEM = 'm-0 text-entrada text-discreto'

const TENTAR_DE_NOVO =
  'flex h-acao w-fit items-center gap-3 rounded-2xl border-2 border-borda bg-surface px-6 ' +
  'text-rotulo font-bold text-texto hover:bg-fundo active:bg-fundo'

function totalDePerguntas(quiz: Quiz): string {
  const total = quiz.perguntas?.length ?? 0

  return total === 1 ? '1 pergunta' : `${total} perguntas`
}

export function QuizPage() {
  const { quizzes, situacao, recarregar } = useQuizzes()
  const navegar = useNavigate()
  const conquistas = lerHistorico().conquistas

  return (
    <div className="flex flex-col gap-6">
      <header className={CABECALHO}>
        <h1 className={TITULO}>Escolha um quiz</h1>
        <Sessao.ModoMediador>
          <NovoQuiz.Gatilho />
        </Sessao.ModoMediador>
      </header>

      {conquistas.length > 0 ? (
        <Conquistas.Root rotulo="Minhas conquistas">
          {conquistas.map((id) => (
            <Conquistas.Medalha key={id} id={id} />
          ))}
        </Conquistas.Root>
      ) : null}

      {situacao === 'carregando' ? (
        <p role="status" className={MENSAGEM}>
          Carregando quizzes…
        </p>
      ) : null}

      {situacao === 'erro' ? (
        <div role="alert" className="flex flex-col gap-4">
          <p className={MENSAGEM}>Não foi possível carregar os quizzes.</p>
          <button type="button" className={TENTAR_DE_NOVO} onClick={recarregar}>
            <RotateCw size={26} strokeWidth={2.5} aria-hidden="true" />
            <span>Tentar de novo</span>
          </button>
        </div>
      ) : null}

      {situacao === 'pronto' && quizzes.length === 0 ? <p className={MENSAGEM}>Ainda não tem nenhum quiz.</p> : null}

      {situacao === 'pronto' && quizzes.length > 0 ? (
        <div className={GRADE}>
          {quizzes.map((quiz) => (
            <CartaoQuiz.Root key={quiz.id} onClick={() => navegar(`/quiz/${quiz.id}`)}>
              <CartaoQuiz.Nome>{quiz.nome_quiz}</CartaoQuiz.Nome>
              <CartaoQuiz.Detalhe>
                {totalDePerguntas(quiz)} · {NOMES_DOS_NIVEIS[quiz.nivel]}
              </CartaoQuiz.Detalhe>
              {quiz.padrao ? null : (
                <Sessao.ModoMediador>
                  <CartaoQuiz.Selo>Criado por você</CartaoQuiz.Selo>
                </Sessao.ModoMediador>
              )}
            </CartaoQuiz.Root>
          ))}
        </div>
      ) : null}
    </div>
  )
}
