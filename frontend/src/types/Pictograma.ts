import type { CategoriaGramatical } from './Categoria'

export interface Pictograma {
  id: number
  id_categoria: number
  texto_pictograma: string
  nome_pictograma: string
  categoria_gramatical?: CategoriaGramatical
}
