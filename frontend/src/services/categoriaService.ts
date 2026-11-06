import { api } from './api'
import { responderMock, USAR_MOCK } from './mock'
import { CATEGORIAS_MOCK } from '../mocks/dadosComunicacao'
import type { Categoria } from '../types/Categoria'

export function buscarCategorias() {
  if (USAR_MOCK) {
    return responderMock(CATEGORIAS_MOCK)
  }

  return api.buscar<Categoria[]>('/categorias')
}
