export type NivelQuiz = 'facil' | 'medio' | 'dificil'

export interface Alternativa {
  id: number
  texto_alternativa: string
  correta: boolean
  ordem: number
}

export interface Pergunta {
  id: number
  id_quiz: number
  texto_pergunta: string | null
  imagem_url: string | null
  audio_url: string | null
  alternativas: Alternativa[]
}

export interface Quiz {
  id: number
  id_usuario: number | null
  nome_quiz: string
  nivel: NivelQuiz
  padrao: boolean
  perguntas: Pergunta[] | null
}

export const NOMES_DOS_NIVEIS: Record<NivelQuiz, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
}
