import { useBarraFraseContext } from './useBarraFraseContext'

const TRILHA = 'flex min-h-24 min-w-0 flex-1 basis-full items-center gap-3 overflow-x-auto sm:basis-80'

const VAZIA = 'text-entrada text-discreto'

const ITEM = 'flex w-24 shrink-0 flex-col items-center gap-1'

const ITEM_IMAGEM = 'aspect-square w-20 rounded-xl border border-borda bg-surface object-contain p-1'

const ITEM_ROTULO = 'w-full text-center text-rotulo font-bold break-words'

export function BarraFraseTrilha() {
  const { state } = useBarraFraseContext()

  if (state.vazia) {
    return (
      <div className={TRILHA}>
        <p className={VAZIA}>Toque nos pictogramas para montar sua frase</p>
      </div>
    )
  }

  return (
    <div className={TRILHA} aria-live="polite">
      {state.pictogramas.map((pictograma, indice) => (
        <div key={`${pictograma.id}-${indice}`} className={ITEM}>
          <img
            src={`/pictogramas/${pictograma.nome_pictograma}`}
            alt=""
            className={ITEM_IMAGEM}
          />
          <span className={ITEM_ROTULO}>{pictograma.texto_pictograma}</span>
        </div>
      ))}
    </div>
  )
}
