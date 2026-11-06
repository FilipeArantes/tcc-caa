import { useCallback, useEffect, useRef, useState } from 'react'
import { registrarAmostra } from '../services/latenciaService'
import { identificarAparelho, identificarNavegador } from './useInfoDispositivo'

export interface VozEscolhida {
  nome: string
  local: boolean
}

function ehPortuguesDoBrasil(voz: SpeechSynthesisVoice): boolean {
  return voz.lang.replace('_', '-').toLowerCase() === 'pt-br'
}

function ehPortugues(voz: SpeechSynthesisVoice): boolean {
  return voz.lang.toLowerCase().startsWith('pt')
}

export function escolherVoz(vozes: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  return (
    vozes.find((voz) => ehPortuguesDoBrasil(voz) && voz.localService) ??
    vozes.find((voz) => ehPortugues(voz) && voz.localService) ??
    vozes.find(ehPortuguesDoBrasil) ??
    vozes.find(ehPortugues) ??
    null
  )
}

export function useTTS() {
  const [suportado, setSuportado] = useState(false)
  const [falando, setFalando] = useState(false)
  const [voz, setVoz] = useState<VozEscolhida | null>(null)
  const vozRef = useRef<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return
    }

    setSuportado(true)

    function atualizarVoz() {
      const escolhida = escolherVoz(window.speechSynthesis.getVoices())
      vozRef.current = escolhida
      setVoz(escolhida === null ? null : { nome: escolhida.name, local: escolhida.localService })
    }

    atualizarVoz()
    window.speechSynthesis.addEventListener('voiceschanged', atualizarVoz)

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', atualizarVoz)
      window.speechSynthesis.cancel()
    }
  }, [])

  const falar = useCallback(
    (texto: string, instanteDoToque?: number) => {
      if (!suportado || texto.trim().length === 0) {
        return
      }

      window.speechSynthesis.cancel()

      const enunciado = new SpeechSynthesisUtterance(texto)
      enunciado.lang = 'pt-BR'

      if (vozRef.current !== null) {
        enunciado.voice = vozRef.current
      }

      enunciado.onstart = () => {
        setFalando(true)

        if (instanteDoToque !== undefined) {
          registrarAmostra({
            texto,
            latenciaMs: performance.now() - instanteDoToque,
            voz: vozRef.current?.name ?? 'padrão do navegador',
            vozLocal: vozRef.current?.localService ?? false,
            aparelho: identificarAparelho(navigator.userAgent),
            navegador: identificarNavegador(navigator.userAgent),
            registradaEm: new Date().toISOString(),
          })
        }
      }
      enunciado.onend = () => setFalando(false)
      enunciado.onerror = () => setFalando(false)

      window.speechSynthesis.speak(enunciado)
    },
    [suportado]
  )

  return { falar, suportado, falando, voz }
}
