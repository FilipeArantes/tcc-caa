import { api } from './api'
import { responderMock, USAR_MOCK } from './mock'
import { NUCLEO_MOCK } from '../mocks/dadosComunicacao'
import type { Pictograma } from '../types/Pictograma'

export function buscarNucleo() {
  if (USAR_MOCK) {
    return responderMock(NUCLEO_MOCK)
  }

  return api.buscar<Pictograma[]>('/pictogramas/nucleo')
}
