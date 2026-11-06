import { useEscritaContext } from './useEscritaContext'

const VISOR =
  'm-0 flex min-h-20 min-w-0 flex-1 basis-full items-center sm:min-h-28 sm:basis-80 overflow-x-auto rounded-xl bg-fundo px-4 py-3 ' +
  'text-[32px] font-bold sm:text-[40px] uppercase leading-tight tracking-wide text-texto whitespace-pre-wrap break-words'

const VAZIO = 'text-entrada font-normal normal-case tracking-normal text-discreto'

const CURSOR = 'ml-1 inline-block h-[1em] w-1 shrink-0 rounded-full bg-primary align-middle'

export function EscritaVisor() {
  const { state } = useEscritaContext()

  return (
    <output aria-live="polite" aria-label="Texto escrito" className={VISOR}>
      {state.texto.length === 0 ? (
        <span className={VAZIO}>Toque nas letras para escrever</span>
      ) : (
        <span>
          {state.texto}
          <span aria-hidden="true" className={CURSOR} />
        </span>
      )}
    </output>
  )
}
