import type { Page } from '@playwright/test'
import { verificarAxe } from './suporte/acessibilidade'
import { expect, test } from './suporte/fixtures'

const AGENTE_IPHONE =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) ' +
  'Version/18.0 Mobile/15E148 Safari/604.1'

async function prepararNavegador(page: Page, comPedidoDoNavegador: boolean) {
  await page.addInitScript((simularPedido: boolean) => {
    const registro = { pedidos: 0 }
    Object.defineProperty(window, '__instalacao', { value: registro })

    window.addEventListener(
      'beforeinstallprompt',
      (evento) => {
        if (evento.isTrusted) {
          evento.stopImmediatePropagation()
        }
      },
      true
    )

    if (!simularPedido) {
      return
    }

    window.addEventListener('load', () => {
      const pedido = Object.assign(new Event('beforeinstallprompt', { cancelable: true }), {
        prompt: async () => {
          registro.pedidos++
        },
        userChoice: Promise.resolve({ outcome: 'accepted', platform: 'web' }),
      })
      window.dispatchEvent(pedido)
    })
  }, comPedidoDoNavegador)

  const validade = new Date(Date.now() + 8 * 3_600_000).toISOString()

  await page.route('**/api/auth/token', (rota) =>
    rota.fulfill({
      json: {
        data: {
          usuario: {
            id: 1,
            nome: 'Maria Mediadora',
            email: 'maria@exemplo.com',
            idade_confirmada: true,
            papel: 'mediador',
            criado_em: '2026-11-06T10:00:00Z',
          },
          tokens: {
            mediador: { token: 'token-mediador', tipo: 'Bearer', expira_em: validade, modo: 'mediador' },
            usuario: { token: 'token-usuario', tipo: 'Bearer', expira_em: validade, modo: 'usuario' },
          },
        },
      },
    })
  )
}

const REACAO_HUMANA_MS = 500

async function voltarDoGoogle(page: Page) {
  await page.goto(`/mediador/callback?codigo=${'a'.repeat(64)}`)
  await expect(page.getByRole('button', { name: 'Voltar ao modo normal' }).first()).toBeVisible()
}

async function lerConvite(page: Page) {
  const convite = page.getByRole('dialog', { name: 'Instalar o Diz Aí' })
  await expect(convite).toBeVisible()
  await page.waitForTimeout(REACAO_HUMANA_MS)

  return convite
}

test.describe('Convite para instalar o app depois do login', () => {
  test('no Chrome, oferece instalar e chama o instalador do navegador', async ({ page }, testInfo) => {
    await prepararNavegador(page, true)
    await voltarDoGoogle(page)

    const convite = await lerConvite(page)
    await verificarAxe(page, 'convite-instalacao', testInfo)
    await testInfo.attach('convite-instalacao', { body: await page.screenshot(), contentType: 'image/png' })

    await convite.getByRole('button', { name: 'Instalar o app' }).click()

    await expect(convite).toBeHidden()
    expect(await page.evaluate(() => (window as unknown as { __instalacao: { pedidos: number } }).__instalacao.pedidos)).toBe(1)
  })

  test('"Agora não" fecha e não insiste no próximo login', async ({ page }) => {
    await prepararNavegador(page, true)
    await voltarDoGoogle(page)

    const convite = await lerConvite(page)
    await convite.getByRole('button', { name: 'Agora não' }).click()
    await expect(convite).toBeHidden()

    await voltarDoGoogle(page)
    await page.waitForTimeout(1000)
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })

  test.describe('no iPhone', () => {
    test.use({ userAgent: AGENTE_IPHONE })

    test('mostra o caminho pelo Compartilhar do Safari', async ({ page }, testInfo) => {
      await prepararNavegador(page, false)
      await voltarDoGoogle(page)

      const convite = await lerConvite(page)
      await expect(convite.getByText('Adicionar à Tela de Início')).toBeVisible()
      await testInfo.attach('convite-instalacao-iphone', { body: await page.screenshot(), contentType: 'image/png' })

      await convite.getByRole('button', { name: 'Entendi' }).click()
      await expect(convite).toBeHidden()
    })
  })

  test('sem login, o convite não aparece', async ({ page }) => {
    await prepararNavegador(page, true)
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Coisas', exact: true })).toBeVisible()
    await page.waitForTimeout(1000)

    await expect(page.getByRole('dialog')).toHaveCount(0)
  })
})
