import type { Page } from '@playwright/test'
import { ALVO_MINIMO_PX, LATENCIA_MAXIMA_MS, animacoesAtivas, posicoes } from './suporte/acessibilidade'
import { expect, test } from './suporte/fixtures'
import { JOSE, LUCAS, MARCOS, PERSONAS } from './suporte/personas'
import type { Simulador } from './suporte/simulador'
import { falas, registroDeFalas } from './suporte/tts'

const QUERO = { texto: 'quero', arquivo: 'querer.png' }
const EU = { texto: 'eu', arquivo: 'eu.png' }
const PARE = { texto: 'pare', arquivo: 'parar.png' }
const ME_AJUDA = { texto: 'me ajuda', arquivo: 'ajuda.png' }
const COISAS = { texto: 'Coisas', arquivo: 'casa.png' }
const SOCIAL = { texto: 'Social', arquivo: 'oi.png' }
const DIVERSOS = { texto: 'Diversos', arquivo: 'diversos.png' }
const AGUA = { texto: 'água', arquivo: 'agua.png' }
const SUCO = { texto: 'suco', arquivo: 'suco.png' }
const DOR = { texto: 'dor', arquivo: 'dor.png' }
const BOM_DIA = { texto: 'bom dia', arquivo: 'bomdia.png' }

async function abrirPrancha(page: Page) {
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Coisas', exact: true })).toBeVisible()
}

async function conferirCriterios(page: Page, simulador: Simulador) {
  expect(simulador.metricas.menorAlvoPx ?? Infinity, 'menor alvo tocado (RNF01)').toBeGreaterThanOrEqual(ALVO_MINIMO_PX)

  const latencias = (await registroDeFalas(page))
    .map((fala) => fala.desdeToqueMs)
    .filter((valor): valor is number => valor !== null)

  for (const latencia of latencias) {
    expect(latencia, 'tempo entre o toque e o início da fala (RNF02)').toBeLessThanOrEqual(LATENCIA_MAXIMA_MS)
  }
}

function semRepeticao(texto: string): string {
  return texto.replace(/\b(\p{L}+)(?: \1\b)+/gu, '$1')
}

async function textoEscrito(page: Page): Promise<string> {
  return page.evaluate(() => {
    const salvo = window.localStorage.getItem('caa-escrita')
    return salvo === null ? '' : (JSON.parse(salvo) as { state: { texto: string } }).state.texto
  })
}

async function escrever(page: Page, simulador: Simulador, alvo: string) {
  for (let tentativa = 0; tentativa < 60; tentativa++) {
    const atual = await textoEscrito(page)

    if (atual === alvo) {
      return
    }

    if (!alvo.startsWith(atual)) {
      await simulador.tocarBotao('Apagar última letra')
      continue
    }

    const proxima = alvo[atual.length]
    await (proxima === ' ' ? simulador.tocarBotao(/Espaço/) : simulador.tocarTexto(proxima.toLocaleUpperCase('pt-BR')))
  }

  throw new Error(`${simulador.persona.nome} não conseguiu escrever "${alvo}"`)
}

test.describe(`${LUCAS.nome}: ${LUCAS.perfil}`, () => {
  test.use({ persona: LUCAS })

  test('pede água pela prancha de pictogramas', async ({ page, simulador }) => {
    simulador.esperarToquesMinimos(4)
    await abrirPrancha(page)

    await simulador.tocarPictograma(QUERO)
    await simulador.abrirCategoria(COISAS)
    await simulador.tocarPictograma(AGUA)
    await simulador.tocarBotao('Falar a frase')

    await expect.poll(async () => (await falas(page)).map(semRepeticao)).toContain('quero água')
    await conferirCriterios(page, simulador)
  })

  test('diz "pare" com um toque', async ({ page, simulador }) => {
    simulador.esperarToquesMinimos(1)
    await abrirPrancha(page)

    await simulador.tocarPictograma(PARE)

    await expect.poll(() => falas(page)).toContain('pare')
    await conferirCriterios(page, simulador)
  })

  test('repete a palavra para ouvir de novo', async ({ page, simulador }) => {
    simulador.esperarToquesMinimos(LUCAS.repeticoesParaOuvir)
    await abrirPrancha(page)

    await simulador.repetirParaOuvir(QUERO)

    await expect
      .poll(async () => (await falas(page)).filter((texto) => texto === 'quero').length)
      .toBeGreaterThanOrEqual(LUCAS.repeticoesParaOuvir)
    await conferirCriterios(page, simulador)
  })

  test('responde um quiz de associação de imagens', async ({ page, simulador }) => {
    test.fail(
      true,
      'Achado conhecido: as alternativas do quiz são só texto; quem não lê não consegue escolher a resposta'
    )
    simulador.esperarToquesMinimos(5)
    await page.goto('/quiz/1')
    await expect(page.getByRole('img', { name: 'Qual é a bebida?' })).toBeVisible()

    await simulador.tocarPictograma({ texto: 'Água', arquivo: 'agua.png' })
    await simulador.tocarBotao('Próxima')
    await simulador.tocarPictograma({ texto: 'Bola', arquivo: 'bola.png' })
    await simulador.tocarBotao('Terminar')

    await expect(page.getByRole('heading', { name: 'Você terminou!' })).toBeVisible()
    await conferirCriterios(page, simulador)
  })

  test('nada pisca nem se mexe com movimento reduzido', async ({ page, simulador }) => {
    simulador.esperarToquesMinimos(2)
    await abrirPrancha(page)

    await simulador.tocarPictograma(QUERO)
    await simulador.tocarBotao('Falar a frase')

    expect(await animacoesAtivas(page)).toEqual([])
  })
})

test.describe(`${MARCOS.nome}: ${MARCOS.perfil}`, () => {
  test.use({ persona: MARCOS })

  test('escreve "oi mamãe" no teclado e fala', async ({ page, simulador }) => {
    simulador.esperarToquesMinimos(9)
    await page.goto('/escrita-livre')
    await expect(page.getByRole('button', { name: 'A', exact: true })).toBeVisible()

    await escrever(page, simulador, 'oi mamãe')
    await simulador.tocarBotao('Falar o texto')

    await expect.poll(() => falas(page)).toContain('oi mamãe')
    await conferirCriterios(page, simulador)
  })

  test('responde um quiz de associação de imagens, erra e tenta de novo', async ({ page, simulador }) => {
    simulador.esperarToquesMinimos(6)
    await page.goto('/quiz')

    await simulador.tocarBotao(/O que é isso\?/)
    await expect(page.getByRole('img', { name: 'Qual é a bebida?' })).toBeVisible()
    await simulador.tocarTexto('Leite')
    await expect(page.getByText('Tente de novo')).toBeVisible()
    await simulador.tocarTexto('Água')
    await simulador.tocarBotao('Próxima')
    await simulador.tocarTexto('Bola')
    await simulador.tocarBotao('Terminar')

    await expect(page.getByRole('heading', { name: 'Você terminou!' })).toBeVisible()
    await conferirCriterios(page, simulador)
  })

  test('monta a frase "eu quero suco"', async ({ page, simulador }) => {
    simulador.esperarToquesMinimos(5)
    await abrirPrancha(page)

    await simulador.tocarPictograma(EU)
    await simulador.tocarPictograma(QUERO)
    await simulador.abrirCategoria(COISAS)
    await simulador.tocarPictograma(SUCO)
    await simulador.tocarBotao('Falar a frase')

    await expect.poll(async () => (await falas(page)).map(semRepeticao)).toContain('eu quero suco')
    await conferirCriterios(page, simulador)
  })
})

test.describe(`${JOSE.nome}: ${JOSE.perfil}`, () => {
  test.use({ persona: JOSE })

  test('avisa que está com dor', async ({ page, simulador }) => {
    simulador.esperarToquesMinimos(2)
    await abrirPrancha(page)

    await simulador.abrirCategoria(DIVERSOS)
    await simulador.tocarPictograma(DOR)

    await expect.poll(() => falas(page)).toContain('dor')
    await conferirCriterios(page, simulador)
  })

  test('cumprimenta com "bom dia"', async ({ page, simulador }) => {
    simulador.esperarToquesMinimos(2)
    await abrirPrancha(page)

    await simulador.abrirCategoria(SOCIAL)
    await simulador.tocarPictograma(BOM_DIA)

    await expect.poll(() => falas(page)).toContain('bom dia')
    await conferirCriterios(page, simulador)
  })

  test('pede ajuda com um toque', async ({ page, simulador }) => {
    simulador.esperarToquesMinimos(1)
    await abrirPrancha(page)

    await simulador.tocarPictograma(ME_AJUDA)

    await expect.poll(() => falas(page)).toContain('me ajuda')
    await conferirCriterios(page, simulador)
  })
})

for (const persona of PERSONAS) {
  test.describe(`${persona.nome}: verificações comuns`, () => {
    test.use({ persona })

    test('não ouve nenhum som sem tocar', async ({ page }) => {
      await abrirPrancha(page)
      await page.waitForTimeout(1500)

      expect(await falas(page)).toEqual([])
    })

    test('toque duplo acidental no Limpar não apaga a frase', async ({ page, simulador }) => {
      simulador.esperarToquesMinimos(1)
      await abrirPrancha(page)
      await simulador.tocarPictograma(QUERO)
      await expect(page.getByRole('button', { name: 'Limpar toda a frase' })).toBeEnabled()

      await simulador.tocarDuasVezesSemQuerer(page.getByRole('button', { name: 'Limpar toda a frase' }))

      expect(await page.getByRole('dialog').count()).toBeLessThanOrEqual(1)
      await expect(page.getByRole('button', { name: 'Apagar último pictograma' })).toBeEnabled()
      await expect(page.getByRole('button', { name: 'quero', exact: true }).first()).toBeVisible()
    })

    test('as categorias ficam no mesmo lugar depois de voltar', async ({ page, simulador }) => {
      await abrirPrancha(page)
      const antes = await posicoes(page, 'main [aria-label="Palavras mais usadas"] ~ div button')

      await simulador.abrirCategoria(COISAS)
      await simulador.tocarBotao('Voltar')
      await expect(page.getByRole('button', { name: 'Coisas', exact: true })).toBeVisible()

      expect(await posicoes(page, 'main [aria-label="Palavras mais usadas"] ~ div button')).toEqual(antes)
    })
  })
}
