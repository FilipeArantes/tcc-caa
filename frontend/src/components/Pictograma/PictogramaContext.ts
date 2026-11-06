import { createContext } from 'react'
import type { CategoriaGramatical } from '../../types/Categoria'
import type { EstiloFitzgerald } from '../../types/fitzgerald'

export interface IPictogramaState {
  categoria: CategoriaGramatical
}

export interface IPictogramaMeta {
  estilo: EstiloFitzgerald
}

export interface IPictogramaContextValue {
  state: IPictogramaState
  meta: IPictogramaMeta
}

export const PictogramaContext = createContext<IPictogramaContextValue | null>(null)
