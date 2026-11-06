import type { CategoriaGramatical } from './Categoria'

export interface EstiloFitzgerald {
  fundo: string
  texto: string
  borda: string
}

export const FITZGERALD: Record<CategoriaGramatical, EstiloFitzgerald> = {
  verbo: {
    fundo: 'bg-cat-verbo',
    texto: 'text-white',
    borda: 'border-cat-verbo',
  },
  substantivo: {
    fundo: 'bg-cat-substantivo',
    texto: 'text-white',
    borda: 'border-cat-substantivo',
  },
  pessoa: {
    fundo: 'bg-cat-pessoa',
    texto: 'text-texto',
    borda: 'border-cat-pessoa',
  },
  adjetivo: {
    fundo: 'bg-cat-adjetivo',
    texto: 'text-white',
    borda: 'border-cat-adjetivo',
  },
  social: {
    fundo: 'bg-cat-social',
    texto: 'text-texto',
    borda: 'border-cat-social',
  },
  adverbio: {
    fundo: 'bg-cat-adverbio',
    texto: 'text-white',
    borda: 'border-cat-adverbio',
  },
  diversos: {
    fundo: 'bg-cat-diversos',
    texto: 'text-texto',
    borda: 'border-borda',
  },
}
