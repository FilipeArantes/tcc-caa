import { api } from './api'
import { responderMock, USAR_MOCK } from './mock'
import { PICTOGRAMAS_MOCK } from '../mocks/dadosComunicacao'
import type { Pictograma } from '../types/Pictograma'

export function buscarPictogramasPorCategoria(idCategoria: number) {
  if (USAR_MOCK) {
    return responderMock(
      PICTOGRAMAS_MOCK.filter((pictograma) => pictograma.id_categoria === idCategoria)
    )
  }

  return api.buscar<Pictograma[]>(`/categorias/${idCategoria}/pictogramas`)
}

export function buscarTodosPictogramas() {
  if (USAR_MOCK) {
    return responderMock(PICTOGRAMAS_MOCK)
  }

  return api.buscar<Pictograma[]>('/pictogramas')
}

interface DadosPictograma {
  id_categoria: number
  texto_pictograma: string
  nome_pictograma: string
}

export function criarPictograma(dados: DadosPictograma) {
  return api.enviar<Pictograma>('/pictogramas', dados)
}

export function atualizarPictograma(id: number, dados: Partial<DadosPictograma>) {
  return api.atualizar<Pictograma>(`/pictogramas/${id}`, dados)
}

export function removerPictograma(id: number) {
  return api.remover<void>(`/pictogramas/${id}`)
}
