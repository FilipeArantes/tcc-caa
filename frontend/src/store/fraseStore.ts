import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Pictograma } from '../types/Pictograma'

interface EstadoFrase {
  pictogramasSelecionados: Pictograma[]
  adicionarPictograma: (pictograma: Pictograma) => void
  removerUltimoPictograma: () => void
  limparFrase: () => void
}

export const useFraseStore = create<EstadoFrase>()(
  persist(
    (set) => ({
      pictogramasSelecionados: [],
      adicionarPictograma: (pictograma) =>
        set((estado) => ({
          pictogramasSelecionados: [...estado.pictogramasSelecionados, pictograma],
        })),
      removerUltimoPictograma: () =>
        set((estado) => ({
          pictogramasSelecionados: estado.pictogramasSelecionados.slice(0, -1),
        })),
      limparFrase: () => set({ pictogramasSelecionados: [] }),
    }),
    {
      name: 'caa-frase',
      partialize: (estado) => ({ pictogramasSelecionados: estado.pictogramasSelecionados }),
    }
  )
)
