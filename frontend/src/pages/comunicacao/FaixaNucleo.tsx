import { Nucleo } from '../../components/Nucleo'
import type { Pictograma } from '../../types/Pictograma'

export interface IFaixaNucleoProps {
  palavras: Pictograma[]
  aoEscolher: (palavra: Pictograma) => void
}

export function FaixaNucleo({ palavras, aoEscolher }: IFaixaNucleoProps) {
  return (
    <Nucleo.Root>
      {palavras.map((palavra) => (
        <Nucleo.Palavra
          key={palavra.id}
          gramatical={palavra.categoria_gramatical ?? 'diversos'}
          pictograma={palavra.nome_pictograma}
          texto={palavra.texto_pictograma}
          onClick={() => aoEscolher(palavra)}
        />
      ))}
    </Nucleo.Root>
  )
}
