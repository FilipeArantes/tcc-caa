import { spawn, spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import playwright from '@playwright/test'

const PORTA = 5176
const BASE = `http://localhost:${PORTA}`
const PASTA = join(dirname(fileURLToPath(import.meta.url)), 'resultados', 'lighthouse')
const TELAS = [
  { nome: 'comunicacao', rota: '/' },
  { nome: 'escrita-livre', rota: '/escrita-livre' },
  { nome: 'creditos', rota: '/creditos' },
]
const CATEGORIAS = ['accessibility', 'best-practices', 'performance']
const NOMES = { accessibility: 'Acessibilidade', 'best-practices': 'Boas práticas', performance: 'Desempenho' }

async function esperarServidor() {
  for (let tentativa = 0; tentativa < 60; tentativa++) {
    try {
      await fetch(BASE)
      return
    } catch {
      await new Promise((resolver) => setTimeout(resolver, 500))
    }
  }

  throw new Error('O servidor de preview não respondeu')
}

mkdirSync(PASTA, { recursive: true })
const servidor = spawn('npx', ['vite', 'preview', '--port', String(PORTA), '--strictPort'], { stdio: 'ignore' })

try {
  await esperarServidor()
  const linhas = []

  for (const tela of TELAS) {
    const saida = join(PASTA, tela.nome)
    const execucao = spawnSync(
      'npx',
      [
        '-y',
        'lighthouse@12',
        `${BASE}${tela.rota}`,
        `--only-categories=${CATEGORIAS.join(',')}`,
        '--output=html',
        '--output=json',
        `--output-path=${saida}`,
        '--chrome-flags=--headless=new --no-sandbox',
        '--quiet',
      ],
      { env: { ...process.env, CHROME_PATH: playwright.chromium.executablePath() }, encoding: 'utf8' }
    )

    if (execucao.status !== 0) {
      throw new Error(`Lighthouse falhou em ${tela.nome}: ${execucao.stderr}`)
    }

    const relatorio = JSON.parse(readFileSync(`${saida}.report.json`, 'utf8'))
    const notas = CATEGORIAS.map((categoria) => Math.round((relatorio.categories[categoria]?.score ?? 0) * 100))
    linhas.push(`| ${tela.nome} | ${notas.join(' | ')} |`)
    console.log(tela.nome, notas.join(' / '))
  }

  writeFileSync(
    join(PASTA, 'resumo.md'),
    [
      '# Lighthouse (build de produção, perfil móvel)',
      '',
      `Execução: ${new Date().toLocaleString('pt-BR')}`,
      '',
      `| Tela | ${CATEGORIAS.map((categoria) => NOMES[categoria]).join(' | ')} |`,
      `| --- | ${CATEGORIAS.map(() => '---').join(' | ')} |`,
      ...linhas,
      '',
    ].join('\n')
  )
} finally {
  servidor.kill()
}
