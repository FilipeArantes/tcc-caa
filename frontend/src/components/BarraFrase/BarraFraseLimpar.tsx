import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useBarraFraseContext } from './useBarraFraseContext'
import { Dialogo } from '../Dialogo'

const BOTAO =
  'flex h-acao min-w-acao items-center justify-center gap-2 rounded-2xl border-2 border-borda bg-surface px-4 sm:px-6 ' +
  'text-rotulo font-bold text-texto transition-colors hover:bg-fundo active:bg-fundo ' +
  'disabled:cursor-not-allowed disabled:opacity-40'

export function BarraFraseLimpar() {
  const { state, actions } = useBarraFraseContext()
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
        disabled={state.vazia}
        aria-label="Limpar toda a frase"
        className={BOTAO}
      >
        <Trash2 size={28} strokeWidth={2.5} aria-hidden="true" />
        <span className="max-sm:sr-only">Limpar</span>
      </button>

      <Dialogo.Root
        aberto={confirmando}
        aoFechar={() => setConfirmando(false)}
        titulo="Limpar a frase"
      >
        <Dialogo.Titulo>Limpar a frase?</Dialogo.Titulo>
        <Dialogo.Texto>Todos os pictogramas escolhidos serão apagados.</Dialogo.Texto>
        <Dialogo.Acoes>
          <Dialogo.Cancelar onClick={() => setConfirmando(false)}>Cancelar</Dialogo.Cancelar>
          <Dialogo.Confirmar onClick={confirmar}>Limpar tudo</Dialogo.Confirmar>
        </Dialogo.Acoes>
      </Dialogo.Root>
    </>
  )
}
