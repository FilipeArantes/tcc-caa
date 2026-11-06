import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ErroApi } from '../../services/api'
import { criarPergunta, criarQuiz } from '../../services/quizService'
import type { NivelQuiz, Quiz } from '../../types/Quiz'
import { reduzirImagem } from '../../utils/imagem'
import { NovoQuizContext, type IRascunhoPergunta } from './NovoQuizContext'

const MINIMO_CARACTERES = 3
const MINIMO_ALTERNATIVAS = 2
const MAXIMO_ALTERNATIVAS = 4
const MAXIMO_PERGUNTAS = 20
const MAXIMO_IMAGEM_MB = 5
const MAXIMO_AUDIO_MB = 10

export interface INovoQuizProviderProps {
  aoCriar: (quiz: Quiz) => void
  children: ReactNode
}

function mensagemDe(erro: unknown): string {
  return erro instanceof ErroApi ? erro.message : 'Não foi possível salvar o quiz. Tente de novo.'
}

function validar(nome: string, perguntas: IRascunhoPergunta[], quizJaCriado: boolean): string | null {
  if (!quizJaCriado && nome.trim().length < MINIMO_CARACTERES) {
    return `O nome do quiz deve ter pelo menos ${MINIMO_CARACTERES} caracteres.`
  }

  for (const [indice, pergunta] of perguntas.entries()) {
    const numero = indice + 1
    const texto = pergunta.texto.trim()

    if (texto.length === 0 && pergunta.imagem === null && pergunta.audio === null) {
      return `A pergunta ${numero} precisa ter texto, imagem ou áudio.`
    }

    if (texto.length > 0 && texto.length < MINIMO_CARACTERES) {
      return `O texto da pergunta ${numero} deve ter pelo menos ${MINIMO_CARACTERES} caracteres.`
    }

    const textos = pergunta.alternativas.map((alternativa) => alternativa.texto.trim())

    if (textos.some((textoAlternativa) => textoAlternativa.length === 0)) {
      return `Escreva todas as alternativas da pergunta ${numero}.`
    }

    if (new Set(textos.map((textoAlternativa) => textoAlternativa.toLocaleLowerCase('pt-BR'))).size !== textos.length) {
      return `As alternativas da pergunta ${numero} não podem se repetir.`
    }

    if (pergunta.idCerta === null) {
      return `Marque a alternativa certa da pergunta ${numero}.`
    }
  }

  return null
}

export function NovoQuizProvider({ aoCriar, children }: INovoQuizProviderProps) {
  const proximoId = useRef(1)
  const gerarId = useCallback(() => proximoId.current++, [])

  const novaPergunta = useCallback(
    (): IRascunhoPergunta => ({
      id: gerarId(),
      texto: '',
      imagem: null,
      previaImagem: null,
      audio: null,
      previaAudio: null,
      alternativas: [
        { id: gerarId(), texto: '' },
        { id: gerarId(), texto: '' },
      ],
      idCerta: null,
      salva: false,
    }),
    [gerarId]
  )

  const [nome, setNome] = useState('')
  const [nivel, setNivel] = useState<NivelQuiz>('facil')
  const [perguntas, setPerguntas] = useState<IRascunhoPergunta[]>(() => [novaPergunta()])
  const [salvando, setSalvando] = useState(false)
  const [preparandoMidia, setPreparandoMidia] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [quizCriado, setQuizCriado] = useState<Quiz | null>(null)

  const previas = useRef(new Set<string>())

  useEffect(() => {
    const abertas = previas.current

    return () => abertas.forEach((endereco) => URL.revokeObjectURL(endereco))
  }, [])

  const criarPrevia = useCallback((arquivo: File | null) => {
    if (arquivo === null) {
      return null
    }

    const endereco = URL.createObjectURL(arquivo)
    previas.current.add(endereco)

    return endereco
  }, [])

  const liberarPrevia = useCallback((endereco: string | null) => {
    if (endereco !== null) {
      URL.revokeObjectURL(endereco)
      previas.current.delete(endereco)
    }
  }, [])

  const alterar = useCallback((id: number, mudanca: (pergunta: IRascunhoPergunta) => IRascunhoPergunta) => {
    setPerguntas((atual) => atual.map((pergunta) => (pergunta.id === id && !pergunta.salva ? mudanca(pergunta) : pergunta)))
  }, [])

  const adicionarPergunta = useCallback(() => {
    setPerguntas((atual) => (atual.length >= MAXIMO_PERGUNTAS ? atual : [...atual, novaPergunta()]))
  }, [novaPergunta])

  const removerPergunta = useCallback(
    (id: number) => {
      setPerguntas((atual) => {
        if (atual.length <= 1) {
          return atual
        }

        const removida = atual.find((pergunta) => pergunta.id === id)
        liberarPrevia(removida?.previaImagem ?? null)
        liberarPrevia(removida?.previaAudio ?? null)

        return atual.filter((pergunta) => pergunta.id !== id)
      })
    },
    [liberarPrevia]
  )

  const alterarTexto = useCallback((id: number, texto: string) => alterar(id, (pergunta) => ({ ...pergunta, texto })), [alterar])

  const definirImagem = useCallback(
    async (id: number, arquivo: File | null) => {
      setErro(null)
      let final = arquivo

      if (arquivo !== null) {
        setPreparandoMidia(true)
        final = await reduzirImagem(arquivo).catch(() => arquivo)
        setPreparandoMidia(false)

        if (final.size > MAXIMO_IMAGEM_MB * 1024 * 1024) {
          setErro(`A imagem deve ter no máximo ${MAXIMO_IMAGEM_MB} MB.`)
          return
        }
      }

      alterar(id, (pergunta) => {
        liberarPrevia(pergunta.previaImagem)
        return { ...pergunta, imagem: final, previaImagem: criarPrevia(final) }
      })
    },
    [alterar, criarPrevia, liberarPrevia]
  )

  const definirAudio = useCallback(
    (id: number, arquivo: File | null) => {
      setErro(null)

      if (arquivo !== null && arquivo.size > MAXIMO_AUDIO_MB * 1024 * 1024) {
        setErro(`O áudio deve ter no máximo ${MAXIMO_AUDIO_MB} MB.`)
        return
      }

      alterar(id, (pergunta) => {
        liberarPrevia(pergunta.previaAudio)
        return { ...pergunta, audio: arquivo, previaAudio: criarPrevia(arquivo) }
      })
    },
    [alterar, criarPrevia, liberarPrevia]
  )

  const adicionarAlternativa = useCallback(
    (id: number) =>
      alterar(id, (pergunta) =>
        pergunta.alternativas.length >= MAXIMO_ALTERNATIVAS
          ? pergunta
          : { ...pergunta, alternativas: [...pergunta.alternativas, { id: gerarId(), texto: '' }] }
      ),
    [alterar, gerarId]
  )

  const removerAlternativa = useCallback(
    (id: number, idAlternativa: number) =>
      alterar(id, (pergunta) =>
        pergunta.alternativas.length <= MINIMO_ALTERNATIVAS
          ? pergunta
          : {
              ...pergunta,
              alternativas: pergunta.alternativas.filter((alternativa) => alternativa.id !== idAlternativa),
              idCerta: pergunta.idCerta === idAlternativa ? null : pergunta.idCerta,
            }
      ),
    [alterar]
  )

  const alterarAlternativa = useCallback(
    (id: number, idAlternativa: number, texto: string) =>
      alterar(id, (pergunta) => ({
        ...pergunta,
        alternativas: pergunta.alternativas.map((alternativa) =>
          alternativa.id === idAlternativa ? { ...alternativa, texto } : alternativa
        ),
      })),
    [alterar]
  )

  const marcarCerta = useCallback(
    (id: number, idAlternativa: number) => alterar(id, (pergunta) => ({ ...pergunta, idCerta: idAlternativa })),
    [alterar]
  )

  const salvar = useCallback(async () => {
    const problema = validar(nome, perguntas, quizCriado !== null)

    if (problema !== null) {
      setErro(problema)
      return
    }

    setSalvando(true)
    setErro(null)

    let quiz = quizCriado
    const salvas = new Set(perguntas.filter((pergunta) => pergunta.salva).map((pergunta) => pergunta.id))
    const criadas = [...(quiz?.perguntas ?? [])]

    try {
      quiz ??= await criarQuiz(nome.trim(), nivel)

      for (const pergunta of perguntas) {
        if (salvas.has(pergunta.id)) {
          continue
        }

        criadas.push(
          await criarPergunta(quiz.id, {
            texto: pergunta.texto,
            imagem: pergunta.imagem,
            audio: pergunta.audio,
            alternativas: pergunta.alternativas.map((alternativa) => ({
              texto: alternativa.texto,
              correta: alternativa.id === pergunta.idCerta,
            })),
          })
        )
        salvas.add(pergunta.id)
      }

      aoCriar({ ...quiz, perguntas: criadas })
    } catch (falha) {
      setQuizCriado(quiz === null ? null : { ...quiz, perguntas: criadas })
      setPerguntas((atual) => atual.map((pergunta) => ({ ...pergunta, salva: salvas.has(pergunta.id) })))
      setErro(
        quiz === null
          ? mensagemDe(falha)
          : `O quiz foi criado, mas faltou salvar algumas perguntas (${mensagemDe(falha)}). Toque em Salvar para tentar de novo.`
      )
    } finally {
      setSalvando(false)
    }
  }, [nome, nivel, perguntas, quizCriado, aoCriar])

  const valor = useMemo(
    () => ({
      state: { nome, nivel, perguntas, salvando, preparandoMidia, erro, quizJaCriado: quizCriado !== null },
      actions: {
        alterarNome: setNome,
        alterarNivel: setNivel,
        adicionarPergunta,
        removerPergunta,
        alterarTexto,
        definirImagem,
        definirAudio,
        adicionarAlternativa,
        removerAlternativa,
        alterarAlternativa,
        marcarCerta,
        salvar,
      },
      meta: {
        minimoAlternativas: MINIMO_ALTERNATIVAS,
        maximoAlternativas: MAXIMO_ALTERNATIVAS,
        maximoPerguntas: MAXIMO_PERGUNTAS,
        maximoAudioMb: MAXIMO_AUDIO_MB,
      },
    }),
    [
      nome,
      nivel,
      perguntas,
      salvando,
      preparandoMidia,
      erro,
      quizCriado,
      adicionarPergunta,
      removerPergunta,
      alterarTexto,
      definirImagem,
      definirAudio,
      adicionarAlternativa,
      removerAlternativa,
      alterarAlternativa,
      marcarCerta,
      salvar,
    ]
  )

  return <NovoQuizContext value={valor}>{children}</NovoQuizContext>
}
