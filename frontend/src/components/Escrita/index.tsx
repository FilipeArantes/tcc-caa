import { EscritaApagar } from './EscritaApagar'
import { EscritaEspaco } from './EscritaEspaco'
import { EscritaFalar } from './EscritaFalar'
import { EscritaLimpar } from './EscritaLimpar'
import { EscritaPainel } from './EscritaPainel'
import { EscritaProvider } from './EscritaProvider'
import { EscritaRoot } from './EscritaRoot'
import { EscritaTecla } from './EscritaTecla'
import { EscritaTeclado } from './EscritaTeclado'
import { EscritaVisor } from './EscritaVisor'

export const Escrita = {
  Provider: EscritaProvider,
  Root: EscritaRoot,
  Painel: EscritaPainel,
  Visor: EscritaVisor,
  Falar: EscritaFalar,
  Apagar: EscritaApagar,
  Limpar: EscritaLimpar,
  Teclado: EscritaTeclado,
  Tecla: EscritaTecla,
  Espaco: EscritaEspaco,
}
