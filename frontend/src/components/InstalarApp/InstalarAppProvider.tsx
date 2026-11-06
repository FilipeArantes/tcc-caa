import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { useInstalacaoStore, type EventoInstalacao } from '../../store/instalacaoStore'
import { useSessaoContext } from '../Sessao/useSessaoContext'
import { InstalarAppContext, type FormaDeInstalar } from './InstalarAppContext'

const DIAS_ENTRE_CONVITES = 7
const UM_DIA_MS = 86_400_000
const MODOS_DE_APP = ['standalone', 'fullscreen', 'minimal-ui']

function abertoComoApp(): boolean {
  const naTelaInicialDoIos = (navigator as Navigator & { standalone?: boolean }).standalone === true

  return naTelaInicialDoIos || MODOS_DE_APP.some((modo) => window.matchMedia(`(display-mode: ${modo})`).matches)
}

function aparelhoApple(): boolean {
  const agente = navigator.userAgent

  return /iPad|iPhone|iPod/.test(agente) || (agente.includes('Macintosh') && navigator.maxTouchPoints > 1)
}

function formaDeInstalar(instalado: boolean, pedido: EventoInstalacao | null, apple: boolean): FormaDeInstalar {
  if (instalado) {
    return 'instalado'
  }

  if (pedido !== null) {
    return 'nativa'
  }

  return apple ? 'apple' : 'menu'
}

export interface IInstalarAppProviderProps {
  children: ReactNode
}

export function InstalarAppProvider({ children }: IInstalarAppProviderProps) {
  const sessao = useSessaoContext()
  const pedido = useInstalacaoStore((estado) => estado.pedidoDoNavegador)
  const instaladoNestaVisita = useInstalacaoStore((estado) => estado.instaladoNestaVisita)
  const dispensadoEm = useInstalacaoStore((estado) => estado.dispensadoEm)
  const guardarPedido = useInstalacaoStore((estado) => estado.guardarPedido)
  const marcarInstalado = useInstalacaoStore((estado) => estado.marcarInstalado)
  const dispensarNoAparelho = useInstalacaoStore((estado) => estado.dispensar)

  const [jaAbertoComoApp] = useState(abertoComoApp)
  const [apple] = useState(aparelhoApple)
  const [inicioDaVisita] = useState(Date.now)
  const [conviteEncerrado, setConviteEncerrado] = useState(false)
  const [instalando, setInstalando] = useState(false)

  const forma = formaDeInstalar(jaAbertoComoApp || instaladoNestaVisita, pedido, apple)
  const dispensadoHaPouco =
    dispensadoEm !== null && inicioDaVisita - dispensadoEm < DIAS_ENTRE_CONVITES * UM_DIA_MS
  const conviteAberto =
    sessao.state.entrouAgora &&
    !conviteEncerrado &&
    !dispensadoHaPouco &&
    (forma === 'nativa' || forma === 'apple')

  const dispensar = useCallback(() => {
    dispensarNoAparelho()
    setConviteEncerrado(true)
  }, [dispensarNoAparelho])

  const instalar = useCallback(async () => {
    if (pedido === null) {
      return
    }

    setInstalando(true)

    try {
      await pedido.prompt()
      const { outcome } = await pedido.userChoice

      if (outcome === 'accepted') {
        marcarInstalado()
      } else {
        dispensarNoAparelho()
      }
    } finally {
      guardarPedido(null)
      setInstalando(false)
      setConviteEncerrado(true)
    }
  }, [pedido, marcarInstalado, dispensarNoAparelho, guardarPedido])

  const valor = useMemo(
    () => ({
      state: { forma, conviteAberto, instalando },
      actions: { instalar, dispensar },
      meta: { diasEntreConvites: DIAS_ENTRE_CONVITES },
    }),
    [forma, conviteAberto, instalando, instalar, dispensar]
  )

  return <InstalarAppContext value={valor}>{children}</InstalarAppContext>
}
