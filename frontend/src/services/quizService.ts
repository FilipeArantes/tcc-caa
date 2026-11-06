import { api } from './api'
import type { Pagina, RespostaDados } from '../types/Api'
import type { NivelQuiz, Pergunta, Quiz } from '../types/Quiz'

export interface DadosPergunta {
  texto: string
  imagem: File | null
  audio: File | null
  alternativas: { texto: string; correta: boolean }[]
}

function paraFormulario(dados: DadosPergunta): FormData {
  const formulario = new FormData()
  const texto = dados.texto.trim()

  if (texto.length > 0) {
    formulario.append('texto_pergunta', texto)
  }

  if (dados.imagem !== null) {
    formulario.append('imagem', dados.imagem)
  }

  if (dados.audio !== null) {
    formulario.append('audio', dados.audio)
  }

  dados.alternativas.forEach((alternativa, indice) => {
    formulario.append(`alternativas[${indice}][texto]`, alternativa.texto.trim())
    formulario.append(`alternativas[${indice}][correta]`, alternativa.correta ? '1' : '0')
  })

  return formulario
}

export async function buscarQuizzes(): Promise<Quiz[]> {
  const pagina = await api.buscar<Pagina<Quiz>>('/quizzes')

  return pagina.data
}

export async function buscarQuizPorId(id: number): Promise<Quiz> {
  const resposta = await api.buscar<RespostaDados<Quiz>>(`/quizzes/${id}`)

  return resposta.data
}

export async function criarQuiz(nomeQuiz: string, nivel: NivelQuiz): Promise<Quiz> {
  const resposta = await api.enviar<RespostaDados<Quiz>>('/quizzes', { nome_quiz: nomeQuiz, nivel })

  return resposta.data
}

export async function atualizarQuiz(id: number, nomeQuiz: string, nivel: NivelQuiz): Promise<Quiz> {
  const resposta = await api.atualizar<RespostaDados<Quiz>>(`/quizzes/${id}`, { nome_quiz: nomeQuiz, nivel })

  return resposta.data
}

export function removerQuiz(id: number): Promise<void> {
  return api.remover<void>(`/quizzes/${id}`)
}

export async function criarPergunta(idQuiz: number, dados: DadosPergunta): Promise<Pergunta> {
  const resposta = await api.enviarFormulario<RespostaDados<Pergunta>>(
    `/quizzes/${idQuiz}/perguntas`,
    paraFormulario(dados)
  )

  return resposta.data
}

export function removerPergunta(id: number): Promise<void> {
  return api.remover<void>(`/perguntas/${id}`)
}
