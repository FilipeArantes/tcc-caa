import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Dialogo } from '../Dialogo'
import { useEscritaContext } from './useEscritaContext'

const BOTAO =
  'flex h-acao min-w-acao items-center justify-center gap-2 rounded-2xl border-2 border-borda bg-surface px-4 sm:px-6 ' +
  'text-rotulo font-bold text-texto transition-colors hover:bg-fundo active:bg-fundo ' +
  'disabled:cursor-not-allowed disabled:opacity-40'

export function EscritaLimpar() {
  const { state, actions } = useEscritaContext()
  const [confirmando, setConfirmando] = useState(false)

  function confirmar() {
    actions.limpar()
    setConfirmando(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        disabled={state.texto.length === 0}
        aria-label="Limpar todo o texto"
        className={BOTAO}
      >
        <Trash2 size={28} strokeWidth={2.5} aria-hidden="true" />
        <span className="max-sm:sr-only">Limpar</span>
      </button>

      <Dialogo.Root aberto={confirmando} aoFechar={() => setConfirmando(false)} titulo="Limpar o texto">
        <Dialogo.Titulo>Limpar o texto?</Dialogo.Titulo>
        <Dialogo.Texto>Todas as letras escritas serão apagadas.</Dialogo.Texto>
        <Dialogo.Acoes>
          <Dialogo.Cancelar onClick={() => setConfirmando(false)}>Cancelar</Dialogo.Cancelar>
          <Dialogo.Confirmar onClick={confirmar}>Limpar tudo</Dialogo.Confirmar>
        </Dialogo.Acoes>
      </Dialogo.Root>
    </>
  )
}
