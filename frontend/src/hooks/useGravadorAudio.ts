import { useCallback, useEffect, useRef, useState } from 'react'

export type SituacaoGravador = 'parado' | 'gravando' | 'indisponivel'

const DURACAO_MAXIMA_SEGUNDOS = 60

const FORMATOS_PREFERIDOS = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm']

function formatoSuportado(): string | null {
  if (typeof MediaRecorder === 'undefined') {
    return null
  }

  return FORMATOS_PREFERIDOS.find((formato) => MediaRecorder.isTypeSupported(formato)) ?? ''
}

function extensao(tipo: string): string {
  return tipo.includes('mp4') ? 'm4a' : 'webm'
}

export function useGravadorAudio(aoTerminar: (arquivo: File) => void) {
  const disponivel = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && formatoSuportado() !== null
  const [situacao, setSituacao] = useState<SituacaoGravador>(disponivel ? 'parado' : 'indisponivel')
  const [segundos, setSegundos] = useState(0)
  const [erro, setErro] = useState<string | null>(null)
  const gravadorRef = useRef<MediaRecorder | null>(null)
  const relogioRef = useRef<number | null>(null)

  const pararRelogio = useCallback(() => {
    if (relogioRef.current !== null) {
      window.clearInterval(relogioRef.current)
      relogioRef.current = null
    }
  }, [])

  const parar = useCallback(() => {
    if (gravadorRef.current?.state === 'recording') {
      gravadorRef.current.stop()
    }
  }, [])

  const iniciar = useCallback(async () => {
    setErro(null)

    let fluxo: MediaStream

    try {
      fluxo = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      setErro('Não foi possível usar o microfone. Verifique a permissão do navegador.')
      return
    }

    const formato = formatoSuportado() ?? ''
    const gravador = formato === '' ? new MediaRecorder(fluxo) : new MediaRecorder(fluxo, { mimeType: formato })
    const pedacos: Blob[] = []

    gravador.ondataavailable = (evento) => pedacos.push(evento.data)
    gravador.onstop = () => {
      pararRelogio()
      fluxo.getTracks().forEach((trilha) => trilha.stop())
      const tipo = gravador.mimeType || formato || 'audio/webm'
      const tipoBase = tipo.split(';')[0]
      aoTerminar(new File(pedacos, `gravacao.${extensao(tipoBase)}`, { type: tipoBase }))
      setSituacao('parado')
    }

    gravadorRef.current = gravador
    gravador.start()
    setSegundos(0)
    setSituacao('gravando')
    relogioRef.current = window.setInterval(() => {
      setSegundos((atual) => {
        if (atual + 1 >= DURACAO_MAXIMA_SEGUNDOS) {
          parar()
        }
        return atual + 1
      })
    }, 1000)
  }, [aoTerminar, parar, pararRelogio])

  useEffect(
    () => () => {
      pararRelogio()
      if (gravadorRef.current?.state === 'recording') {
        gravadorRef.current.stop()
      }
    },
    [pararRelogio]
  )

  return { situacao, segundos, erro, iniciar, parar, duracaoMaxima: DURACAO_MAXIMA_SEGUNDOS }
}
