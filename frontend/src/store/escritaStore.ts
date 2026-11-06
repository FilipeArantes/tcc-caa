import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface EstadoEscrita {
  texto: string
  digitar: (caractere: string) => void
  apagarUltimo: () => void
  limpar: () => void
}

export const useEscritaStore = create<EstadoEscrita>()(
  persist(
    (set) => ({
      texto: '',
      digitar: (caractere) => set((estado) => ({ texto: estado.texto + caractere })),
      apagarUltimo: () => set((estado) => ({ texto: Array.from(estado.texto).slice(0, -1).join('') })),
      limpar: () => set({ texto: '' }),
    }),
    {
      name: 'caa-escrita',
      partialize: (estado) => ({ texto: estado.texto }),
    }
  )
)
