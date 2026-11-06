import { createContext } from 'react'
import type { CategoriaGramatical } from '../../types/Categoria'
import type { EstiloFitzgerald } from '../../types/fitzgerald'

export interface ICategoriaState {
  gramatical: CategoriaGramatical
}

export interface ICategoriaMeta {
  estilo: EstiloFitzgerald
}

export interface ICategoriaContextValue {
  state: ICategoriaState
  meta: ICategoriaMeta
}

export const CategoriaContext = createContext<ICategoriaContextValue | null>(null)
