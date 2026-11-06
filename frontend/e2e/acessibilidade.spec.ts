import { verificarAxe } from './suporte/acessibilidade'
import { expect, test } from './suporte/fixtures'

test.describe('Verificação automática de acessibilidade (axe)', () => {
  test('tela de comunicação', async ({ page }, testInfo) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Coisas', exact: true })).toBeVisible()
    await verificarAxe(page, 'comunicacao', testInfo)
  })

  test('categoria aberta', async ({ page }, testInfo) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Coisas', exact: true }).click()
    await expect(page.getByRole('button', { name: 'água', exact: true })).toBeVisible()
    await verificarAxe(page, 'categoria-aberta', testInfo)
  })

  test('escrita livre', async ({ page }, testInfo) => {
    await page.goto('/escrita-livre')
    await expect(page.getByRole('button', { name: 'A', exact: true })).toBeVisible()
    await verificarAxe(page, 'escrita-livre', testInfo)
  })

  test('lista de quizzes', async ({ page }, testInfo) => {
    await page.goto('/quiz')
    await expect(page.getByRole('button', { name: /O que é isso\?/ })).toBeVisible()
    await verificarAxe(page, 'quiz-lista', testInfo)
  })

  test('quiz em andamento', async ({ page }, testInfo) => {
    await page.goto('/quiz/1')
    await expect(page.getByRole('button', { name: 'Água', exact: true })).toBeVisible()
    await verificarAxe(page, 'quiz-jogo', testInfo)
  })

  test('créditos', async ({ page }, testInfo) => {
    await page.goto('/creditos')
    await expect(page.getByRole('heading', { name: 'Créditos e licenças' })).toBeVisible()
    await verificarAxe(page, 'creditos', testInfo)
  })

  test('área do mediador', async ({ page }, testInfo) => {
    await page.goto('/')
    const chave = page.getByRole('button', { name: 'Área do mediador' })
    await chave.focus()
    await page.keyboard.down('Enter')
    await page.waitForTimeout(2200)
    await page.keyboard.up('Enter')
    await expect(page.getByRole('dialog')).toBeVisible()
    await verificarAxe(page, 'area-mediador', testInfo)
  })
})
