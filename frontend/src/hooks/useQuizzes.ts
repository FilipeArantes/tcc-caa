import { useCallback, useEffect, useState } from 'react'
import { buscarQuizzes } from '../services/quizService'
import { tokenValido, useSessaoStore } from '../store/sessaoStore'
import type { Quiz } from '../types/Quiz'

export type SituacaoQuizzes = 'carregando' | 'pronto' | 'erro'

export function useQuizzes() {
  const idMediador = useSessaoStore((estado) =>
    tokenValido(estado.tokenUsuario) ? (estado.usuario?.id ?? null) : null
  )

  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [situacao, setSituacao] = useState<SituacaoQuizzes>('carregando')
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativo = true
    setSituacao('carregando')

    buscarQuizzes()
      .then((lista) => {
        if (ativo) {
          setQuizzes(lista)
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
  }, [idMediador, tentativa])

  const recarregar = useCallback(() => setTentativa((atual) => atual + 1), [])

  return { quizzes, situacao, recarregar }
}
