import { ChevronRight } from 'lucide-react'

const TRILHA = 'flex items-center gap-2 text-rotulo font-bold text-texto'

const ATUAL = 'text-primary'

export interface INavegacaoTrilhaProps {
  caminho: string[]
}

export function NavegacaoTrilha({ caminho }: INavegacaoTrilhaProps) {
  return (
    <nav aria-label="Caminho" className={TRILHA}>
      {caminho.map((passo, indice) => (
        <span key={passo} className="flex items-center gap-2">
          {indice > 0 ? <ChevronRight size={22} aria-hidden="true" /> : null}
          <span className={indice === caminho.length - 1 ? ATUAL : undefined}>{passo}</span>
        </span>
      ))}
    </nav>
  )
}
