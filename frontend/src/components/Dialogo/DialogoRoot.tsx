import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react'
import { useProtecaoToqueDuplo } from '../../hooks/useProtecaoToqueDuplo'

const SOBREPOSICAO =
  'fixed inset-0 z-50 flex items-center justify-center bg-texto/60 p-4 sm:p-6'

const CARTAO =
  'flex max-h-full w-full max-w-xl flex-col gap-6 overflow-y-auto rounded-3xl border ' +
  'border-borda bg-surface p-6 shadow-lg sm:p-8 [&>*]:shrink-0'

export interface IDialogoRootProps {
  aberto: boolean
  aoFechar: () => void
  titulo: string
  children: ReactNode
}

export function DialogoRoot({ aberto, aoFechar, titulo, children }: IDialogoRootProps) {
  const cartaoRef = useRef<HTMLDivElement>(null)
  const focoAnteriorRef = useRef<HTMLElement | null>(null)
  const protecao = useProtecaoToqueDuplo()

  useEffect(() => {
    if (aberto) {
      protecao.marcarMudanca()
    }
  }, [aberto, protecao])

  function barrarToquePrecoce(evento: MouseEvent<HTMLDivElement>) {
    if (!protecao.toqueLiberado()) {
      evento.preventDefault()
      evento.stopPropagation()
    }
  }

  useEffect(() => {
    if (!aberto) {
      return
    }

    focoAnteriorRef.current = document.activeElement as HTMLElement

    const primeiroFocavel = cartaoRef.current?.querySelector<HTMLElement>('input, select, textarea, button')
    primeiroFocavel?.focus()

    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === 'Escape') {
        aoFechar()
        return
      }

      if (evento.key !== 'Tab' || cartaoRef.current === null) {
        return
      }

      const focaveis = cartaoRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )

      if (focaveis.length === 0) {
        return
      }

      const primeiro = focaveis[0]
      const ultimo = focaveis[focaveis.length - 1]

      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault()
        ultimo.focus()
      }

      if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault()
        primeiro.focus()
      }
    }

    document.addEventListener('keydown', aoTeclar)

    return () => {
      document.removeEventListener('keydown', aoTeclar)
      focoAnteriorRef.current?.focus()
    }
  }, [aberto, aoFechar])

  if (!aberto) {
    return null
  }

  return (
    <div className={SOBREPOSICAO} onClickCapture={barrarToquePrecoce} onClick={aoFechar} role="presentation">
      <div
        ref={cartaoRef}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className={CARTAO}
        onClick={(evento) => evento.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
