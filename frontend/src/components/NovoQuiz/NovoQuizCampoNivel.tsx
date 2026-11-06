import { NOMES_DOS_NIVEIS, type NivelQuiz } from '../../types/Quiz'
import { ROTULO } from './estilos'
import { useNovoQuizContext } from './useNovoQuizContext'

const NIVEIS: NivelQuiz[] = ['facil', 'medio', 'dificil']

const OPCAO =
  'flex h-acao flex-1 cursor-pointer items-center justify-center rounded-2xl border-2 px-4 text-rotulo font-bold ' +
  'transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-primary'

const MARCADA = `${OPCAO} border-primary bg-primary text-white`

const LIVRE = `${OPCAO} border-borda bg-surface text-texto hover:bg-fundo`

export function NovoQuizCampoNivel() {
  const { state, actions } = useNovoQuizContext()

  return (
    <fieldset className="m-0 flex flex-col gap-2 border-0 p-0" disabled={state.quizJaCriado || state.salvando}>
      <legend className={`${ROTULO} mb-2 p-0`}>Nível</legend>
      <div className="flex flex-col gap-3 sm:flex-row">
        {NIVEIS.map((nivel) => (
          <label key={nivel} className={state.nivel === nivel ? MARCADA : LIVRE}>
            <input
              type="radio"
              name="nivel"
              value={nivel}
              checked={state.nivel === nivel}
              className="sr-only"
              onChange={() => actions.alterarNivel(nivel)}
            />
            {NOMES_DOS_NIVEIS[nivel]}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
