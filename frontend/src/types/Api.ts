export interface RespostaDados<T> {
  data: T
}

export interface Pagina<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}
