export interface AmostraLatencia {
  texto: string
  latenciaMs: number
  voz: string
  vozLocal: boolean
  aparelho: string
  navegador: string
  registradaEm: string
}

export interface ResumoLatencia {
  quantidade: number
  mediaMs: number
  desvioPadraoMs: number
}

const CHAVE = 'caa-latencia'
const LIMITE_DE_AMOSTRAS = 500

export function listarAmostras(): AmostraLatencia[] {
  try {
    const salvo = window.localStorage.getItem(CHAVE)
    return salvo === null ? [] : (JSON.parse(salvo) as AmostraLatencia[])
  } catch {
    return []
  }
}

export function registrarAmostra(amostra: AmostraLatencia): void {
  try {
    const amostras = [...listarAmostras(), amostra].slice(-LIMITE_DE_AMOSTRAS)
    window.localStorage.setItem(CHAVE, JSON.stringify(amostras))
  } catch {
    return
  }
}

export function limparAmostras(): void {
  try {
    window.localStorage.removeItem(CHAVE)
  } catch {
    return
  }
}

export function resumir(amostras: AmostraLatencia[]): ResumoLatencia {
  const quantidade = amostras.length

  if (quantidade === 0) {
    return { quantidade: 0, mediaMs: 0, desvioPadraoMs: 0 }
  }

  const mediaMs = amostras.reduce((soma, amostra) => soma + amostra.latenciaMs, 0) / quantidade
  const variancia =
    quantidade > 1
      ? amostras.reduce((soma, amostra) => soma + (amostra.latenciaMs - mediaMs) ** 2, 0) / (quantidade - 1)
      : 0

  return { quantidade, mediaMs, desvioPadraoMs: Math.sqrt(variancia) }
}

export function paraCsv(amostras: AmostraLatencia[]): string {
  const cabecalho = 'registrada_em;aparelho;navegador;voz;voz_local;texto;latencia_ms'
  const linhas = amostras.map((amostra) =>
    [
      amostra.registradaEm,
      amostra.aparelho,
      amostra.navegador,
      amostra.voz,
      amostra.vozLocal ? 'sim' : 'nao',
      `"${amostra.texto.replaceAll('"', '""')}"`,
      amostra.latenciaMs.toFixed(1).replace('.', ','),
    ].join(';')
  )

  return [cabecalho, ...linhas].join('\n')
}
