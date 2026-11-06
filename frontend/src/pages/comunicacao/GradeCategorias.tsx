import { Categoria } from '../../components/Categoria'
import { Grade } from '../../components/Grade'
import type { Categoria as TipoCategoria } from '../../types/Categoria'

export interface IGradeCategoriasProps {
  categorias: TipoCategoria[]
  aoSelecionar: (categoria: TipoCategoria) => void
}

export function GradeCategorias({ categorias, aoSelecionar }: IGradeCategoriasProps) {
  return (
    <Grade.Root>
      {categorias.map((categoria) => (
        <Categoria.Root
          key={categoria.id}
          gramatical={categoria.categoria_gramatical}
          onClick={() => aoSelecionar(categoria)}
        >
          <Categoria.Image
            pictograma={categoria.nome_pictograma}
            pictogramaAlt=""
          />
          <Categoria.Content text={categoria.nome_categoria} />
        </Categoria.Root>
      ))}
    </Grade.Root>
  )
}
