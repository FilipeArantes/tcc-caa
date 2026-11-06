import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface EstadoSidebar {
  aberta: boolean
  alternar: () => void
  abrir: () => void
  fechar: () => void
}

export const useSidebarStore = create<EstadoSidebar>()(
  persist(
    (set) => ({
      aberta: true,
      alternar: () => set((estado) => ({ aberta: !estado.aberta })),
      abrir: () => set({ aberta: true }),
      fechar: () => set({ aberta: false }),
    }),
    { name: 'caa-sidebar' }
  )
)
