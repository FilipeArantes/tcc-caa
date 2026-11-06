import { useCategoriaContext } from './useCategoriaContext'

const CONTEUDO = 'w-full text-center text-2xl font-bold leading-tight break-words'

export interface ICategoriaContentProps {
  text: string
}

export function CategoriaContent({ text }: ICategoriaContentProps) {
  const { meta } = useCategoriaContext()

  return <span className={[CONTEUDO, meta.estilo.texto].join(' ')}>{text}</span>
}
