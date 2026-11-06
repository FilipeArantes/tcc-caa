import { Escrita } from '../components/Escrita'

const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÇ'.split('')

const LETRAS_COM_ACENTO = ['Á', 'Â', 'Ã', 'É', 'Ê', 'Í', 'Ó', 'Ô', 'Õ', 'Ú']

export function EscritaLivrePage() {
  return (
    <Escrita.Provider>
      <Escrita.Root>
        <Escrita.Painel aria-label="Texto em construção">
          <Escrita.Visor />
          <Escrita.Falar />
          <Escrita.Apagar />
          <Escrita.Limpar />
        </Escrita.Painel>

        <Escrita.Teclado rotulo="Letras">
          {LETRAS.map((letra) => (
            <Escrita.Tecla key={letra} letra={letra} />
          ))}
          <Escrita.Espaco />
        </Escrita.Teclado>

        <Escrita.Teclado rotulo="Letras com acento">
          {LETRAS_COM_ACENTO.map((letra) => (
            <Escrita.Tecla key={letra} letra={letra} />
          ))}
        </Escrita.Teclado>
      </Escrita.Root>
    </Escrita.Provider>
  )
}
