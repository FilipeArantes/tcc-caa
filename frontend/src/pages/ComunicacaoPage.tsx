import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { buscarCategorias } from '../services/categoriaService'
import { buscarNucleo } from '../services/nucleoService'
import { buscarPictogramasPorCategoria } from '../services/pictogramaService'
import { useFraseStore } from '../store/fraseStore'
import { useProtecaoToqueDuplo } from '../hooks/useProtecaoToqueDuplo'
import { useTTS } from '../hooks/useTTS'
import { BarraFrase } from '../components/BarraFrase'
import { Navegacao } from '../components/Navegacao'
import { FaixaNucleo } from './comunicacao/FaixaNucleo'
import { GradeCategorias } from './comunicacao/GradeCategorias'
import { GradePictogramas } from './comunicacao/GradePictogramas'
import type { Categoria as TipoCategoria } from '../types/Categoria'
import type { Pictograma as TipoPictograma } from '../types/Pictograma'

const PAGINA = 'flex flex-col gap-6'

export function ComunicacaoPage() {
  const [categorias, setCategorias] = useState<TipoCategoria[]>([])
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<TipoCategoria | null>(null)
  const [pictogramas, setPictogramas] = useState<TipoPictograma[]>([])
  const [nucleo, setNucleo] = useState<TipoPictograma[]>([])

  const adicionarPictograma = useFraseStore((estado) => estado.adicionarPictograma)
  const { falar } = useTTS()
  const protecao = useProtecaoToqueDuplo()
  const paginaRef = useRef<HTMLDivElement>(null)
  const rolagemDasCategorias = useRef(0)

  useEffect(() => {
    buscarCategorias().then(setCategorias)
    buscarNucleo().then(setNucleo)
  }, [])

  useEffect(() => {
    if (categoriaSelecionada === null) {
      setPictogramas([])
      return
    }

    buscarPictogramasPorCategoria(categoriaSelecionada.id).then(setPictogramas)
  }, [categoriaSelecionada])

  function escolherPictograma(pictograma: TipoPictograma) {
    const instanteDoToque = performance.now()

    if (!protecao.toqueLiberado()) {
      return
    }

    adicionarPictograma(pictograma)
    falar(pictograma.texto_pictograma, instanteDoToque)
  }

  function trocarCategoria(categoria: TipoCategoria | null) {
    if (!protecao.toqueLiberado()) {
      return
    }

    const areaRolavel = paginaRef.current?.closest('main')

    if (categoria !== null && areaRolavel) {
      rolagemDasCategorias.current = areaRolavel.scrollTop
    }

    protecao.marcarMudanca()
    setCategoriaSelecionada(categoria)
  }

  useLayoutEffect(() => {
    const areaRolavel = paginaRef.current?.closest('main')

    if (areaRolavel) {
      areaRolavel.scrollTop = categoriaSelecionada === null ? rolagemDasCategorias.current : 0
    }
  }, [categoriaSelecionada])

  return (
    <BarraFrase.Provider>
      <div ref={paginaRef} className={PAGINA}>
        <BarraFrase.Root>
          <BarraFrase.Trilha />
          <BarraFrase.Falar />
          <BarraFrase.Apagar />
          <BarraFrase.Limpar />
        </BarraFrase.Root>

        <FaixaNucleo palavras={nucleo} aoEscolher={escolherPictograma} />

        {categoriaSelecionada === null ? (
          <GradeCategorias categorias={categorias} aoSelecionar={trocarCategoria} />
        ) : (
          <>
            <Navegacao.Root>
              <Navegacao.Voltar onClick={() => trocarCategoria(null)} />
              <Navegacao.Trilha caminho={['Categorias', categoriaSelecionada.nome_categoria]} />
            </Navegacao.Root>

            <GradePictogramas
              categoria={categoriaSelecionada}
              pictogramas={pictogramas}
              aoEscolher={escolherPictograma}
            />
          </>
        )}
      </div>
    </BarraFrase.Provider>
  )
}
