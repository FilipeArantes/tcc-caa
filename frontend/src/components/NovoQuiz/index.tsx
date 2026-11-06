import { NovoQuizAcoes } from './NovoQuizAcoes'
import { NovoQuizAdicionarPergunta } from './NovoQuizAdicionarPergunta'
import { NovoQuizCabecalho } from './NovoQuizCabecalho'
import { NovoQuizCampoNivel } from './NovoQuizCampoNivel'
import { NovoQuizCampoNome } from './NovoQuizCampoNome'
import { NovoQuizErro } from './NovoQuizErro'
import { NovoQuizGatilho } from './NovoQuizGatilho'
import { NovoQuizPergunta } from './NovoQuizPergunta'
import { NovoQuizPerguntaAlternativas } from './NovoQuizPerguntaAlternativas'
import { NovoQuizPerguntaAudio } from './NovoQuizPerguntaAudio'
import { NovoQuizPerguntaImagem } from './NovoQuizPerguntaImagem'
import { NovoQuizPerguntas } from './NovoQuizPerguntas'
import { NovoQuizPerguntaTexto } from './NovoQuizPerguntaTexto'
import { NovoQuizProvider } from './NovoQuizProvider'
import { NovoQuizRoot } from './NovoQuizRoot'

export const NovoQuiz = {
  Provider: NovoQuizProvider,
  Gatilho: NovoQuizGatilho,
  Root: NovoQuizRoot,
  Cabecalho: NovoQuizCabecalho,
  CampoNome: NovoQuizCampoNome,
  CampoNivel: NovoQuizCampoNivel,
  Perguntas: NovoQuizPerguntas,
  Pergunta: NovoQuizPergunta,
  PerguntaTexto: NovoQuizPerguntaTexto,
  PerguntaImagem: NovoQuizPerguntaImagem,
  PerguntaAudio: NovoQuizPerguntaAudio,
  PerguntaAlternativas: NovoQuizPerguntaAlternativas,
  AdicionarPergunta: NovoQuizAdicionarPergunta,
  Erro: NovoQuizErro,
  Acoes: NovoQuizAcoes,
}
