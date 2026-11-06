const IMAGEM = 'aspect-square w-full rounded-xl bg-surface object-contain p-1'

export interface IPictogramaImageProps {
  pictograma: string
  pictogramaAlt: string
}

export function PictogramaImage({ pictograma, pictogramaAlt }: IPictogramaImageProps) {
  return <img src={`/pictogramas/${pictograma}`} alt={pictogramaAlt} className={IMAGEM} />
}
