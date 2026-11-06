import { createContext } from 'react'
import type { NivelQuiz } from '../../types/Quiz'

export interface IRascunhoAlternativa {
  id: number
  texto: string
}

export interface IRascunhoPergunta {
  id: number
  texto: string
  imagem: File | null
  previaImagem: string | null
  audio: File | null
  previaAudio: string | null
  alternativas: IRascunhoAlternativa[]
  idCerta: number | null
  salva: boolean
}

export interface INovoQuizState {
  nome: string
  nivel: NivelQuiz
  perguntas: IRascunhoPergunta[]
  salvando: boolean
  preparandoMidia: boolean
  erro: string | null
  quizJaCriado: boolean
}

export interface INovoQuizActions {
  alterarNome: (nome: string) => void
  alterarNivel: (nivel: NivelQuiz) => void
  adicionarPergunta: () => void
  removerPergunta: (id: number) => void
  alterarTexto: (id: number, texto: string) => void
  definirImagem: (id: number, arquivo: File | null) => Promise<void>
  definirAudio: (id: number, arquivo: File | null) => void
  adicionarAlternativa: (id: number) => void
  removerAlternativa: (id: number, idAlternativa: number) => void
  alterarAlternativa: (id: number, idAlternativa: number, texto: string) => void
  marcarCerta: (id: number, idAlternativa: number) => void
  salvar: () => Promise<void>
}

export interface INovoQuizMeta {
  minimoAlternativas: number
  maximoAlternativas: number
  maximoPerguntas: number
  maximoAudioMb: number
}

export interface INovoQuizContextValue {
  state: INovoQuizState
  actions: INovoQuizActions
  meta: INovoQuizMeta
}

export const NovoQuizContext = createContext<INovoQuizContextValue | null>(null)

export const PerguntaContext = createContext<IRascunhoPergunta | null>(null)
