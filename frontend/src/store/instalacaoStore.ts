import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface EventoInstalacao extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

interface EstadoInstalacao {
  pedidoDoNavegador: EventoInstalacao | null
  instaladoNestaVisita: boolean
  dispensadoEm: number | null
  guardarPedido: (pedido: EventoInstalacao | null) => void
  marcarInstalado: () => void
  dispensar: () => void
}

export const useInstalacaoStore = create<EstadoInstalacao>()(
  persist(
    (set) => ({
      pedidoDoNavegador: null,
      instaladoNestaVisita: false,
      dispensadoEm: null,
      guardarPedido: (pedido) => set({ pedidoDoNavegador: pedido }),
      marcarInstalado: () => set({ pedidoDoNavegador: null, instaladoNestaVisita: true }),
      dispensar: () => set({ dispensadoEm: Date.now() }),
    }),
    {
      name: 'caa-instalacao',
      partialize: (estado) => ({ dispensadoEm: estado.dispensadoEm }),
    }
  )
)

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (evento) => {
    evento.preventDefault()
    useInstalacaoStore.getState().guardarPedido(evento as EventoInstalacao)
  })

  window.addEventListener('appinstalled', () => useInstalacaoStore.getState().marcarInstalado())
}
