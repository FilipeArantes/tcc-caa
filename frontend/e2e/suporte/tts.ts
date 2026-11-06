import type { Page } from '@playwright/test'

export interface Fala {
  texto: string
  em: number
  desdeToqueMs: number | null
}

export async function instalarTTSFalso(page: Page, msPorCaractere = 60): Promise<void> {
  await page.addInitScript((ms: number) => {
    const registro: { texto: string; em: number; desdeToqueMs: number | null }[] = []
    let ultimoToque: number | null = null
    let atual: SpeechSynthesisUtterance | null = null
    let temporizador: number | undefined

    document.addEventListener('pointerup', () => (ultimoToque = performance.now()), true)

    function encerrar(interrompida: boolean) {
      if (temporizador !== undefined) {
        window.clearTimeout(temporizador)
        temporizador = undefined
      }

      if (atual === null) {
        return
      }

      const enunciado = atual
      atual = null
      falso.speaking = false

      if (interrompida) {
        enunciado.onerror?.(new Event('error') as SpeechSynthesisErrorEvent)
        return
      }

      enunciado.onend?.(new Event('end') as SpeechSynthesisEvent)
    }

    const falso = {
      speaking: false,
      pending: false,
      paused: false,
      onvoiceschanged: null,
      speak(enunciado: SpeechSynthesisUtterance) {
        encerrar(true)
        const agora = performance.now()
        registro.push({ texto: enunciado.text, em: agora, desdeToqueMs: ultimoToque === null ? null : agora - ultimoToque })
        ultimoToque = null
        atual = enunciado
        falso.speaking = true
        enunciado.onstart?.(new Event('start') as SpeechSynthesisEvent)
        temporizador = window.setTimeout(() => encerrar(false), Math.max(300, enunciado.text.length * ms))
      },
      cancel() {
        encerrar(true)
      },
      pause() {},
      resume() {},
      getVoices() {
        return []
      },
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return true
      },
    }

    Object.defineProperty(window, 'speechSynthesis', { value: falso, configurable: true })
    Object.defineProperty(window, '__falasCAA', { value: registro })
  }, msPorCaractere)
}

export async function registroDeFalas(page: Page): Promise<Fala[]> {
  return page.evaluate(() => (window as unknown as { __falasCAA: Fala[] }).__falasCAA.map((fala) => ({ ...fala })))
}

export async function falas(page: Page): Promise<string[]> {
  return (await registroDeFalas(page)).map((fala) => fala.texto)
}
