import { useCallback, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react'
import { useSidebarStore } from '../../store/sidebarStore'
import { SidebarContext } from './SidebarContext'

const CONSULTA_TELA_ESTREITA = '(max-width: 767px)'

function assinarTela(aoMudar: () => void): () => void {
  const consulta = window.matchMedia(CONSULTA_TELA_ESTREITA)
  consulta.addEventListener('change', aoMudar)

  return () => consulta.removeEventListener('change', aoMudar)
}

function telaEstreitaAgora(): boolean {
  return window.matchMedia(CONSULTA_TELA_ESTREITA).matches
}

export interface ISidebarProviderProps {
  children: ReactNode
}

export function SidebarProvider({ children }: ISidebarProviderProps) {
  const abertaNaTelaLarga = useSidebarStore((estado) => estado.aberta)
  const alternarNaTelaLarga = useSidebarStore((estado) => estado.alternar)
  const telaEstreita = useSyncExternalStore(assinarTela, telaEstreitaAgora)
  const [abertaNaTelaEstreita, setAbertaNaTelaEstreita] = useState(false)

  const aberta = telaEstreita ? abertaNaTelaEstreita : abertaNaTelaLarga

  const alternar = useCallback(() => {
    if (telaEstreita) {
      setAbertaNaTelaEstreita((atual) => !atual)
      return
    }

    alternarNaTelaLarga()
  }, [telaEstreita, alternarNaTelaLarga])

  const valor = useMemo(
    () => ({
      state: { aberta },
      actions: { alternar },
      meta: { larguraAberta: 260, larguraFechada: 84 },
    }),
    [aberta, alternar]
  )

  return <SidebarContext value={valor}>{children}</SidebarContext>
}
