import { AreaMediadorAcoes } from './AreaMediadorAcoes'
import { AreaMediadorAvisoErro } from './AreaMediadorAvisoErro'
import { AreaMediadorCabecalho } from './AreaMediadorCabecalho'
import { AreaMediadorCreditos } from './AreaMediadorCreditos'
import { AreaMediadorDesconectar } from './AreaMediadorDesconectar'
import { AreaMediadorDispositivo } from './AreaMediadorDispositivo'
import { AreaMediadorEntrarComGoogle } from './AreaMediadorEntrarComGoogle'
import { AreaMediadorFaixa } from './AreaMediadorFaixa'
import { AreaMediadorGatilhoAtivo } from './AreaMediadorGatilhoAtivo'
import { AreaMediadorGatilhoProtegido } from './AreaMediadorGatilhoProtegido'
import { AreaMediadorLatencia } from './AreaMediadorLatencia'
import { AreaMediadorPerfil } from './AreaMediadorPerfil'
import { AreaMediadorProvider } from './AreaMediadorProvider'
import { AreaMediadorRoot } from './AreaMediadorRoot'
import { AreaMediadorSecao } from './AreaMediadorSecao'
import { AreaMediadorTexto } from './AreaMediadorTexto'
import { AreaMediadorVoltarAoNormal } from './AreaMediadorVoltarAoNormal'

export const AreaMediador = {
  Provider: AreaMediadorProvider,
  GatilhoProtegido: AreaMediadorGatilhoProtegido,
  GatilhoAtivo: AreaMediadorGatilhoAtivo,
  Faixa: AreaMediadorFaixa,
  Root: AreaMediadorRoot,
  Cabecalho: AreaMediadorCabecalho,
  AvisoErro: AreaMediadorAvisoErro,
  Secao: AreaMediadorSecao,
  Dispositivo: AreaMediadorDispositivo,
  Texto: AreaMediadorTexto,
  Perfil: AreaMediadorPerfil,
  Acoes: AreaMediadorAcoes,
  EntrarComGoogle: AreaMediadorEntrarComGoogle,
  VoltarAoNormal: AreaMediadorVoltarAoNormal,
  Desconectar: AreaMediadorDesconectar,
  Latencia: AreaMediadorLatencia,
  Creditos: AreaMediadorCreditos,
}
