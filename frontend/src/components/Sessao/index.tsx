import { SessaoConclusaoLogin } from './SessaoConclusaoLogin'
import { SessaoConectado } from './SessaoConectado'
import { SessaoModoMediador } from './SessaoModoMediador'
import { SessaoModoNormal } from './SessaoModoNormal'
import { SessaoModoUsuario } from './SessaoModoUsuario'
import { SessaoProvider } from './SessaoProvider'
import { SessaoVisitante } from './SessaoVisitante'

export const Sessao = {
  Provider: SessaoProvider,
  Visitante: SessaoVisitante,
  Conectado: SessaoConectado,
  ModoNormal: SessaoModoNormal,
  ModoUsuario: SessaoModoUsuario,
  ModoMediador: SessaoModoMediador,
  ConclusaoLogin: SessaoConclusaoLogin,
}
