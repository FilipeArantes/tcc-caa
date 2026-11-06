import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { useProtecaoToqueDuplo } from '../../hooks/useProtecaoToqueDuplo'
import { useTTS } from '../../hooks/useTTS'
import { registrarQuizTerminado, type IdConquista } from '../../services/conquistasService'
import type { Alternativa, Quiz } from '../../types/Quiz'
import { QuizContext } from './QuizContext'

export interface IQuizProviderProps {
  quiz: Quiz
  children: ReactNode
}

export function QuizProvider({ quiz, children }: IQuizProviderProps) {
  const { falar } = useTTS()
  const protecao = useProtecaoToqueDuplo()

  const perguntas = useMemo(
    () => (quiz.perguntas ?? []).filter((pergunta) => pergunta.alternativas.length >= 2),
    [quiz.perguntas]
  )

  const [indice, setIndice] = useState(0)
  const [eliminadas, setEliminadas] = useState<number[]>([])
  const [acertou, setAcertou] = useState(false)
  const [errouAgora, setErrouAgora] = useState(false)
  const [acertosDePrimeira, setAcertosDePrimeira] = useState(0)
  const [terminado, setTerminado] = useState(false)
  const [novasConquistas, setNovasConquistas] = useState<IdConquista[]>([])

  const pergunta = perguntas[indice] ?? null

  const escolher = useCallback(
    (alternativa: Alternativa) => {
      if (acertou || eliminadas.includes(alternativa.id) || !protecao.toqueLiberado()) {
        return
      }

      if (alternativa.correta) {
        setAcertou(true)
        setErrouAgora(false)
        if (eliminadas.length === 0) {
          setAcertosDePrimeira((atual) => atual + 1)
        }
        falar(`Muito bem! ${alternativa.texto_alternativa}`)
        return
      }

      setEliminadas((atual) => [...atual, alternativa.id])
      setErrouAgora(true)
      falar(`${alternativa.texto_alternativa}. Tente de novo.`)
    },
    [acertou, eliminadas, falar, protecao]
  )

  const proxima = useCallback(() => {
    if (!acertou || !protecao.toqueLiberado()) {
      return
    }

    protecao.marcarMudanca()

    if (indice + 1 >= perguntas.length) {
      setTerminado(true)
      setNovasConquistas(
        registrarQuizTerminado({ acertouTudoDePrimeira: acertosDePrimeira === perguntas.length, nivel: quiz.nivel })
      )
      falar('Você terminou o quiz!')
      return
    }

    setIndice((atual) => atual + 1)
    setEliminadas([])
    setAcertou(false)
    setErrouAgora(false)
  }, [acertou, indice, perguntas.length, acertosDePrimeira, quiz.nivel, falar, protecao])

  const reiniciar = useCallback(() => {
    if (!protecao.toqueLiberado()) {
      return
    }

    protecao.marcarMudanca()
    setIndice(0)
    setEliminadas([])
    setAcertou(false)
    setErrouAgora(false)
    setAcertosDePrimeira(0)
    setTerminado(false)
    setNovasConquistas([])
  }, [protecao])

  const valor = useMemo(
    () => ({
      state: {
        pergunta,
        indice,
        total: perguntas.length,
        eliminadas,
        acertou,
        errouAgora,
        terminado,
        novasConquistas,
      },
      actions: { escolher, proxima, reiniciar, ouvir: falar },
      meta: { nomeQuiz: quiz.nome_quiz, nivel: quiz.nivel },
    }),
    [pergunta, indice, perguntas.length, eliminadas, acertou, errouAgora, terminado, novasConquistas, escolher, proxima, reiniciar, falar, quiz.nome_quiz, quiz.nivel]
  )

  return <QuizContext value={valor}>{children}</QuizContext>
}
