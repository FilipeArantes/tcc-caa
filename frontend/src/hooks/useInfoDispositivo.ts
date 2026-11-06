import { useSyncExternalStore } from 'react'
import { VERSAO_SISTEMA } from '../config/aplicativo'

export interface InfoDispositivo {
  versao: string
  aparelho: string
  navegador: string
  tela: string
  online: boolean
  vozDisponivel: boolean
  instalado: boolean
}

export function identificarAparelho(agente: string): string {
  if (/iPad/.test(agente) || (/Macintosh/.test(agente) && navigator.maxTouchPoints > 1)) {
    return 'iPad'
  }

  if (/iPhone/.test(agente)) {
    return 'iPhone'
  }

  if (/Android/.test(agente)) {
    return /Mobile/.test(agente) ? 'Celular Android' : 'Tablet Android'
  }

  if (/Windows/.test(agente)) {
    return 'Computador Windows'
  }

  if (/Macintosh/.test(agente)) {
    return 'Mac'
  }

  if (/Linux/.test(agente)) {
    return 'Computador Linux'
  }

  return 'Não identificado'
}

export function identificarNavegador(agente: string): string {
  if (/Edg\//.test(agente)) {
    return 'Edge'
  }

  if (/SamsungBrowser/.test(agente)) {
    return 'Samsung Internet'
  }

  if (/Firefox|FxiOS/.test(agente)) {
    return 'Firefox'
  }

  if (/Chrome|CriOS/.test(agente)) {
    return 'Chrome'
  }

  if (/Safari/.test(agente)) {
    return 'Safari'
  }

  return 'Não identificado'
}

function assinarConexao(aoMudar: () => void): () => void {
  window.addEventListener('online', aoMudar)
  window.addEventListener('offline', aoMudar)

  return () => {
    window.removeEventListener('online', aoMudar)
    window.removeEventListener('offline', aoMudar)
  }
}

export function useInfoDispositivo(): InfoDispositivo {
  const online = useSyncExternalStore(assinarConexao, () => navigator.onLine)
  const agente = navigator.userAgent

  return {
    versao: VERSAO_SISTEMA,
    aparelho: identificarAparelho(agente),
    navegador: identificarNavegador(agente),
    tela: `${window.screen.width} × ${window.screen.height}`,
    online,
    vozDisponivel: 'speechSynthesis' in window,
    instalado: window.matchMedia('(display-mode: standalone)').matches,
  }
}
