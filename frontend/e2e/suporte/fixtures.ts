import { test as base } from '@playwright/test'
import { simularApiDeQuizzes } from './dados'
import { LUCAS, type Persona } from './personas'
import { Simulador } from './simulador'
import { instalarTTSFalso, registroDeFalas } from './tts'

function sementeDoTeste(titulo: string): number {
  const fixa = process.env.E2E_SEMENTE

  if (fixa !== undefined) {
    return Number(fixa)
  }

  let hash = 2166136261

  for (const caractere of titulo) {
    hash ^= caractere.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

function escalaTempo(): number {
  if (process.env.E2E_TEMPO_REAL === '1') {
    return 1
  }

  return Number(process.env.E2E_ESCALA_TEMPO ?? '0.1')
}

interface FixturesPersona {
  persona: Persona
  simulador: Simulador
}

export const test = base.extend<FixturesPersona>({
  persona: [LUCAS, { option: true }],

  reducedMotion: async ({ persona }, usar) => {
    await usar(persona.movimentoReduzido ? 'reduce' : 'no-preference')
  },

  page: async ({ page }, usar) => {
    await instalarTTSFalso(page)
    await simularApiDeQuizzes(page)
    await usar(page)
  },

  simulador: async ({ page, persona }, usar, testInfo) => {
    const semente = sementeDoTeste(testInfo.titlePath.join(' › '))
    const simulador = new Simulador(page, persona, { semente, escalaTempo: escalaTempo() })

    await usar(simulador)

    const latencias = await registroDeFalas(page)
      .then((registro) => registro.map((fala) => fala.desdeToqueMs).filter((valor): valor is number => valor !== null))
      .catch(() => [])

    testInfo.annotations.push({
      type: 'cenario',
      description: JSON.stringify({
        persona: persona.nome,
        perfil: persona.perfil,
        cenario: testInfo.title,
        dispositivo: testInfo.project.name,
        semente,
        ...simulador.metricas,
        falas: latencias.length,
        latenciaMaximaMs: latencias.length > 0 ? Math.round(Math.max(...latencias)) : null,
      }),
    })
  },
})

export { expect } from '@playwright/test'
