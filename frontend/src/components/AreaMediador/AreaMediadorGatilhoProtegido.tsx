import { KeyRound } from 'lucide-react'
import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { GATILHO_BASE } from './estilos'
import { useAreaMediadorContext } from './useAreaMediadorContext'

const GATILHO = `${GATILHO_BASE} text-discreto hover:bg-fundo`

const PROGRESSO = 'absolute inset-x-1 bottom-1 h-1 origin-left rounded-full bg-primary'

function teclaDeAcionar(evento: KeyboardEvent<HTMLButtonElement>): boolean {
  return evento.key === 'Enter' || evento.key === ' '
}

export function AreaMediadorGatilhoProtegido() {
  const { actions, meta } = useAreaMediadorContext()
  const [segurando, setSegurando] = useState(false)
  const temporizador = useRef<number | null>(null)
  const idDica = useId()

  function cancelar() {
    if (temporizador.current !== null) {
      window.clearTimeout(temporizador.current)
      temporizador.current = null
    }

    setSegurando(false)
  }

  function iniciar() {
    if (temporizador.current !== null) {
      return
    }

    setSegurando(true)
    temporizador.current = window.setTimeout(() => {
      temporizador.current = null
      setSegurando(false)
      actions.abrir()
    }, meta.tempoParaAbrirMs)
  }

  useEffect(
    () => () => {
      if (temporizador.current !== null) {
        window.clearTimeout(temporizador.current)
      }
    },
    []
  )

  function aoPressionar(evento: PointerEvent<HTMLButtonElement>) {
    if (evento.button === 0) {
      iniciar()
    }
  }

  function aoTeclar(evento: KeyboardEvent<HTMLButtonElement>) {
    if (teclaDeAcionar(evento)) {
      evento.preventDefault()

      if (!evento.repeat) {
        iniciar()
      }
    }
  }

  function aoSoltarTecla(evento: KeyboardEvent<HTMLButtonElement>) {
    if (teclaDeAcionar(evento)) {
      cancelar()
    }
  }

  return (
    <button
      type="button"
      aria-label="Área do mediador"
      aria-describedby={idDica}
      title="Área do mediador: mantenha pressionado"
      className={GATILHO}
      onPointerDown={aoPressionar}
      onPointerUp={cancelar}
      onPointerLeave={cancelar}
      onPointerCancel={cancelar}
      onKeyDown={aoTeclar}
      onKeyUp={aoSoltarTecla}
      onBlur={cancelar}
      onContextMenu={(evento) => evento.preventDefault()}
    >
      <KeyRound size={22} strokeWidth={2.25} aria-hidden="true" />
      <span id={idDica} className="sr-only">
        Mantenha pressionado por {meta.tempoParaAbrirMs / 1000} segundos para abrir.
      </span>
      <span
        aria-hidden="true"
        style={segurando ? { transitionDuration: `${meta.tempoParaAbrirMs}ms` } : undefined}
        className={[PROGRESSO, segurando ? 'scale-x-100 transition-transform ease-linear' : 'scale-x-0'].join(' ')}
      />
    </button>
  )
}
