import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter'

interface LinhaCenario {
  persona: string
  perfil: string
  cenario: string
  dispositivo: string
  semente: number
  toques: number
  toquesInvoluntarios: number
  toquesMinimos: number | null
  menorAlvoPx: number | null
  falas: number
  latenciaMaximaMs: number | null
  concluido: boolean
  erro: string | null
  achadoConhecido: string | null
}

interface LinhaAxe {
  tela: string
  dispositivo: string
  aprovadas: number
  critical: number
  serious: number
  moderate: number
  minor: number
  regras: string[]
}

const CORES_DO_TERMINAL = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, 'g')

const PASTA = join(dirname(fileURLToPath(import.meta.url)), '..', 'resultados')

function anotacao(resultado: TestResult, tipo: string): string | undefined {
  return resultado.annotations.find((item) => item.type === tipo)?.description
}

function primeiraLinha(texto: string | undefined): string | null {
  if (texto === undefined) {
    return null
  }

  return texto.replace(CORES_DO_TERMINAL, '').split('\n').find((linha) => linha.trim().length > 0)?.trim() ?? null
}

function valor(numero: number | null, sufixo = ''): string {
  return numero === null ? '—' : `${numero}${sufixo}`
}

export default class RelatorioPersonas implements Reporter {
  private readonly cenarios: LinhaCenario[] = []
  private readonly axe: LinhaAxe[] = []

  onTestEnd(teste: TestCase, resultado: TestResult): void {
    const cenario = anotacao(resultado, 'cenario')
    const axe = anotacao(resultado, 'axe')

    if (cenario !== undefined) {
      const achadoConhecido = teste.expectedStatus === 'failed' ? (anotacao(resultado, 'fail') ?? 'achado conhecido') : null

      this.cenarios.push({
        ...(JSON.parse(cenario) as Omit<LinhaCenario, 'concluido' | 'erro' | 'achadoConhecido'>),
        concluido: resultado.status === 'passed',
        erro: resultado.status === 'passed' ? null : primeiraLinha(resultado.error?.message),
        achadoConhecido,
      })
    }

    if (axe !== undefined) {
      this.axe.push(JSON.parse(axe) as LinhaAxe)
    }
  }

  onEnd(): void {
    if (this.cenarios.length === 0 && this.axe.length === 0) {
      return
    }

    mkdirSync(PASTA, { recursive: true })
    const ordenar = <T extends { dispositivo: string }>(linhas: T[], chave: (linha: T) => string) =>
      [...linhas].sort((a, b) => a.dispositivo.localeCompare(b.dispositivo) || chave(a).localeCompare(chave(b)))

    const cenarios = ordenar(this.cenarios, (linha) => `${linha.persona} ${linha.cenario}`)
    const axe = ordenar(this.axe, (linha) => linha.tela)
    const data = new Date().toLocaleString('pt-BR')
    const linhas: string[] = [`# Testes baseados em cenários e personas`, '', `Execução: ${data}`, '']

    if (cenarios.length > 0) {
      const concluidos = cenarios.filter((linha) => linha.concluido).length
      linhas.push(
        `## Cenários (${concluidos} de ${cenarios.length} concluídos)`,
        '',
        '| Dispositivo | Persona | Cenário | Concluído | Toques (mínimo) | Involuntários | Menor alvo | Latência máx. (toque → fala) |',
        '| --- | --- | --- | --- | --- | --- | --- | --- |',
        ...cenarios.map(
          (linha) =>
            `| ${linha.dispositivo} | ${linha.persona} | ${linha.cenario} | ${linha.concluido ? 'Sim' : linha.achadoConhecido !== null ? 'Não (achado conhecido)' : 'Não'} | ${linha.toques} (${valor(linha.toquesMinimos)}) | ${linha.toquesInvoluntarios} | ${valor(linha.menorAlvoPx, ' px')} | ${valor(linha.latenciaMaximaMs, ' ms')} |`
        ),
        ''
      )

      const achados = cenarios.filter((linha) => !linha.concluido && linha.achadoConhecido !== null)
      const falhas = cenarios.filter((linha) => !linha.concluido && linha.achadoConhecido === null)

      if (achados.length > 0) {
        linhas.push(
          '### Achados conhecidos',
          '',
          ...achados.map((linha) => `- **${linha.persona} · ${linha.cenario} · ${linha.dispositivo}**: ${linha.achadoConhecido}`),
          ''
        )
      }

      if (falhas.length > 0) {
        linhas.push(
          '### Cenários não concluídos',
          '',
          ...falhas.map((linha) => `- **${linha.persona} · ${linha.cenario} · ${linha.dispositivo}** (semente ${linha.semente}): ${linha.erro ?? 'sem mensagem'}`),
          ''
        )
      }
    }

    if (axe.length > 0) {
      linhas.push(
        '## Acessibilidade automática (axe-core, WCAG 2.2 A/AA)',
        '',
        '| Dispositivo | Tela | Regras aprovadas | Crítico | Sério | Moderado | Leve | Violações |',
        '| --- | --- | --- | --- | --- | --- | --- | --- |',
        ...axe.map(
          (linha) =>
            `| ${linha.dispositivo} | ${linha.tela} | ${linha.aprovadas} | ${linha.critical} | ${linha.serious} | ${linha.moderate} | ${linha.minor} | ${linha.regras.join(', ') || '—'} |`
        ),
        ''
      )
    }

    writeFileSync(join(PASTA, 'cenarios-personas.md'), linhas.join('\n'))
    writeFileSync(join(PASTA, 'cenarios-personas.json'), JSON.stringify({ data, cenarios, axe }, null, 2))
  }
}
