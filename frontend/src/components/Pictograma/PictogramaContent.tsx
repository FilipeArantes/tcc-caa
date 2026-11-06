import { usePictogramaContext } from './usePictogramaContext'

const CONTEUDO = 'w-full text-center text-rotulo font-bold leading-tight break-words'

export interface IPictogramaContentProps {
  text: string
}

export function PictogramaContent({ text }: IPictogramaContentProps) {
  const { meta } = usePictogramaContext()

  return <span className={[CONTEUDO, meta.estilo.texto].join(' ')}>{text}</span>
}
