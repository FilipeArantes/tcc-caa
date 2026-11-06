import { CircleCheck, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { BOTAO_PERIGO } from './estilos'
import { PerguntaContext, type IRascunhoPergunta } from './NovoQuizContext'
import { useNovoQuizContext } from './useNovoQuizContext'

const CARTAO = 'flex flex-col gap-5 rounded-3xl border-2 border-borda bg-surface p-5 sm:p-6'

export interface INovoQuizPerguntaProps {
  pergunta: IRascunhoPergunta
  numero: number
  children: ReactNode
}

export function NovoQuizPergunta({ pergunta, numero, children }: INovoQuizPerguntaProps) {
  const { state, actions } = useNovoQuizContext()

  return (
    <PerguntaContext value={pergunta}>
      <li className={CARTAO} aria-label={`Pergunta ${numero}`}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="m-0 text-2xl font-bold text-texto">Pergunta {numero}</h2>
          {pergunta.salva ? (
            <span className="flex items-center gap-2 rounded-full bg-acerto-soft px-3 py-1 text-base font-bold text-acerto">
              <CircleCheck size={20} strokeWidth={2.5} aria-hidden="true" />
              Salva
            </span>
          ) : (
            <button
              type="button"
              aria-label={`Remover pergunta ${numero}`}
              disabled={state.perguntas.length <= 1 || state.salvando}
              className={BOTAO_PERIGO}
              onClick={() => actions.removerPergunta(pergunta.id)}
            >
              <Trash2 size={24} strokeWidth={2.5} aria-hidden="true" />
            </button>
          )}
        </div>
        <fieldset className="m-0 flex min-w-0 flex-col gap-5 border-0 p-0" disabled={pergunta.salva || state.salvando}>
          {children}
        </fieldset>
      </li>
    </PerguntaContext>
  )
}
