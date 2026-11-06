import { Download, Eraser } from 'lucide-react'
import { useState } from 'react'
import { useTTS } from '../../hooks/useTTS'
import { limparAmostras, listarAmostras, paraCsv, resumir } from '../../services/latenciaService'
import { BOTAO_PERIGO, BOTAO_SECUNDARIO } from './estilos'

const LIMITE_RNF02_MS = 300

const LISTA = 'm-0 grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl bg-fundo p-4 sm:grid-cols-4'

const ROTULO = 'text-base text-discreto'

const VALOR = 'm-0 text-rotulo font-bold text-texto'

const TEXTO = 'm-0 text-base leading-relaxed text-discreto'

function formatarMs(valor: number): string {
  return `${valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} ms`
}

export function AreaMediadorLatencia() {
  const { voz } = useTTS()
  const [amostras, setAmostras] = useState(listarAmostras)
  const resumo = resumir(amostras)

  function baixarCsv() {
    const arquivo = new Blob([paraCsv(amostras)], { type: 'text/csv;charset=utf-8' })
    const endereco = URL.createObjectURL(arquivo)
    const link = document.createElement('a')
    link.href = endereco
    link.download = `latencia-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(endereco)
  }

  function limpar() {
    limparAmostras()
    setAmostras([])
  }

  const itens = [
    { rotulo: 'Medições', valor: String(resumo.quantidade) },
    { rotulo: 'Média', valor: resumo.quantidade > 0 ? formatarMs(resumo.mediaMs) : '—' },
    { rotulo: 'Desvio-padrão', valor: resumo.quantidade > 1 ? formatarMs(resumo.desvioPadraoMs) : '—' },
    {
      rotulo: `Meta (RNF02)`,
      valor: resumo.quantidade > 0 ? (resumo.mediaMs < LIMITE_RNF02_MS ? 'Atende' : 'Não atende') : '—',
    },
  ]

  return (
    <div className="flex flex-col gap-3">
      <p className={TEXTO}>
        Cada toque em pictograma registra o tempo até a fala começar. Voz em uso:{' '}
        <strong className="text-texto">
          {voz === null ? 'padrão do navegador' : `${voz.nome} (${voz.local ? 'instalada no aparelho' : 'depende de internet'})`}
        </strong>
        .
      </p>
      <dl className={LISTA}>
        {itens.map((item) => (
          <div key={item.rotulo} className="flex flex-col gap-0.5">
            <dt className={ROTULO}>{item.rotulo}</dt>
            <dd className={VALOR}>{item.valor}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" className={BOTAO_SECUNDARIO} disabled={resumo.quantidade === 0} onClick={baixarCsv}>
          <Download size={24} strokeWidth={2.5} aria-hidden="true" />
          <span>Baixar CSV</span>
        </button>
        <button type="button" className={BOTAO_PERIGO} disabled={resumo.quantidade === 0} onClick={limpar}>
          <Eraser size={24} strokeWidth={2.5} aria-hidden="true" />
          <span>Limpar medições</span>
        </button>
      </div>
    </div>
  )
}
