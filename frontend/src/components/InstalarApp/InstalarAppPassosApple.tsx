import { Share, SquarePlus } from 'lucide-react'
import type { OlHTMLAttributes } from 'react'

const LISTA = 'm-0 flex list-none flex-col gap-3 p-0'

const PASSO = 'flex items-center gap-4 text-rotulo leading-snug text-texto'

const ICONE = 'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary'

export type IInstalarAppPassosAppleProps = OlHTMLAttributes<HTMLOListElement>

export function InstalarAppPassosApple(props: IInstalarAppPassosAppleProps) {
  return (
    <ol {...props} className={LISTA}>
      <li className={PASSO}>
        <span className={ICONE}>
          <Share size={26} strokeWidth={2.5} aria-hidden="true" />
        </span>
        <span>
          Toque em <strong>Compartilhar</strong>, na barra do Safari.
        </span>
      </li>
      <li className={PASSO}>
        <span className={ICONE}>
          <SquarePlus size={26} strokeWidth={2.5} aria-hidden="true" />
        </span>
        <span>
          Role a lista e toque em <strong>Adicionar à Tela de Início</strong>.
        </span>
      </li>
    </ol>
  )
}
