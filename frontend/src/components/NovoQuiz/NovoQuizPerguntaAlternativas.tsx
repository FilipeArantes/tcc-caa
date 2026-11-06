import { Check, Plus, Trash2 } from 'lucide-react'
import { BOTAO_PERIGO, BOTAO_TRACEJADO, ENTRADA, ROTULO } from './estilos'
import { useNovoQuizContext, usePerguntaContext } from './useNovoQuizContext'

const CERTA =
  'flex h-acao w-36 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 px-3 text-rotulo font-bold ' +
  'has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-primary'

export function NovoQuizPerguntaAlternativas() {
  const { actions, meta } = useNovoQuizContext()
  const pergunta = usePerguntaContext()
  const limite = pergunta.alternativas.length >= meta.maximoAlternativas

  return (
    <fieldset className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0">
      <legend className={`${ROTULO} mb-2 p-0`}>
        Alternativas <span className="font-normal text-discreto">(marque a certa)</span>
      </legend>
      <ol className="m-0 flex list-none flex-col gap-3 p-0">
        {pergunta.alternativas.map((alternativa, indice) => {
          const marcada = pergunta.idCerta === alternativa.id

          return (
            <li key={alternativa.id} className="flex items-center gap-3">
              <label
                className={`${CERTA} ${marcada ? 'border-acerto bg-acerto-soft text-acerto' : 'border-borda bg-surface text-discreto'}`}
              >
                <input
                  type="radio"
                  name={`certa-${pergunta.id}`}
                  checked={marcada}
                  className="sr-only"
                  onChange={() => actions.marcarCerta(pergunta.id, alternativa.id)}
                />
                <Check size={22} strokeWidth={3} aria-hidden="true" />
                <span>{marcada ? 'Certa' : 'Certa?'}</span>
                <span className="sr-only">alternativa {indice + 1}</span>
              </label>
              <input
                type="text"
                value={alternativa.texto}
                maxLength={100}
                aria-label={`Alternativa ${indice + 1}`}
                placeholder={`Alternativa ${indice + 1}`}
                autoComplete="off"
                className={ENTRADA}
                onChange={(evento) => actions.alterarAlternativa(pergunta.id, alternativa.id, evento.target.value)}
              />
              <button
                type="button"
                aria-label={`Remover alternativa ${indice + 1}`}
                disabled={pergunta.alternativas.length <= meta.minimoAlternativas}
                className={BOTAO_PERIGO}
                onClick={() => actions.removerAlternativa(pergunta.id, alternativa.id)}
              >
                <Trash2 size={24} strokeWidth={2.5} aria-hidden="true" />
              </button>
            </li>
          )
        })}
      </ol>
      <button
        type="button"
        disabled={limite}
        className={BOTAO_TRACEJADO}
        onClick={() => actions.adicionarAlternativa(pergunta.id)}
      >
        <Plus size={24} strokeWidth={2.5} aria-hidden="true" />
        <span>{limite ? `Máximo de ${meta.maximoAlternativas} alternativas` : 'Adicionar alternativa'}</span>
      </button>
    </fieldset>
  )
}
