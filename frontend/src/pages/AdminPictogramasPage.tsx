import { useEffect, useState } from 'react'
import { buscarCategorias } from '../services/categoriaService'
import {
  buscarTodosPictogramas,
  criarPictograma,
  removerPictograma,
} from '../services/pictogramaService'
import type { Categoria } from '../types/Categoria'
import type { Pictograma } from '../types/Pictograma'

export function AdminPictogramasPage() {
  const [pictogramas, setPictogramas] = useState<Pictograma[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [textoPictograma, setTextoPictograma] = useState('')
  const [nomeArquivo, setNomeArquivo] = useState('')
  const [idCategoria, setIdCategoria] = useState<number | null>(null)

  useEffect(() => {
    buscarTodosPictogramas().then(setPictogramas)
    buscarCategorias().then(setCategorias)
  }, [])

  async function adicionarPictograma() {
    if (idCategoria === null || textoPictograma.trim().length === 0) {
      return
    }

    const novoPictograma = await criarPictograma({
      id_categoria: idCategoria,
      texto_pictograma: textoPictograma,
      nome_pictograma: nomeArquivo,
    })

    setPictogramas((atual) => [...atual, novoPictograma])
    setTextoPictograma('')
    setNomeArquivo('')
  }

  async function excluirPictograma(id: number) {
    await removerPictograma(id)
    setPictogramas((atual) => atual.filter((pictograma) => pictograma.id !== id))
  }

  return (
    <div className="admin-pictogramas-pagina">
      <h1>Gerenciar Pictogramas</h1>

      <div className="formulario-pictograma">
        <select value={idCategoria ?? ''} onChange={(evento) => setIdCategoria(Number(evento.target.value))}>
          <option value="">Selecione uma categoria</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nome_categoria}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Texto do pictograma"
          value={textoPictograma}
          onChange={(evento) => setTextoPictograma(evento.target.value)}
        />
        <input
          type="text"
          placeholder="Nome do arquivo de imagem"
          value={nomeArquivo}
          onChange={(evento) => setNomeArquivo(evento.target.value)}
        />
        <button type="button" onClick={adicionarPictograma}>
          Adicionar
        </button>
      </div>

      <ul className="lista-pictogramas-admin">
        {pictogramas.map((pictograma) => (
          <li key={pictograma.id}>
            {pictograma.texto_pictograma}
            <button type="button" onClick={() => excluirPictograma(pictograma.id)}>
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
