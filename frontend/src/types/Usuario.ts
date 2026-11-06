export interface Usuario {
  id: number
  nome: string
  email: string | null
  idade_confirmada: boolean
  papel: string
  criado_em: string
}
