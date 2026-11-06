export type CategoriaGramatical =
  | 'verbo'
  | 'substantivo'
  | 'pessoa'
  | 'adjetivo'
  | 'social'
  | 'adverbio'
  | 'diversos'

export interface Categoria {
  id: number
  nome_categoria: string
  categoria_gramatical: CategoriaGramatical
  nome_pictograma: string
}
