import { ImagePlus, Trash2 } from 'lucide-react'
import { useId } from 'react'
import { BOTAO_PERIGO, BOTAO_SECUNDARIO, ROTULO } from './estilos'
import { useNovoQuizContext, usePerguntaContext } from './useNovoQuizContext'

const CAIXA = 'flex flex-col gap-3 rounded-2xl bg-fundo p-4'

export function NovoQuizPerguntaImagem() {
  const { state, actions } = useNovoQuizContext()
  const pergunta = usePerguntaContext()
  const id = useId()

  return (
    <div className={CAIXA}>
      <span className={ROTULO}>Imagem</span>
      {pergunta.previaImagem !== null ? (
        <div className="flex items-start gap-3">
          <img src={pergunta.previaImagem} alt="Prévia da imagem" className="max-h-40 min-w-0 flex-1 rounded-xl object-contain" />
          <button
            type="button"
            aria-label="Remover imagem"
            className={BOTAO_PERIGO}
            onClick={() => actions.definirImagem(pergunta.id, null)}
          >
            <Trash2 size={24} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      ) : null}
      <label htmlFor={id} className={`${BOTAO_SECUNDARIO} cursor-pointer has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-40`}>
        <ImagePlus size={24} strokeWidth={2.5} aria-hidden="true" />
        <span>{state.preparandoMidia ? 'Preparando…' : pergunta.previaImagem === null ? 'Escolher foto' : 'Trocar foto'}</span>
        <input
          id={id}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(evento) => {
            const arquivo = evento.target.files?.[0] ?? null
            evento.target.value = ''
            if (arquivo !== null) {
              void actions.definirImagem(pergunta.id, arquivo)
            }
          }}
        />
      </label>
    </div>
  )
}
