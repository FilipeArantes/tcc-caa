import AxeBuilder from '@axe-core/playwright'
import { expect, type Page, type TestInfo } from '@playwright/test'

export const ALVO_MINIMO_PX = 48
export const LATENCIA_MAXIMA_MS = 300

export async function animacoesAtivas(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    document
      .getAnimations()
      .filter((animacao) => animacao.playState === 'running' && animacao instanceof CSSAnimation)
      .map((animacao) => (animacao as CSSAnimation).animationName)
  )
}

export async function posicoes(page: Page, seletor: string): Promise<Record<string, { x: number; y: number }>> {
  return page.locator(seletor).evaluateAll((elementos) =>
    Object.fromEntries(
      elementos.map((elemento) => {
        const caixa = elemento.getBoundingClientRect()
        const estilo = getComputedStyle(elemento)
        const matriz = new DOMMatrixReadOnly(estilo.transform === 'none' ? undefined : estilo.transform)
        const [translateX = 0, translateY = 0] =
          estilo.translate === 'none' ? [] : estilo.translate.split(' ').map((valor) => Number.parseFloat(valor))
        return [
          elemento.textContent?.trim() ?? '',
          {
            x: Math.round(caixa.x - matriz.m41 - translateX),
            y: Math.round(caixa.y - matriz.m42 - translateY),
          },
        ]
      })
    )
  )
}

export async function verificarAxe(page: Page, tela: string, testInfo: TestInfo): Promise<void> {
  const resultado = await new AxeBuilder({ page } as unknown as ConstructorParameters<typeof AxeBuilder>[0])
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()

  const porImpacto = { critical: 0, serious: 0, moderate: 0, minor: 0 }

  for (const violacao of resultado.violations) {
    if (violacao.impact != null) {
      porImpacto[violacao.impact] += violacao.nodes.length
    }
  }

  testInfo.annotations.push({
    type: 'axe',
    description: JSON.stringify({
      tela,
      dispositivo: testInfo.project.name,
      aprovadas: resultado.passes.length,
      ...porImpacto,
      regras: resultado.violations.map((violacao) => `${violacao.id} (${violacao.impact})`),
    }),
  })

  await testInfo.attach(`axe-${tela}`, { body: JSON.stringify(resultado, null, 2), contentType: 'application/json' })

  const graves = resultado.violations.filter((violacao) => violacao.impact === 'serious' || violacao.impact === 'critical')

  expect(
    graves.map((violacao) => `${violacao.id}: ${violacao.help} (${violacao.nodes.length})`),
    `violações graves de acessibilidade em ${tela}`
  ).toEqual([])
}
