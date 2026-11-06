import type { NivelQuiz } from '../types/Quiz'

export type IdConquista = 'primeiro-quiz' | 'tudo-de-primeira' | 'cinco-quizzes' | 'tres-dias' | 'nivel-dificil'

export interface Conquista {
  id: IdConquista
  titulo: string
  descricao: string
}

export const CONQUISTAS: Record<IdConquista, Conquista> = {
  'primeiro-quiz': { id: 'primeiro-quiz', titulo: 'Primeiro quiz', descricao: 'Terminou o primeiro quiz' },
  'tudo-de-primeira': { id: 'tudo-de-primeira', titulo: 'Tudo de primeira', descricao: 'Acertou todas de primeira' },
  'cinco-quizzes': { id: 'cinco-quizzes', titulo: 'Cinco quizzes', descricao: 'Terminou 5 quizzes' },
  'tres-dias': { id: 'tres-dias', titulo: 'Três dias seguidos', descricao: 'Jogou 3 dias seguidos' },
  'nivel-dificil': { id: 'nivel-dificil', titulo: 'Desafio', descricao: 'Terminou um quiz difícil' },
}

export interface HistoricoQuizzes {
  quizzesTerminados: number
  dias: string[]
  conquistas: IdConquista[]
}

export interface QuizTerminado {
  acertouTudoDePrimeira: boolean
  nivel: NivelQuiz
  dia: string
}

const CHAVE = 'caa-conquistas'

const HISTORICO_VAZIO: HistoricoQuizzes = { quizzesTerminados: 0, dias: [], conquistas: [] }

function diaAnterior(dia: string): string {
  const data = new Date(`${dia}T12:00:00`)
  data.setDate(data.getDate() - 1)

  return data.toISOString().slice(0, 10)
}

function diasSeguidosAte(dias: string[], dia: string): number {
  const conjunto = new Set(dias)
  let quantidade = 0
  let atual = dia

  while (conjunto.has(atual)) {
    quantidade++
    atual = diaAnterior(atual)
  }

  return quantidade
}

export function aplicarQuizTerminado(
  historico: HistoricoQuizzes,
  quiz: QuizTerminado
): { historico: HistoricoQuizzes; novas: IdConquista[] } {
  const dias = historico.dias.includes(quiz.dia) ? historico.dias : [...historico.dias, quiz.dia].slice(-60)
  const quizzesTerminados = historico.quizzesTerminados + 1

  const merecidas: IdConquista[] = [
    'primeiro-quiz',
    ...(quiz.acertouTudoDePrimeira ? (['tudo-de-primeira'] as const) : []),
    ...(quizzesTerminados >= 5 ? (['cinco-quizzes'] as const) : []),
    ...(diasSeguidosAte(dias, quiz.dia) >= 3 ? (['tres-dias'] as const) : []),
    ...(quiz.nivel === 'dificil' ? (['nivel-dificil'] as const) : []),
  ]

  const novas = merecidas.filter((id) => !historico.conquistas.includes(id))

  return {
    historico: { quizzesTerminados, dias, conquistas: [...historico.conquistas, ...novas] },
    novas,
  }
}

export function lerHistorico(): HistoricoQuizzes {
  try {
    const salvo = window.localStorage.getItem(CHAVE)
    return salvo === null ? HISTORICO_VAZIO : { ...HISTORICO_VAZIO, ...(JSON.parse(salvo) as HistoricoQuizzes) }
  } catch {
    return HISTORICO_VAZIO
  }
}

export function registrarQuizTerminado(quiz: Omit<QuizTerminado, 'dia'>): IdConquista[] {
  const hoje = new Date()
  const dia = new Date(hoje.getTime() - hoje.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
  const { historico, novas } = aplicarQuizTerminado(lerHistorico(), { ...quiz, dia })

  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(historico))
  } catch {
    return novas
  }

  return novas
}
