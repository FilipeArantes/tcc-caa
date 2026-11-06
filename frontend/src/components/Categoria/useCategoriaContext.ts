import { use } from 'react'
import { CategoriaContext, type ICategoriaContextValue } from './CategoriaContext'

export function useCategoriaContext(): ICategoriaContextValue {
  const contexto = use(CategoriaContext)

  if (contexto === null) {
    throw new Error('As partes da Categoria precisam estar dentro de Categoria.Root.')
  }

  return contexto
}
