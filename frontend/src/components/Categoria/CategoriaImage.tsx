const IMAGEM = 'aspect-square w-full max-w-32 rounded-xl bg-surface object-contain p-2'

export interface ICategoriaImageProps {
  pictograma: string
  pictogramaAlt: string
}

export function CategoriaImage({ pictograma, pictogramaAlt }: ICategoriaImageProps) {
  return <img src={`/pictogramas/${pictograma}`} alt={pictogramaAlt} className={IMAGEM} />
}
