import type { ButtonHTMLAttributes } from 'react'
import { FITZGERALD } from '../../types/fitzgerald'
import type { CategoriaGramatical } from '../../types/Categoria'

const BOTAO =
  'flex min-w-0 flex-col items-center justify-between gap-1 rounded-xl border-2 p-1 sm:border-4 sm:p-2 ' +
  'transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:brightness-90'

const IMAGEM = 'aspect-square w-full rounded-lg bg-surface object-contain p-0.5'

const ROTULO = 'w-full text-center text-[13px] font-bold leading-tight sm:text-rotulo'

export interface INucleoPalavraProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  gramatical: CategoriaGramatical
  pictograma: string
  texto: string
}

export function NucleoPalavra({
  gramatical,
  pictograma,
  texto,
  ...props
}: INucleoPalavraProps) {
  const estilo = FITZGERALD[gramatical]

  return (
    <button {...props} type="button" className={[BOTAO, estilo.fundo, estilo.borda].join(' ')}>
      <img src={`/pictogramas/${pictograma}`} alt="" className={IMAGEM} />
      <span className={[ROTULO, estilo.texto].join(' ')}>{texto}</span>
    </button>
  )
}
