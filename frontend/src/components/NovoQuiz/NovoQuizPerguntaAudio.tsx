import { FileAudio, Mic, Square, Trash2 } from 'lucide-react'
import { useCallback, useId } from 'react'
import { useGravadorAudio } from '../../hooks/useGravadorAudio'
import { BOTAO_PERIGO, BOTAO_SECUNDARIO, ROTULO } from './estilos'
import { useNovoQuizContext, usePerguntaContext } from './useNovoQuizContext'

const CAIXA = 'flex flex-col gap-3 rounded-2xl bg-fundo p-4'

const GRAVANDO =
  'flex h-acao items-center justify-center gap-2 rounded-2xl bg-erro px-5 text-rotulo font-bold text-white ' +
  'hover:opacity-90'

function tempo(segundos: number): string {
  return `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}`
}

export function NovoQuizPerguntaAudio() {
  const { actions } = useNovoQuizContext()
  const pergunta = usePerguntaContext()
  const id = useId()
  const definir = actions.definirAudio
  const aoTerminar = useCallback((arquivo: File) => definir(pergunta.id, arquivo), [definir, pergunta.id])
  const gravador = useGravadorAudio(aoTerminar)

  return (
    <div className={CAIXA}>
      <span className={ROTULO}>Áudio</span>
      {pergunta.previaAudio !== null ? (
        <div className="flex items-center gap-3">
          <audio controls src={pergunta.previaAudio} className="min-w-0 flex-1" />
          <button
            type="button"
            aria-label="Remover áudio"
            className={BOTAO_PERIGO}
            onClick={() => actions.definirAudio(pergunta.id, null)}
          >
            <Trash2 size={24} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        {gravador.situacao === 'gravando' ? (
          <button type="button" className={GRAVANDO} onClick={gravador.parar}>
            <Square size={22} strokeWidth={2.5} aria-hidden="true" />
            <span>
              Parar ({tempo(gravador.segundos)} de {tempo(gravador.duracaoMaxima)})
            </span>
          </button>
        ) : (
          <button
            type="button"
            className={BOTAO_SECUNDARIO}
            disabled={gravador.situacao === 'indisponivel'}
            onClick={() => void gravador.iniciar()}
          >
            <Mic size={24} strokeWidth={2.5} aria-hidden="true" />
            <span>Gravar</span>
          </button>
        )}
        <label htmlFor={id} className={`${BOTAO_SECUNDARIO} cursor-pointer`}>
          <FileAudio size={24} strokeWidth={2.5} aria-hidden="true" />
          <span>Escolher arquivo</span>
          <input
            id={id}
            type="file"
            accept="audio/*"
            className="sr-only"
            onChange={(evento) => {
              const arquivo = evento.target.files?.[0] ?? null
              evento.target.value = ''
              if (arquivo !== null) {
                actions.definirAudio(pergunta.id, arquivo)
              }
            }}
          />
        </label>
      </div>
      {gravador.erro !== null ? <p className="m-0 text-base text-erro">{gravador.erro}</p> : null}
      {gravador.situacao === 'indisponivel' ? (
        <p className="m-0 text-base text-discreto">Este navegador não permite gravar. Escolha um arquivo de áudio.</p>
      ) : null}
    </div>
  )
}
