import type { Locator, Page } from '@playwright/test'
import type { Persona } from './personas'

export interface AlvoVisual {
  texto: string
  arquivo: string
}

export interface OpcoesSimulador {
  semente: number
  escalaTempo: number
}

export interface MetricasDoCenario {
  toques: number
  toquesInvoluntarios: number
  toquesMinimos: number | null
  menorAlvoPx: number | null
}

const REACAO_HUMANA_MINIMA_MS = 450

function gerador(semente: number): () => number {
  let estado = semente >>> 0

  return () => {
    estado = (estado + 0x6d2b79f5) >>> 0
    let t = estado
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export class Simulador {
  readonly persona: Persona
  readonly metricas: MetricasDoCenario = { toques: 0, toquesInvoluntarios: 0, toquesMinimos: null, menorAlvoPx: null }
  private readonly page: Page
  private readonly opcoes: OpcoesSimulador
  private readonly aleatorio: () => number

  constructor(page: Page, persona: Persona, opcoes: OpcoesSimulador) {
    this.page = page
    this.persona = persona
    this.opcoes = opcoes
    this.aleatorio = gerador(opcoes.semente)
  }

  esperarToquesMinimos(quantidade: number): void {
    this.metricas.toquesMinimos = quantidade
  }

  private entre([minimo, maximo]: [number, number]): number {
    return minimo + (maximo - minimo) * this.aleatorio()
  }

  async pensar(): Promise<void> {
    const reacao = Math.round(this.entre(this.persona.reacaoMs) * this.opcoes.escalaTempo)
    await this.page.waitForTimeout(Math.max(reacao, REACAO_HUMANA_MINIMA_MS))
  }

  private async coberto(alvo: Locator): Promise<boolean> {
    return alvo.evaluate((elemento) => {
      const caixa = elemento.getBoundingClientRect()
      const noTopo = document.elementFromPoint(caixa.x + caixa.width / 2, caixa.y + caixa.height / 2)

      return noTopo === null || !elemento.contains(noTopo)
    })
  }

  private async pontoDeToque(alvo: Locator): Promise<{ x: number; y: number }> {
    await alvo.scrollIntoViewIfNeeded()

    if (await this.coberto(alvo)) {
      await alvo.evaluate((elemento) => elemento.scrollIntoView({ block: 'center', inline: 'nearest' }))

      if (await this.coberto(alvo)) {
        throw new Error(`${this.persona.nome} não consegue tocar no alvo: ele fica coberto por outro elemento da tela`)
      }
    }

    const caixa = await alvo.boundingBox()

    if (caixa === null) {
      throw new Error(`${this.persona.nome} não encontrou o alvo na tela`)
    }

    const lado = Math.min(caixa.width, caixa.height)
    this.metricas.menorAlvoPx = Math.round(Math.min(this.metricas.menorAlvoPx ?? Infinity, lado))

    const angulo = this.aleatorio() * Math.PI * 2
    const alcance = this.aleatorio() * this.persona.imprecisao

    return {
      x: caixa.x + caixa.width / 2 + Math.cos(angulo) * alcance * (caixa.width / 2),
      y: caixa.y + caixa.height / 2 + Math.sin(angulo) * alcance * (caixa.height / 2),
    }
  }

  private async encostar(x: number, y: number): Promise<void> {
    await this.page.mouse.move(x, y)
    await this.page.mouse.down()
    await this.page.waitForTimeout(this.persona.duracaoToqueMs)
    await this.page.mouse.up()
  }

  async tocar(alvo: Locator): Promise<void> {
    await this.pensar()
    const { x, y } = await this.pontoDeToque(alvo)
    await this.encostar(x, y)
    this.metricas.toques++

    if (this.aleatorio() < this.persona.chanceToqueDuplo) {
      await this.page.waitForTimeout(this.persona.intervaloToqueDuploMs)
      await this.encostar(x, y)
      this.metricas.toques++
      this.metricas.toquesInvoluntarios++
    }
  }

  async tocarDuasVezesSemQuerer(alvo: Locator): Promise<void> {
    await this.pensar()
    const { x, y } = await this.pontoDeToque(alvo)
    await this.encostar(x, y)
    await this.page.waitForTimeout(this.persona.intervaloToqueDuploMs)
    await this.encostar(x, y)
    this.metricas.toques += 2
    this.metricas.toquesInvoluntarios++
  }

  localizarPorImagem(alvo: AlvoVisual): Locator {
    return this.page
      .getByRole('button')
      .filter({ has: this.page.locator(`img[src$="/${alvo.arquivo}"]`) })
      .first()
  }

  localizar(alvo: AlvoVisual): Locator {
    if (this.persona.le) {
      return this.page.getByRole('button', { name: alvo.texto, exact: true }).first()
    }

    return this.localizarPorImagem(alvo)
  }

  async tocarPictograma(alvo: AlvoVisual): Promise<void> {
    await this.tocar(this.localizar(alvo))
  }

  async abrirCategoria(alvo: AlvoVisual): Promise<void> {
    await this.tocar(this.localizar(alvo))
  }

  async tocarBotao(nomeAcessivel: string | RegExp): Promise<void> {
    await this.tocar(this.page.getByRole('button', { name: nomeAcessivel, exact: typeof nomeAcessivel === 'string' }))
  }

  async tocarTexto(texto: string): Promise<void> {
    await this.tocar(this.page.getByRole('button', { name: texto, exact: true }).first())
  }

  async repetirParaOuvir(alvo: AlvoVisual): Promise<void> {
    const localizador = this.localizar(alvo)

    for (let vez = 0; vez < this.persona.repeticoesParaOuvir; vez++) {
      await this.tocar(localizador)
    }
  }
}
