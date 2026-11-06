import { Grade } from '../../components/Grade'
import { Pictograma } from '../../components/Pictograma'
import type { Categoria } from '../../types/Categoria'
import type { Pictograma as TipoPictograma } from '../../types/Pictograma'

const VAZIO = 'text-entrada text-texto'

export interface IGradePictogramasProps {
  categoria: Categoria
  pictogramas: TipoPictograma[]
  aoEscolher: (pictograma: TipoPictograma) => void
}

export function GradePictogramas({
  categoria,
  pictogramas,
  aoEscolher,
}: IGradePictogramasProps) {
  if (pictogramas.length === 0) {
    return <p className={VAZIO}>Nenhum pictograma nesta categoria ainda.</p>
  }

  return (
    <Grade.Root>
      {pictogramas.map((pictograma) => (
        <Pictograma.Root
          key={pictograma.id}
          categoria={categoria.categoria_gramatical}
          onClick={() => aoEscolher(pictograma)}
        >
          <Pictograma.Image
            pictograma={pictograma.nome_pictograma}
            pictogramaAlt=""
          />
          <Pictograma.Content text={pictograma.texto_pictograma} />
        </Pictograma.Root>
      ))}
    </Grade.Root>
  )
}
