export interface Persona {
  id: string
  nome: string
  perfil: string
  le: boolean
  reacaoMs: [number, number]
  imprecisao: number
  duracaoToqueMs: number
  chanceToqueDuplo: number
  intervaloToqueDuploMs: number
  repeticoesParaOuvir: number
  movimentoReduzido: boolean
}

export const LUCAS: Persona = {
  id: 'lucas-tea',
  nome: 'Lucas',
  perfil: 'criança de 7 anos com TEA não verbal, comunica principalmente por pictogramas',
  le: false,
  reacaoMs: [400, 1200],
  imprecisao: 0.15,
  duracaoToqueMs: 120,
  chanceToqueDuplo: 0.1,
  intervaloToqueDuploMs: 150,
  repeticoesParaOuvir: 4,
  movimentoReduzido: true,
}

export const MARCOS: Persona = {
  id: 'marcos-di',
  nome: 'Marcos',
  perfil: 'adulto de 24 anos com deficiência intelectual leve, em processo de letramento',
  le: true,
  reacaoMs: [1500, 4000],
  imprecisao: 0.25,
  duracaoToqueMs: 250,
  chanceToqueDuplo: 0.1,
  intervaloToqueDuploMs: 350,
  repeticoesParaOuvir: 1,
  movimentoReduzido: false,
}

export const JOSE: Persona = {
  id: 'jose-afasia',
  nome: 'José',
  perfil: 'adulto de 63 anos com afasia após AVC, usa a mão não dominante',
  le: false,
  reacaoMs: [3000, 8000],
  imprecisao: 0.4,
  duracaoToqueMs: 800,
  chanceToqueDuplo: 0.3,
  intervaloToqueDuploMs: 200,
  repeticoesParaOuvir: 1,
  movimentoReduzido: false,
}

export const PERSONAS: Persona[] = [LUCAS, MARCOS, JOSE]
